<?php
// insert_car.php — Insert car using existing schema: title, price, image
include 'db.php';
 
header('Content-Type: application/json');
 
$title = trim($_POST['title'] ?? '');
$price = $_POST['price'] ?? '';
$image = trim($_POST['image'] ?? '');
 
if (empty($title) || !is_numeric($price) || $price < 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}
 
if (!empty($image) && !filter_var($image, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid image URL"]);
    exit;
}
 
$stmt = $conn->prepare("INSERT INTO cars (title, price, image) VALUES (?, ?, ?)");
$stmt->bind_param("sds", $title, $price, $image);
 
if ($stmt->execute()) {
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save listing"]);
}
 
$stmt->close();
?>