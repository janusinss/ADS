<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../database.php';
include_once '../Achievement.php';

$database = new Database();
$db = $database->connect();
$achievement = new Achievement($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check for category filter
    if (isset($_GET['category'])) {
        $result = $achievement->getByCategory($_GET['category']);
    }
    // Get category summary
    elseif (isset($_GET['summary']) && $_GET['summary'] === 'true') {
        $result = $achievement->getByCategory();
    }
    // Default: Get all achievements
    else {
        $result = $achievement->read();
    }

    $num = $result->rowCount();

    if ($num > 0) {
        $achievements_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            array_push($achievements_arr, $row);
        }
        http_response_code(200);
        echo json_encode($achievements_arr);
    } else {
        http_response_code(200);
        echo json_encode(array());
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->action)) {
        http_response_code(400);
        echo json_encode(array('message' => 'Action parameter is required.'));
        exit;
    }

    switch ($data->action) {
        case 'add':
            $achievement->title = $data->title;
            $achievement->category = $data->category ?? 'other';
            $achievement->description = $data->description ?? '';
            $achievement->date_achieved = $data->date_achieved;
            $achievement->issuing_organization = $data->issuing_organization ?? '';

            if ($achievement->add()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Achievement Added', 'id' => $achievement->id));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Achievement Not Added'));
            }
            break;

        case 'update':
            $achievement->id = $data->id;
            $achievement->title = $data->title;
            $achievement->category = $data->category ?? 'other';
            $achievement->description = $data->description ?? '';
            $achievement->date_achieved = $data->date_achieved;
            $achievement->issuing_organization = $data->issuing_organization ?? '';

            if ($achievement->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Achievement Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Achievement Not Updated'));
            }
            break;

        case 'delete':
            $achievement->id = $data->id;
            if ($achievement->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Achievement Deleted'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Achievement Not Deleted'));
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(array('message' => 'Invalid action.'));
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Method Not Allowed'));
}
?>