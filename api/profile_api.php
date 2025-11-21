<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../database.php';
include_once '../Profile.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate profile object
$profile = new Profile($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get profile
    if ($profile->read()) {
        // Create array
        $profile_arr = array(
            'id' => $profile->id,
            'full_name' => $profile->full_name,
            'professional_title' => $profile->professional_title,
            'bio' => $profile->bio,
            'email' => $profile->email,
            'phone' => $profile->phone,
            'facebook_url' => $profile->facebook_url,
            'profile_photo_url' => $profile->profile_photo_url
        );
        // Make JSON
        http_response_code(200);
        echo json_encode($profile_arr);
    } else {
        http_response_code(404);
        echo json_encode(array('message' => 'Profile not found.'));
    }
} elseif ($method === 'POST') {
    // Update Profile
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->action) && $data->action === 'update') {
        $profile->id = 1;
        $profile->full_name = $data->full_name;
        $profile->professional_title = $data->professional_title;
        $profile->bio = $data->bio;
        $profile->email = $data->email;
        $profile->phone = $data->phone;
        $profile->facebook_url = $data->facebook_url;
        $profile->profile_photo_url = $data->profile_photo_url;

        if ($profile->update()) {
            http_response_code(200);
            echo json_encode(array('message' => 'Profile Updated'));
        } else {
            http_response_code(500);
            echo json_encode(array('message' => 'Profile Not Updated'));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('message' => 'Invalid action.'));
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Method Not Allowed'));
}
?>