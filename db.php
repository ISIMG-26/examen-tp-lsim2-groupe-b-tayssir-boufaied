<?php
// db.php — Database connection
// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
 
$conn = new mysqli("localhost", "root", "", "cars_db");
 
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed"]));
}
 
$conn->set_charset("utf8mb4");
?>
 