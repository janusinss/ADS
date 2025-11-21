<?php
/**
 * Achievement Class
 * Handles all database operations for achievement records
 * File: Achievement.php
 */
class Achievement
{
    private $conn;
    private $table = 'achievements';

    public $id;
    public $title;
    public $category;
    public $description;
    public $date_achieved;
    public $issuing_organization;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all achievements
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table . ' 
                  ORDER BY date_achieved DESC';
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Get achievements by category
     * Demonstrates: WHERE, GROUP BY, COUNT
     */
    public function getByCategory($category = null)
    {
        if ($category) {
            $query = 'SELECT * FROM ' . $this->table . ' 
                      WHERE category = :category
                      ORDER BY date_achieved DESC';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':category', $category);
        } else {
            $query = 'SELECT 
                        category,
                        COUNT(*) as count,
                        MAX(date_achieved) as latest
                      FROM ' . $this->table . '
                      GROUP BY category
                      ORDER BY count DESC';
            $stmt = $this->conn->prepare($query);
        }
        
        $stmt->execute();
        return $stmt;
    }

    /**
     * Add new achievement
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET
                    title = :title,
                    category = :category,
                    description = :description,
                    date_achieved = :date_achieved,
                    issuing_organization = :issuing_organization';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->date_achieved = htmlspecialchars(strip_tags($this->date_achieved));
        $this->issuing_organization = htmlspecialchars(strip_tags($this->issuing_organization));

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':date_achieved', $this->date_achieved);
        $stmt->bindParam(':issuing_organization', $this->issuing_organization);

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

    /**
     * Update achievement
     */
    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
                  SET
                      title = :title,
                      category = :category,
                      description = :description,
                      date_achieved = :date_achieved,
                      issuing_organization = :issuing_organization
                  WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean and bind
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->date_achieved = htmlspecialchars(strip_tags($this->date_achieved));
        $this->issuing_organization = htmlspecialchars(strip_tags($this->issuing_organization));

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':date_achieved', $this->date_achieved);
        $stmt->bindParam(':issuing_organization', $this->issuing_organization);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    /**
     * Delete achievement
     */
    public function delete()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }
}