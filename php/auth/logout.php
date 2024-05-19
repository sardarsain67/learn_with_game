<?php
// Start the session
session_start();
include_once '../core.php';
// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST");

// Check if logout form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    // Clear session data
    session_unset();
    session_destroy();
    
    // Return success message
    echo json_encode(array('success' => true, 'message' => 'Logged out successfully'));
    exit();
} else {
    // Redirect to login page
    header("Location: http://localhost:3000/login");
    exit();
}
?>
