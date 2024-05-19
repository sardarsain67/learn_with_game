<?php
session_start();
include_once '../db.php';

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process the signup request
    if (!empty($_POST['username']) && !empty($_POST['email']) && !empty($_POST['password'])) {
        // Retrieve form data
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Check if username or email already exists in userlogin table
        $stmt = $conn->prepare('SELECT * FROM userlogin WHERE username = ? OR email = ?');
        if (!$stmt) {
            http_response_code(500);
            echo 'Internal Server Error';
            exit();
        }
        $stmt->bind_param('ss', $username, $email);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo 'Internal Server Error';
            exit();
        }
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows > 0) {
            $existingUser = $result->fetch_assoc();
            if ($existingUser['username'] === $username) {
                http_response_code(400);
                echo 'Username already exists';
                exit();
            }
            if ($existingUser['email'] === $email) {
                http_response_code(400);
                echo 'Email already exists';
                exit();
            }
        }

        // Insert new user data into userlogin table
        $stmt = $conn->prepare('INSERT INTO userlogin (username, password, email) VALUES (?, ?, ?)');
        if (!$stmt) {
            http_response_code(500);
            echo 'Internal Server Error';
            exit();
        }
        $stmt->bind_param('sss', $username, $hashedPassword, $email);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo 'Internal Server Error';
            exit();
        }
        $stmt->close();

        // Return success response
        echo json_encode(array('success' => true));
        exit();
    } else {
        // If form data is incomplete, return an error
        http_response_code(400);
        echo 'Incomplete form data';
        exit();
    }
} else {
    // If the request method is not POST, return an error
    http_response_code(405);
    echo 'Method Not Allowed';
    exit();
}
?>
