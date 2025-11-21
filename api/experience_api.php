<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../database.php';
include_once '../Experience.php';

$database = new Database();
$db = $database->connect();
$experience = new Experience($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check for duration parameter
    if (isset($_GET['duration']) && $_GET['duration'] === 'true') {
        $result = $experience->getWithDuration();
    } 
    // Check for total years
    elseif (isset($_GET['total_years']) && $_GET['total_years'] === 'true') {
        $years = $experience->getTotalYears();
        http_response_code(200);
        echo json_encode($years);
        exit;
    }
    // Default: Get all experience
    else {
        $result = $experience->read();
    }
    
    $num = $result->rowCount();

    if ($num > 0) {
        $exp_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            array_push($exp_arr, $row);
        }
        http_response_code(200);
        echo json_encode($exp_arr);
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
            $experience->company = $data->company;
            $experience->position = $data->position;
            $experience->employment_type = $data->employment_type ?? 'full-time';
            $experience->location = $data->location ?? '';
            $experience->start_date = $data->start_date;
            $experience->end_date = $data->end_date ?? null;
            $experience->is_current = $data->is_current ?? false;
            $experience->description = $data->description ?? '';

            if ($experience->add()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Experience Added', 'id' => $experience->id));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Experience Not Added'));
            }
            break;

        case 'update':
            $experience->id = $data->id;
            $experience->company = $data->company;
            $experience->position = $data->position;
            $experience->employment_type = $data->employment_type ?? 'full-time';
            $experience->location = $data->location ?? '';
            $experience->start_date = $data->start_date;
            $experience->end_date = $data->end_date ?? null;
            $experience->is_current = $data->is_current ?? false;
            $experience->description = $data->description ?? '';

            if ($experience->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Experience Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Experience Not Updated'));
            }
            break;

        case 'delete':
            $experience->id = $data->id;
            if ($experience->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Experience Deleted'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Experience Not Deleted'));
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