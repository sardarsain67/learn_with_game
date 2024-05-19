<?php
session_start();
include_once '../db.php';
include_once '../core.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process the login request
    if (!empty($_POST['username']) && !empty($_POST['password'])) {
        // Retrieve form data
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Retrieve user data from the database
        $stmt = $conn->prepare('SELECT * FROM userlogin WHERE username = ?');
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            http_response_code(400);
            echo 'Invalid credentials';
            exit();
        }

        $user = $result->fetch_assoc();

        // Verify the password
        if (!password_verify($password, $user['password'])) {
            http_response_code(400);
            echo 'Invalid credentials';
            exit();
        }

        // Store username and userId in session
        $_SESSION['username'] = $user['username'];
        $_SESSION['userId'] = $user['id'];

        // Return success response
        echo json_encode(array('success' => true, 'message' => 'Login successful', 'authToken' => $user['id']));
    

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
