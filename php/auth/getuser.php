<?php

// Specify the allowed origin (replace 'http://localhost:3000' with your actual frontend origin)
$allowedOrigin = 'http://localhost:3000';

// Check if the request method is OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request with CORS headers
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("HTTP/1.1 200 OK");
    exit;
}

// Allow requests from the specified origin
header("Access-Control-Allow-Origin: $allowedOrigin");

// Allow requests with the following methods
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Allow requests with the following headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Allow credentials
header("Access-Control-Allow-Credentials: true");

// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';
//include_once '../core.php';

// Check if the request contains an authorization token
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $userId = $headers['Authorization']; // Assuming token is directly used as userId

    // Fetch user data including module scores from the database based on userId
    $userDataStmt = $conn->prepare('SELECT u.id, u.username, u.email, 
                                    COALESCE(m.module1score, 0) AS module1score, 
                                    COALESCE(m.module2score, 0) AS module2score, 
                                    COALESCE(m.module3score, 0) AS module3score, 
                                    COALESCE(m.finaltestscore, 0) AS finaltestscore 
                                    FROM userlogin u 
                                    LEFT JOIN module_scores m 
                                    ON u.id = m.userId 
                                    WHERE u.id = ?');
    $userDataStmt->bind_param('i', $userId);
    $userDataStmt->execute();
    $userDataResult = $userDataStmt->get_result();
    $userDataStmt->close();

    // Check if user data exists
    if ($userDataResult->num_rows > 0) {
        $userData = $userDataResult->fetch_assoc();

        // Return the user data as JSON response
        header('Content-Type: application/json');
        echo json_encode($userData);
    } else {
        // User not found
        http_response_code(404); // Not Found
        echo json_encode(array('message' => 'User not found'));
    }
} else {
    // Authorization token not provided
    http_response_code(401); // Unauthorized
    echo json_encode(array('message' => 'Authorization token not provided'));
}
?>
