<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../database.php';
include_once '../Contact.php';

$database = new Database();
$db = $database->connect();
$contact = new Contact($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Get raw posted data
    $data = json_decode(file_get_contents("php://input"));

    if (
        !empty($data->visitor_name) &&
        !empty($data->visitor_email) &&
        !empty($data->message)
    ) {
        $contact->visitor_name = $data->visitor_name;
        $contact->visitor_email = $data->visitor_email;
        $contact->subject = $data->subject ?? ''; // Optional subject
        $contact->message = $data->message;

        if ($contact->add()) {
            http_response_code(201); // Created
            echo json_encode(array('message' => 'Message Sent'));
        } else {
            http_response_code(500);
            echo json_encode(array('message' => 'Message Not Sent. An error occurred.'));
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(array('message' => 'Message Not Sent. Please fill in all required fields.'));
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Method Not Allowed (POST only)'));
}
?>