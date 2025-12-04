<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../database.php';
include_once '../Certification.php';

$database = new Database();
$db = $database->connect();
$certification = new Certification($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check for active certifications query
    if (isset($_GET['active']) && $_GET['active'] === 'true') {
        $result = $certification->getActive();
    } else {
        $result = $certification->read();
    }

    $num = $result->rowCount();

    if ($num > 0) {
        $certs_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            array_push($certs_arr, $row);
        }
        http_response_code(200);
        echo json_encode($certs_arr);
    } else {
        http_response_code(200);
        echo json_encode(array());
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->action)) {
        http_response_code(400);
        echo json_encode(array('message' => 'Action required'));
        exit;
    }

    switch ($data->action) {
        case 'add':
            $certification->title = $data->title;
            $certification->issuing_organization = $data->issuing_organization;
            $certification->issue_date = $data->issue_date;
            $certification->expiry_date = $data->expiry_date ?? null;
            $certification->credential_id = $data->credential_id ?? '';
            $certification->credential_url = $data->credential_url ?? '';
            $certification->description = $data->description ?? '';

            if ($certification->add()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Certification Added', 'id' => $certification->id));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Certification Not Added'));
            }
            break;

        case 'update':
            $certification->id = $data->id;
            $certification->title = $data->title;
            $certification->issuing_organization = $data->issuing_organization;
            $certification->issue_date = $data->issue_date;
            $certification->expiry_date = $data->expiry_date ?? null;
            $certification->credential_id = $data->credential_id ?? '';
            $certification->credential_url = $data->credential_url ?? '';
            $certification->description = $data->description ?? '';

            if ($certification->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Certification Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Not Updated'));
            }
            break;

        case 'delete':
            $certification->id = $data->id;
            if ($certification->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Certification Deleted'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Not Deleted'));
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(array('message' => 'Invalid action'));
            break;
    }
}
?>