<?php
/**
 * Certification Class
 * Handles all database operations for certification records
 * Demonstrates: DATE functions, WHERE conditions
 */
class Certification
{
    private $conn;
    private $table = 'certifications';

    // Properties
    public $id;
    public $title;
    public $issuing_organization;
    public $issue_date;
    public $expiry_date;
    public $credential_id;
    public $credential_url;
    public $description;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all certifications
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table . ' 
                  ORDER BY issue_date DESC';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Get active (non-expired) certifications
     * Demonstrates: WHERE with date comparison
     */
    public function getActive()
    {
        $query = 'SELECT * FROM ' . $this->table . ' 
                  WHERE expiry_date IS NULL OR expiry_date >= CURDATE()
                  ORDER BY issue_date DESC';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Add new certification
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET
                    title = :title,
                    issuing_organization = :issuing_organization,
                    issue_date = :issue_date,
                    expiry_date = :expiry_date,
                    credential_id = :credential_id,
                    credential_url = :credential_url,
                    description = :description';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->issuing_organization = htmlspecialchars(strip_tags($this->issuing_organization));
        $this->issue_date = htmlspecialchars(strip_tags($this->issue_date));
        $this->expiry_date = $this->expiry_date ? htmlspecialchars(strip_tags($this->expiry_date)) : null;
        $this->credential_id = htmlspecialchars(strip_tags($this->credential_id));
        $this->credential_url = htmlspecialchars(strip_tags($this->credential_url));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':issuing_organization', $this->issuing_organization);
        $stmt->bindParam(':issue_date', $this->issue_date);
        $stmt->bindParam(':expiry_date', $this->expiry_date);
        $stmt->bindParam(':credential_id', $this->credential_id);
        $stmt->bindParam(':credential_url', $this->credential_url);
        $stmt->bindParam(':description', $this->description);

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
     * Update certification
     */
    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
                  SET
                      title = :title,
                      issuing_organization = :issuing_organization,
                      issue_date = :issue_date,
                      expiry_date = :expiry_date,
                      credential_id = :credential_id,
                      credential_url = :credential_url,
                      description = :description
                  WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean and bind
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->issuing_organization = htmlspecialchars(strip_tags($this->issuing_organization));
        $this->issue_date = htmlspecialchars(strip_tags($this->issue_date));
        $this->expiry_date = $this->expiry_date ? htmlspecialchars(strip_tags($this->expiry_date)) : null;
        $this->credential_id = htmlspecialchars(strip_tags($this->credential_id));
        $this->credential_url = htmlspecialchars(strip_tags($this->credential_url));
        $this->description = htmlspecialchars(strip_tags($this->description));

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':issuing_organization', $this->issuing_organization);
        $stmt->bindParam(':issue_date', $this->issue_date);
        $stmt->bindParam(':expiry_date', $this->expiry_date);
        $stmt->bindParam(':credential_id', $this->credential_id);
        $stmt->bindParam(':credential_url', $this->credential_url);
        $stmt->bindParam(':description', $this->description);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    /**
     * Delete certification
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
?>