<?php
// register.php — Secure user registration
include 'db.php';
 
$name     = trim($_POST['name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
 
// Server-side validation
if (empty($name) || empty($email) || empty($password)) {
    header("Location: register.html?error=missing_fields");
    exit;
}
 
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: register.html?error=invalid_email");
    exit;
}
 
if (strlen($password) < 8) {
    header("Location: register.html?error=weak_password");
    exit;
}
 
// Check if email already exists — prepared statement
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();
 
if ($check->num_rows > 0) {
    $check->close();
    header("Location: register.html?error=email_taken");
    exit;
}
$check->close();
 
// Hash password securely
$hashed = password_hash($password, PASSWORD_DEFAULT);
 
// Insert with prepared statement — prevents SQL injection
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);
 
if ($stmt->execute()) {
    $stmt->close();
    header("Location: login.html?registered=1");
} else {
    $stmt->close();
    header("Location: register.html?error=server_error");
}
?>