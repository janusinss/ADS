<?php
/**
 * Education Class
 * Handles all database operations for education records
 * Demonstrates: JOINs, Subqueries, Aggregate Functions
 */
class Education
{
    private $conn;
    private $table = 'education';

    // Properties
    public $id;
    public $institution;
    public $degree;
    public $field_of_study;
    public $start_date;
    public $end_date;
    public $grade;
    public $description;
    public $location;
    public $is_current;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all education records
     * Uses: ORDER BY, INDEX optimization
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
     * Get education summary with aggregate functions
     * Demonstrates: COUNT, MAX, MIN, HAVING
     */
    public function getSummary()
    {
        $query = 'SELECT 
                    COUNT(*) as total_education,
                    COUNT(CASE WHEN is_current = 1 THEN 1 END) as current_education,
                    MIN(start_date) as earliest_start,
                    MAX(end_date) as latest_end
                  FROM ' . $this->table;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get education records grouped by degree type
     * Demonstrates: GROUP BY, COUNT
     */
    public function getByDegreeType()
    {
        $query = 'SELECT 
                    degree,
                    COUNT(*) as count,
                    GROUP_CONCAT(institution SEPARATOR ", ") as institutions
                  FROM ' . $this->table . '
                  GROUP BY degree
                  ORDER BY count DESC';
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Add a new education record
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET
                    institution = :institution,
                    degree = :degree,
                    field_of_study = :field_of_study,
                    start_date = :start_date,
                    end_date = :end_date,
                    grade = :grade,
                    description = :description,
                    location = :location,
                    is_current = :is_current';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->institution = htmlspecialchars(strip_tags($this->institution));
        $this->degree = htmlspecialchars(strip_tags($this->degree));
        $this->field_of_study = htmlspecialchars(strip_tags($this->field_of_study));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->grade = htmlspecialchars(strip_tags($this->grade));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->is_current = filter_var($this->is_current, FILTER_VALIDATE_BOOLEAN);

        // Bind data
        $stmt->bindParam(':institution', $this->institution);
        $stmt->bindParam(':degree', $this->degree);
        $stmt->bindParam(':field_of_study', $this->field_of_study);
        $stmt->bindParam(':start_date', $this->start_date);
        $stmt->bindParam(':end_date', $this->end_date);
        $stmt->bindParam(':grade', $this->grade);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':is_current', $this->is_current, PDO::PARAM_BOOL);

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
     * Update an existing education record
     */
    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
                  SET
                      institution = :institution,
                      degree = :degree,
                      field_of_study = :field_of_study,
                      start_date = :start_date,
                      end_date = :end_date,
                      grade = :grade,
                      description = :description,
                      location = :location,
                      is_current = :is_current
                  WHERE
                      id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->institution = htmlspecialchars(strip_tags($this->institution));
        $this->degree = htmlspecialchars(strip_tags($this->degree));
        $this->field_of_study = htmlspecialchars(strip_tags($this->field_of_study));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->grade = htmlspecialchars(strip_tags($this->grade));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->is_current = filter_var($this->is_current, FILTER_VALIDATE_BOOLEAN);

        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':institution', $this->institution);
        $stmt->bindParam(':degree', $this->degree);
        $stmt->bindParam(':field_of_study', $this->field_of_study);
        $stmt->bindParam(':start_date', $this->start_date);
        $stmt->bindParam(':end_date', $this->end_date);
        $stmt->bindParam(':grade', $this->grade);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':is_current', $this->is_current, PDO::PARAM_BOOL);

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
     * Delete an education record
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