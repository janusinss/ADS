<?php
class Profile
{
    private $conn;
    private $table = 'profile';

    // Properties
    public $id;
    public $full_name;
    public $professional_title;
    public $bio;
    public $email;
    public $phone;
    public $facebook_url;
    public $profile_photo_url;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Read the single profile (assuming ID 1)
     */
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = 1 LIMIT 1';

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $this->id = $row['id'];
                $this->full_name = $row['full_name'];
                $this->professional_title = $row['professional_title'];
                $this->bio = $row['bio'];
                $this->email = $row['email'];
                $this->phone = $row['phone'];
                $this->facebook_url = $row['facebook_url'];
                $this->profile_photo_url = $row['profile_photo_url'];
                return true;
            }
            return false;
        } catch (PDOException $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    /**
     * Update the profile
     */
    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
                  SET
                      full_name = :full_name,
                      professional_title = :professional_title,
                      bio = :bio,
                      email = :email,
                      phone = :phone,
                      facebook_url = :facebook_url,
                      profile_photo_url = :profile_photo_url
                  WHERE
                      id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        // ... (add cleaning for all properties) ...
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':full_name', $this->full_name);
        $stmt->bindParam(':professional_title', $this->professional_title);
        $stmt->bindParam(':bio', $this->bio);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':facebook_url', $this->facebook_url);
        $stmt->bindParam(':profile_photo_url', $this->profile_photo_url);
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
