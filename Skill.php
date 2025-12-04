<?php
class Skill
{
    private $conn;
    private $table = 'skills';

    // Properties
    public $id;
    public $name;
    public $proficiency;
    public $category_id;
    public $category_name; // For JOIN

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all skills with category name (JOIN example)
     */
    public function read()
    {
        $query = 'SELECT
                    c.name as category_name,
                    s.id,
                    s.name,
                    s.proficiency,
                    s.category_id
                  FROM
                    ' . $this->table . ' s
                  LEFT JOIN
                    skill_categories c ON s.category_id = c.id
                  ORDER BY
                    s.proficiency DESC';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Add a new skill
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET name = :name, proficiency = :proficiency, category_id = :category_id';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->proficiency = htmlspecialchars(strip_tags($this->proficiency));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':proficiency', $this->proficiency);
        $stmt->bindParam(':category_id', $this->category_id);

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
     * Update an existing skill
     */
    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
                  SET
                      name = :name,
                      proficiency = :proficiency,
                      category_id = :category_id
                  WHERE
                      id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->proficiency = htmlspecialchars(strip_tags($this->proficiency));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));

        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':proficiency', $this->proficiency);
        $stmt->bindParam(':category_id', $this->category_id);


        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a skill
     */
    public function delete()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':id', $this->id);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }
}
?>