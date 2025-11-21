<?php
class Hobby
{
    private $conn;
    private $table = 'hobbies';

    // Properties
    public $id;
    public $name;
    public $description;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read all hobbies
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // You can add add(), update(), and delete() methods here,
    // following the same pattern as the Skill.php class.
}
?>
