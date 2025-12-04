-- ================================================
-- Portfolio Database Schema
-- Database: portfolio_db
-- ================================================
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;
-- ================================================
-- 1. PROFILE TABLE
-- Stores personal information
-- ================================================
CREATE TABLE profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    professional_title VARCHAR(150) NOT NULL,
    bio TEXT,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    facebook_url VARCHAR(255),
    profile_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO profile (
        full_name,
        professional_title,
        bio,
        email,
        phone,
        facebook_url,
        profile_photo_url
    )
VALUES (
        'Janus Dominic',
        'Full-Stack Developer & Software Engineer',
        'Passionate developer with expertise in building modern web applications. Specializing in PHP, MySQL, JavaScript, and creating seamless user experiences.',
        'janusdominic0@gmail.com',
        '+63 994 873 9200',
        'https://www.facebook.com/notagirlgamer69',
        'https://i.pravatar.cc/400?img=33'
    );
-- ================================================
-- 2. SKILL CATEGORIES TABLE
-- Organizes skills into categories
-- ================================================
CREATE TABLE skill_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO skill_categories (name, description)
VALUES (
        'Programming Languages',
        'Core programming and scripting languages'
    ),
    (
        'Web Development',
        'Frontend and backend web technologies'
    ),
    ('Database', 'Database management systems'),
    (
        'Tools & Frameworks',
        'Development tools and frameworks'
    ),
    (
        'Soft Skills',
        'Non-technical professional skills'
    );
-- ================================================
-- 3. SKILLS TABLE
-- Stores technical and soft skills with proficiency
-- INDEX: On proficiency for performance queries
-- ================================================
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    proficiency INT NOT NULL CHECK (
        proficiency BETWEEN 0 AND 100
    ),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE
    SET NULL,
        INDEX idx_proficiency (proficiency),
        INDEX idx_category (category_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO skills (name, proficiency, category_id)
VALUES ('PHP', 90, 1),
    ('JavaScript', 85, 1),
    ('Python', 75, 1),
    ('HTML5/CSS3', 95, 2),
    ('React', 80, 2),
    ('Tailwind CSS', 88, 2),
    ('MySQL', 92, 3),
    ('PostgreSQL', 70, 3),
    ('Git & GitHub', 85, 4),
    ('VS Code', 90, 4),
    ('Problem Solving', 88, 5),
    ('Team Collaboration', 85, 5);
-- ================================================
-- 4. PROJECTS TABLE
-- Stores portfolio projects
-- INDEX: On status and featured for filtering
-- ================================================
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    project_url VARCHAR(255),
    repo_url VARCHAR(255),
    image_url VARCHAR(255),
    project_date DATE,
    status ENUM(
        'planning',
        'in-progress',
        'completed',
        'archived'
    ) DEFAULT 'completed',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_date (project_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO projects (
        title,
        description,
        project_url,
        repo_url,
        image_url,
        project_date,
        status,
        featured
    )
VALUES (
        'E-Commerce Platform',
        'Full-featured online shopping platform with payment integration, inventory management, and admin dashboard.',
        'https://example.com/ecommerce',
        'https://github.com/janusinss/ecommerce',
        'https://placehold.co/600x400/4338ca/FFF?text=E-Commerce',
        '2024-03-15',
        'completed',
        TRUE
    ),
    (
        'Task Management App',
        'Collaborative task management application with real-time updates and team features.',
        'https://example.com/taskapp',
        'https://github.com/janusinss/taskapp',
        'https://placehold.co/600x400/0891b2/FFF?text=Task+Manager',
        '2024-01-20',
        'completed',
        TRUE
    ),
    (
        'Weather Dashboard',
        'Real-time weather dashboard with API integration and interactive charts.',
        'https://example.com/weather',
        'https://github.com/janusinss/weather',
        'https://placehold.co/600x400/16a34a/FFF?text=Weather+App',
        '2023-11-10',
        'completed',
        FALSE
    );
-- ================================================
-- 5. PROJECT_SKILLS (Junction Table)
-- Links projects to skills used
-- Demonstrates MANY-TO-MANY relationship
-- ================================================
CREATE TABLE project_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id),
    INDEX idx_project (project_id),
    INDEX idx_skill (skill_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO project_skills (project_id, skill_id)
VALUES (1, 1),
    (1, 4),
    (1, 7),
    -- E-Commerce uses PHP, HTML/CSS, MySQL
    (2, 2),
    (2, 5),
    (2, 7),
    -- Task App uses JavaScript, React, MySQL
    (3, 2),
    (3, 4),
    (3, 6);
-- Weather uses JavaScript, HTML/CSS, Tailwind
-- ================================================
-- 6. HOBBIES TABLE
-- Stores personal interests and hobbies
-- ================================================
CREATE TABLE hobbies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO hobbies (name, description)
VALUES ('Gaming', 'Playing strategy and RPG games'),
    (
        'Reading Tech Blogs',
        'Staying updated with latest technology trends'
    ),
    (
        'Photography',
        'Capturing moments and landscapes'
    ),
    (
        'Coding Side Projects',
        'Building experimental applications'
    ),
    ('Basketball', 'Playing recreational basketball');
-- ================================================
-- 7. EDUCATION TABLE
-- Stores educational background
-- INDEX: On dates for timeline queries
-- ================================================
CREATE TABLE education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150),
    start_date DATE NOT NULL,
    end_date DATE,
    grade VARCHAR(20),
    description TEXT,
    location VARCHAR(100),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_start_date (start_date),
    INDEX idx_is_current (is_current)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO education (
        institution,
        degree,
        field_of_study,
        start_date,
        end_date,
        grade,
        description,
        location,
        is_current
    )
VALUES (
        'Western Mindanao State University',
        'Bachelor of Science',
        'Computer Science',
        '2019-08-01',
        '2023-06-15',
        '3.8 GPA',
        'Focused on software engineering, database systems, and web development. Dean\'s Lister for 4 consecutive semesters.',
        'Diliman, Quezon City',
        FALSE
    ),
    (
        'Zamboanga National High School West',
        'High School Diploma',
        'STEM Track',
        '2015-06-01',
        '2019-04-01',
        'With Honors',
        'Specialized in Science, Technology, Engineering, and Mathematics.',
        'Pasig City',
        FALSE
    );
-- ================================================
-- 8. CERTIFICATIONS TABLE
-- Stores professional certifications and credentials
-- INDEX: On dates for validity checks
-- ================================================
CREATE TABLE certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(100),
    credential_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_issue_date (issue_date),
    INDEX idx_expiry_date (expiry_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO certifications (
        title,
        issuing_organization,
        issue_date,
        expiry_date,
        credential_id,
        credential_url,
        description
    )
VALUES (
        'AWS Certified Developer - Associate',
        'Amazon Web Services',
        '2024-02-15',
        '2027-02-15',
        'AWS-DEV-2024-12345',
        'https://aws.amazon.com/verification/12345',
        'Validates expertise in developing and maintaining AWS-based applications'
    ),
    (
        'MySQL Database Administrator',
        'Oracle Corporation',
        '2023-09-20',
        NULL,
        'MYSQL-DBA-67890',
        'https://oracle.com/cert/67890',
        'Professional certification for MySQL database administration'
    ),
    (
        'Full-Stack Web Development',
        'freeCodeCamp',
        '2023-05-10',
        NULL,
        'FCC-FS-2023',
        'https://freecodecamp.org/certification/janusinss/fullstack',
        'Completed 1800+ hours of full-stack development curriculum'
    );
-- ================================================
-- 9. EXPERIENCE TABLE
-- Stores work experience records
-- INDEX: On dates for duration calculations
-- ================================================
CREATE TABLE experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    employment_type ENUM(
        'full-time',
        'part-time',
        'contract',
        'internship',
        'freelance'
    ) DEFAULT 'full-time',
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_start_date (start_date),
    INDEX idx_is_current (is_current)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO experience (
        company,
        position,
        employment_type,
        location,
        start_date,
        end_date,
        is_current,
        description
    )
VALUES (
        'TechStart Solutions Inc.',
        'Junior Full-Stack Developer',
        'full-time',
        'Makati City, Metro Manila',
        '2023-07-01',
        NULL,
        TRUE,
        'Developing and maintaining web applications using PHP, MySQL, and React. Collaborating with cross-functional teams to deliver high-quality software solutions.'
    ),
    (
        'Digital Innovations Co.',
        'Web Development Intern',
        'internship',
        'Pasig City, Metro Manila',
        '2023-01-15',
        '2023-06-30',
        FALSE,
        'Assisted in building responsive websites and learned industry best practices. Worked on 5+ client projects during the internship period.'
    ),
    (
        'Freelance Developer',
        'Full-Stack Developer',
        'freelance',
        'Remote',
        '2022-06-01',
        '2022-12-31',
        FALSE,
        'Built custom websites and web applications for various clients. Specialized in PHP/MySQL backend development and modern frontend frameworks.'
    );
-- ================================================
-- 10. ACHIEVEMENTS TABLE
-- Stores awards, recognitions, and accomplishments
-- INDEX: On category and date for filtering
-- ================================================
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    category ENUM(
        'award',
        'recognition',
        'competition',
        'publication',
        'other'
    ) DEFAULT 'other',
    description TEXT,
    date_achieved DATE NOT NULL,
    issuing_organization VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_date (date_achieved)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Sample Data
INSERT INTO achievements (
        title,
        category,
        description,
        date_achieved,
        issuing_organization
    )
VALUES (
        'Best Capstone Project Award',
        'award',
        'Recognized for outstanding capstone project in Computer Science with innovative approach to solving real-world problems.',
        '2023-06-01',
        'University of the Philippines'
    ),
    (
        'Hackathon Winner - Smart City Solutions',
        'competition',
        '1st Place in 48-hour hackathon for developing a smart parking solution using IoT and web technologies.',
        '2023-03-15',
        'Manila Tech Fest 2023'
    ),
    (
        'Dean\'s List - 8 Consecutive Semesters',
        'recognition',
        'Consistently maintained high academic performance throughout college education.',
        '2023-06-01',
        'University of the Philippines'
    ),
    (
        'Open Source Contributor Recognition',
        'recognition',
        'Recognized for significant contributions to open-source PHP projects on GitHub.',
        '2024-01-20',
        'GitHub Community'
    );
-- ================================================
-- 11. CONTACTS TABLE
-- Stores visitor messages and inquiries
-- INDEX: On received_at for sorting
-- ================================================
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP NULL,
    INDEX idx_received (received_at),
    INDEX idx_is_read (is_read)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ================================================
-- VIEWS (Optional but useful)
-- ================================================
-- View: Complete skill overview with categories
CREATE VIEW v_skills_overview AS
SELECT s.id,
    s.name,
    s.proficiency,
    c.name as category_name,
    c.description as category_description
FROM skills s
    LEFT JOIN skill_categories c ON s.category_id = c.id
ORDER BY s.proficiency DESC;
-- View: Active work experience with duration
CREATE VIEW v_current_experience AS
SELECT id,
    company,
    position,
    employment_type,
    location,
    start_date,
    TIMESTAMPDIFF(MONTH, start_date, CURDATE()) as months_employed,
    CONCAT(
        FLOOR(TIMESTAMPDIFF(MONTH, start_date, CURDATE()) / 12),
        ' years ',
        MOD(TIMESTAMPDIFF(MONTH, start_date, CURDATE()), 12),
        ' months'
    ) as duration_text
FROM experience
WHERE is_current = TRUE;
-- View: Projects with skill count
CREATE VIEW v_projects_summary AS
SELECT p.id,
    p.title,
    p.status,
    p.featured,
    COUNT(ps.skill_id) as skill_count,
    p.project_date
FROM projects p
    LEFT JOIN project_skills ps ON p.id = ps.project_id
GROUP BY p.id,
    p.title,
    p.status,
    p.featured,
    p.project_date
ORDER BY p.project_date DESC;
-- ================================================
-- STORED PROCEDURES (Optional Advanced Feature)
-- ================================================
DELIMITER // -- Procedure: Get portfolio statistics
CREATE PROCEDURE sp_get_portfolio_stats() BEGIN
SELECT (
        SELECT COUNT(*)
        FROM skills
    ) as total_skills,
    (
        SELECT COUNT(*)
        FROM projects
        WHERE status = 'completed'
    ) as completed_projects,
    (
        SELECT COUNT(*)
        FROM education
    ) as education_count,
    (
        SELECT COUNT(*)
        FROM certifications
    ) as certifications_count,
    (
        SELECT COUNT(*)
        FROM achievements
    ) as achievements_count,
    (
        SELECT COUNT(*)
        FROM experience
    ) as experience_count,
    (
        SELECT AVG(proficiency)
        FROM skills
    ) as avg_skill_proficiency;
END // -- Procedure: Get skills by category with stats
CREATE PROCEDURE sp_skills_by_category() BEGIN
SELECT c.name as category,
    COUNT(s.id) as skill_count,
    AVG(s.proficiency) as avg_proficiency,
    MAX(s.proficiency) as max_proficiency,
    MIN(s.proficiency) as min_proficiency
FROM skill_categories c
    LEFT JOIN skills s ON c.id = s.category_id
GROUP BY c.id,
    c.name
HAVING skill_count > 0
ORDER BY avg_proficiency DESC;
END // DELIMITER;
-- ================================================
-- INDEXES SUMMARY
-- ================================================
-- The following indexes are created for query optimization:
-- 1. skills: idx_proficiency, idx_category
-- 2. projects: idx_status, idx_featured, idx_date
-- 3. project_skills: idx_project, idx_skill
-- 4. education: idx_start_date, idx_is_current
-- 5. certifications: idx_issue_date, idx_expiry_date
-- 6. experience: idx_start_date, idx_is_current
-- 7. achievements: idx_category, idx_date
-- 8. contacts: idx_received, idx_is_read
-- ================================================
-- ================================================
-- END OF SCHEMA
-- ================================================
-- Verify tables
SHOW TABLES;
-- Verify sample data counts
SELECT 'profile' as table_name,
    COUNT(*) as record_count
FROM profile
UNION ALL
SELECT 'skill_categories',
    COUNT(*)
FROM skill_categories
UNION ALL
SELECT 'skills',
    COUNT(*)
FROM skills
UNION ALL
SELECT 'projects',
    COUNT(*)
FROM projects
UNION ALL
SELECT 'project_skills',
    COUNT(*)
FROM project_skills
UNION ALL
SELECT 'hobbies',
    COUNT(*)
FROM hobbies
UNION ALL
SELECT 'education',
    COUNT(*)
FROM education
UNION ALL
SELECT 'certifications',
    COUNT(*)
FROM certifications
UNION ALL
SELECT 'experience',
    COUNT(*)
FROM experience
UNION ALL
SELECT 'achievements',
    COUNT(*)
FROM achievements;