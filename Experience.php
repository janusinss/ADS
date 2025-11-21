<?php
/**
 * Experience Class
 * Handles all database operations for work experience records
 * Demonstrates: Date calculations, TIMESTAMPDIFF, CASE statements
 */
class Experience
{
    private $conn;
    private $table = 'experience';

    // Properties
    public $id;
    public $company;
    public $position;
    public $employment_type;
    public $location;
    public $start_date;
    public $end_date;
    public $is_current;
    public $description;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all experience records
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table . ' 
                  ORDER BY is_current DESC, start_date DESC';
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Get experience with calculated duration
     * Demonstrates: TIMESTAMPDIFF, COALESCE, CONCAT
     */
    public function getWithDuration()
    {
        $query = 'SELECT 
                    *,
                    TIMESTAMPDIFF(MONTH, start_date, COALESCE(end_date, CURDATE())) as months_duration,
                    CONCAT(
                        FLOOR(TIMESTAMPDIFF(MONTH, start_date, COALESCE(end_date, CURDATE())) / 12), 
                        " years ", 
                        MOD(TIMESTAMPDIFF(MONTH, start_date, COALESCE(end_date, CURDATE())), 12), 
                        " months"
                    ) as duration_text
                  FROM ' . $this->table . '
                  ORDER BY is_current DESC, start_date DESC';
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Get total years of experience
     * Demonstrates: SUM, TIMESTAMPDIFF
     */
    public function getTotalYears()
    {
        $query = 'SELECT 
                    SUM(TIMESTAMPDIFF(MONTH, start_date, COALESCE(end_date, CURDATE()))) / 12 as total_years
                  FROM ' . $this->table;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Add new experience
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET
                    company = :company,
                    position = :position,
                    employment_type = :employment_type,
                    location = :location,
                    start_date = :start_date,
                    end_date = :end_date,
                    is_current = :is_current,
                    description = :description';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->company = htmlspecialchars(strip_tags($this->company));
        $this->position = htmlspecialchars(strip_tags($this->position));
        $this->employment_type = htmlspecialchars(strip_tags($this->employment_type));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = $this->end_date ? htmlspecialchars(strip_tags($this->end_date)) : null;
        $this->is_current = filter_var($this->is_current, FILTER_VALIDATE_BOOLEAN);
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind data
        $stmt->bindParam(':company', $this->company);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':employment_type', $this->employment_type);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':start_date', $this->start_date);
        $stmt->bindParam(':end_date', $this->end_date);
        $stmt->bindParam(':is_current', $this->is_current, PDO::PARAM_BOOL);
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
     * Update experience
     */
    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
                  SET
                      company = :company,
                      position = :position,
                      employment_type = :employment_type,
                      location = :location,
                      start_date = :start_date,
                      end_date = :end_date,
                      is_current = :is_current,
                      description = :description
                  WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean and bind
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->company = htmlspecialchars(strip_tags($this->company));
        $this->position = htmlspecialchars(strip_tags($this->position));
        $this->employment_type = htmlspecialchars(strip_tags($this->employment_type));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = $this->end_date ? htmlspecialchars(strip_tags($this->end_date)) : null;
        $this->is_current = filter_var($this->is_current, FILTER_VALIDATE_BOOLEAN);
        $this->description = htmlspecialchars(strip_tags($this->description));

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':company', $this->company);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':employment_type', $this->employment_type);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':start_date', $this->start_date);
        $stmt->bindParam(':end_date', $this->end_date);
        $stmt->bindParam(':is_current', $this->is_current, PDO::PARAM_BOOL);
        $stmt->bindParam(':description', $this->description);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    /**
     * Delete experience
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