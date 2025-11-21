<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../database.php';

$database = new Database();
$db = $database->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // ===== DEMONSTRATION OF ADVANCED SQL QUERIES =====
        
        // 1. AGGREGATE FUNCTIONS - Portfolio Statistics
        $statsQuery = '
            SELECT 
                (SELECT COUNT(*) FROM skills) as total_skills,
                (SELECT COUNT(*) FROM projects WHERE status = "completed") as completed_projects,
                (SELECT COUNT(*) FROM certifications) as total_certifications,
                (SELECT COUNT(*) FROM achievements) as total_achievements,
                (SELECT COUNT(*) FROM education) as education_count,
                (SELECT COUNT(*) FROM experience) as work_experience_count,
                (SELECT AVG(proficiency) FROM skills) as avg_skill_proficiency,
                (SELECT MAX(proficiency) FROM skills) as max_proficiency
        ';
        $statsStmt = $db->prepare($statsQuery);
        $statsStmt->execute();
        $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

        // 2. JOIN - Skills with Categories
        $skillsQuery = '
            SELECT 
                c.name as category_name,
                COUNT(s.id) as skill_count,
                AVG(s.proficiency) as avg_proficiency,
                GROUP_CONCAT(s.name ORDER BY s.proficiency DESC SEPARATOR ", ") as skills
            FROM skill_categories c
            LEFT JOIN skills s ON c.id = s.category_id
            GROUP BY c.id, c.name
            HAVING skill_count > 0
            ORDER BY avg_proficiency DESC
        ';
        $skillsStmt = $db->prepare($skillsQuery);
        $skillsStmt->execute();
        $skillsByCategory = $skillsStmt->fetchAll(PDO::FETCH_ASSOC);

        // 3. SUBQUERY - Featured Projects with High-Skill Usage
        $featuredQuery = '
            SELECT p.title, p.status,
                (SELECT COUNT(*) 
                 FROM project_skills ps 
                 JOIN skills s ON ps.skill_id = s.id 
                 WHERE ps.project_id = p.id AND s.proficiency > 80
                ) as high_skill_count
            FROM projects p
            WHERE p.featured = 1 AND p.status = "completed"
            HAVING high_skill_count > 0
            ORDER BY high_skill_count DESC
        ';
        $featuredStmt = $db->prepare($featuredQuery);
        $featuredStmt->execute();
        $featuredProjects = $featuredStmt->fetchAll(PDO::FETCH_ASSOC);

        // 4. CTE (Common Table Expression) - Experience Summary with Duration
        $experienceQuery = '
            WITH ExperienceDuration AS (
                SELECT 
                    id, company, position,
                    TIMESTAMPDIFF(MONTH, start_date, COALESCE(end_date, CURDATE())) as months
                FROM experience
            )
            SELECT 
                company, position,
                months,
                CONCAT(FLOOR(months / 12), "y ", MOD(months, 12), "m") as duration
            FROM ExperienceDuration
            WHERE months > 0
            ORDER BY months DESC
        ';
        $expStmt = $db->prepare($experienceQuery);
        $expStmt->execute();
        $experienceSummary = $expStmt->fetchAll(PDO::FETCH_ASSOC);

        // 5. Complex GROUP BY with HAVING - Achievement Categories
        $achievementsQuery = '
            SELECT 
                category,
                COUNT(*) as count,
                MAX(date_achieved) as latest_date,
                GROUP_CONCAT(title ORDER BY date_achieved DESC SEPARATOR " | ") as titles
            FROM achievements
            GROUP BY category
            HAVING count > 0
            ORDER BY count DESC, latest_date DESC
        ';
        $achStmt = $db->prepare($achievementsQuery);
        $achStmt->execute();
        $achievementStats = $achStmt->fetchAll(PDO::FETCH_ASSOC);

        // 6. Advanced JOIN - Projects with Skills Used
        $projectSkillsQuery = '
            SELECT 
                p.id, p.title,
                COUNT(ps.skill_id) as skill_count,
                GROUP_CONCAT(s.name ORDER BY s.proficiency DESC SEPARATOR ", ") as technologies,
                AVG(s.proficiency) as avg_tech_proficiency
            FROM projects p
            LEFT JOIN project_skills ps ON p.id = ps.project_id
            LEFT JOIN skills s ON ps.skill_id = s.id
            WHERE p.status = "completed"
            GROUP BY p.id, p.title
            HAVING skill_count > 0
            ORDER BY avg_tech_proficiency DESC, skill_count DESC
            LIMIT 5
        ';
        $projSkillStmt = $db->prepare($projectSkillsQuery);
        $projSkillStmt->execute();
        $topProjects = $projSkillStmt->fetchAll(PDO::FETCH_ASSOC);

        // Compile all results
        $response = array(
            'overview' => $stats,
            'skills_by_category' => $skillsByCategory,
            'featured_projects' => $featuredProjects,
            'experience_summary' => $experienceSummary,
            'achievement_stats' => $achievementStats,
            'top_projects' => $topProjects,
            'sql_demonstrations' => array(
                'aggregate_functions' => 'Used COUNT, AVG, MAX in overview',
                'joins' => 'Used LEFT JOIN in skills and projects queries',
                'subqueries' => 'Used in featured projects query',
                'cte' => 'Used WITH clause in experience summary',
                'group_by_having' => 'Used in multiple queries with aggregation',
                'indexes' => 'Utilized on proficiency, dates, and foreign keys'
            )
        );

        http_response_code(200);
        echo json_encode($response, JSON_PRETTY_PRINT);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array(
            'message' => 'Error retrieving statistics',
            'error' => $e->getMessage()
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Method Not Allowed (GET only)'));
}
?>