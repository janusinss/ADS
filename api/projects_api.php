<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../database.php';
include_once '../Project.php';

$database = new Database();
$db = $database->connect();
$project = new Project($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get all projects
    $result = $project->read();
    $num = $result->rowCount();

    if ($num > 0) {
        $projects_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $project_item = array(
                'id' => $id,
                'title' => $title,
                'description' => $description,
                'project_url' => $project_url ?? '#',
                'repo_url' => $repo_url ?? '#',
                'project_date' => $project_date ?? '',
                'image_url' => $image_url ?? 'https://placehold.co/600x400/555/FFF?text=Project'
            );
            array_push($projects_arr, $project_item);
        }
        http_response_code(200);
        echo json_encode($projects_arr);
    } else {
        http_response_code(200);
        echo json_encode(array());
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Method Not Allowed (GET only)'));
}
?>