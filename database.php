<?php
class Database
{
    // Database Credentials
    private $host = 'localhost';
    private $db_name = 'portfolio_db';
    private $username = 'root'; // Change to your MySQL username
    private $password = ''; // Change to your MySQL password
    private $conn;

    /**
     * Get the database connection.
     * @return PDO|null The PDO connection object or null on failure.
     */
    public function connect()
    {
        $this->conn = null;

        try {
            $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }

        return $this->conn;
    }
}
?>