<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../database.php';
include_once '../Education.php';

$database = new Database();
$db = $database->connect();
$education = new Education($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check for summary query parameter
    if (isset($_GET['summary']) && $_GET['summary'] === 'true') {
        $summary = $education->getSummary();
        http_response_code(200);
        echo json_encode($summary);
        exit;
    }

    // Get all education records
    $result = $education->read();
    $num = $result->rowCount();

    if ($num > 0) {
        $education_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            array_push($education_arr, $row);
        }
        http_response_code(200);
        echo json_encode($education_arr);
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
            $education->institution = $data->institution;
            $education->degree = $data->degree;
            $education->field_of_study = $data->field_of_study ?? '';
            $education->start_date = $data->start_date;
            $education->end_date = $data->end_date ?? null;
            $education->grade = $data->grade ?? '';
            $education->description = $data->description ?? '';
            $education->location = $data->location ?? '';
            $education->is_current = $data->is_current ?? false;

            if ($education->add()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Education Added', 'id' => $education->id));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Education Not Added'));
            }
            break;

        case 'update':
            $education->id = $data->id;
            $education->institution = $data->institution;
            $education->degree = $data->degree;
            $education->field_of_study = $data->field_of_study ?? '';
            $education->start_date = $data->start_date;
            $education->end_date = $data->end_date ?? null;
            $education->grade = $data->grade ?? '';
            $education->description = $data->description ?? '';
            $education->location = $data->location ?? '';
            $education->is_current = $data->is_current ?? false;

            if ($education->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Education Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Education Not Updated'));
            }
            break;

        case 'delete':
            $education->id = $data->id;
            if ($education->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Education Deleted'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Education Not Deleted'));
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