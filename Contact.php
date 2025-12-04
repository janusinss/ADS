<?php
class Contact
{
    private $conn;
    private $table = 'contacts';

    // Properties
    public $id;
    public $visitor_name;
    public $visitor_email;
    public $subject;
    public $message;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Add a new contact message
     */
    public function add()
    {
        $query = 'INSERT INTO ' . $this->table . '
                  SET
                    visitor_name = :visitor_name,
                    visitor_email = :visitor_email,
                    subject = :subject,
                    message = :message';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->visitor_name = htmlspecialchars(strip_tags($this->visitor_name));
        $this->visitor_email = filter_var($this->visitor_email, FILTER_SANITIZE_EMAIL);
        $this->subject = htmlspecialchars(strip_tags($this->subject));
        $this->message = htmlspecialchars(strip_tags($this->message));

        // Validate email
        if (!filter_var($this->visitor_email, FILTER_VALIDATE_EMAIL)) {
            printf("Error: Invalid email format.\n");
            return false;
        }

        // Bind data
        $stmt->bindParam(':visitor_name', $this->visitor_name);
        $stmt->bindParam(':visitor_email', $this->visitor_email);
        $stmt->bindParam(':subject', $this->subject);
        $stmt->bindParam(':message', $this->message);

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
     * Read all contact messages (for an admin panel)
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table . ' ORDER BY received_at DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>