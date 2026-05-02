<?php
// fetch_cars.php — Return all car listings as JSON
include 'db.php';
 
header('Content-Type: application/json');
 
$res = $conn->query("SELECT id, title, price, image FROM cars ORDER BY id DESC");
 
if (!$res) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed"]);
    exit;
}
 
$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}
 
echo json_encode($data);
?>