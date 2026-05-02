<?php
// delete_car.php — Secure car deletion
include 'db.php';
 
header('Content-Type: application/json');
 
// Optional: restrict to logged-in users
// if (!isset($_SESSION['user_id'])) {
//     http_response_code(401);
//     echo json_encode(["error" => "Unauthorized"]);
//     exit;
// }
 
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
 
if (!$id || $id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid car ID"]);
    exit;
}
 
// Prepared statement — prevents SQL injection
$stmt = $conn->prepare("DELETE FROM cars WHERE id = ?");
$stmt->bind_param("i", $id);
 
if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Car not found or could not be deleted"]);
}
 
$stmt->close();
?>