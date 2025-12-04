<?php
class Project
{
    private $conn;
    private $table = 'projects';

    // Properties
    public $id;
    public $title;
    public $description;
    public $project_url;
    public $repo_url;
    public $project_date;
    public $image_url;


    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all projects
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table . ' ORDER BY project_date DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Add a new project
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET
                    title = :title,
                    description = :description,
                    project_url = :project_url,
                    repo_url = :repo_url,
                    project_date = :project_date,
                    image_url = :image_url';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->project_url = htmlspecialchars(strip_tags($this->project_url));
        $this->repo_url = htmlspecialchars(strip_tags($this->repo_url));
        $this->project_date = htmlspecialchars(strip_tags($this->project_date));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':project_url', $this->project_url);
        $stmt->bindParam(':repo_url', $this->repo_url);
        $stmt->bindParam(':project_date', $this->project_date);
        $stmt->bindParam(':image_url', $this->image_url);

        try {
            if ($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            return false;
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    // You can add update() and delete() methods here,
    // following the same pattern as the Skill.php class.
}
?>