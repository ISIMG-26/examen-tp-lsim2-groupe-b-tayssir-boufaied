<?php
// login_process.php — Secure login with prepared statements
include 'db.php';
 
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
 
if (empty($email) || empty($password)) {
    header("Location: login.html?error=missing_fields");
    exit;
}
 
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: login.html?error=invalid");
    exit;
}
 
// Prepared statement — prevents SQL injection
$stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();
$stmt->close();
 
if ($user && password_verify($password, $user['password'])) {
    // Regenerate session ID to prevent session fixation attacks
    session_regenerate_id(true);
 
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['name'];
 
    header("Location: index.html");
} else {
    // Generic error — don't reveal if email or password was wrong
    header("Location: login.html?error=invalid_credentials");
}
?>