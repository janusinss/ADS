<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../database.php';
include_once '../Skill.php';

$database = new Database();
$db = $database->connect();
$skill = new Skill($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get all skills
    $result = $skill->read();
    $num = $result->rowCount();

    if ($num > 0) {
        $skills_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $skill_item = array(
                'id' => $id,
                'name' => $name,
                'proficiency' => $proficiency,
                'category_id' => $category_id ?? null,
                'category_name' => $category_name ?? 'Uncategorized'
            );
            array_push($skills_arr, $skill_item);
        }
        http_response_code(200);
        echo json_encode($skills_arr);
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
            $skill->name = $data->name;
            $skill->proficiency = $data->proficiency;
            $skill->category_id = $data->category_id;

            if ($skill->add()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Skill Added', 'id' => $skill->id));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Skill Not Added'));
            }
            break;

        case 'update':
            $skill->id = $data->id;
            $skill->name = $data->name;
            $skill->proficiency = $data->proficiency;
            $skill->category_id = $data->category_id;

            if ($skill->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Skill Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Skill Not Updated'));
            }
            break;

        case 'delete':
            $skill->id = $data->id;

            if ($skill->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Skill Deleted'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Skill Not Deleted'));
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