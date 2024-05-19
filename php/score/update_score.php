<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following methods from the client side
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Allow the following headers from the client side
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If the request method is OPTIONS, just return a 200 status code
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the authorization token exists in the request headers
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        // Get the user ID from the authorization token
        $userId = $headers['Authorization'];

        // Retrieve module and score from request body
        $data = json_decode(file_get_contents('php://input'), true);
        $module = $data['module'];
        $score = $data['score'];
        $courseId = $data['courseId']; // Get courseId from request data

        // Validate module
        $validModules = [1, 2, 3, 'finaltest'];
        if (!in_array($module, $validModules)) {
            http_response_code(400);
            echo json_encode(array('error' => 'Invalid module')); // Return error message as JSON
            exit();
        }

        // Validate score
        if ($score < 0 || $score > 100) {
            http_response_code(400);
            echo json_encode(array('error' => 'Invalid score. Please provide a score between 0 and 100.')); // Return error message as JSON
            exit();
        }

        // Check if the user exists in the module_scores table
        $checkUserStmt = $conn->prepare("SELECT * FROM course_module_scores WHERE userId = ? AND courseId = ?");
        $checkUserStmt->bind_param('ss', $userId, $courseId);
        $checkUserStmt->execute();
        $checkUserResult = $checkUserStmt->get_result();

        if ($checkUserResult->num_rows > 0) {
            // User exists for this courseId, update the score in the existing row
            $updateScoreStmt = $conn->prepare("UPDATE course_module_scores SET moduleScores = JSON_SET(moduleScores, '$.module$module', ?) WHERE userId = ? AND courseId = ?");
            $updateScoreStmt->bind_param('dss', $score, $userId, $courseId);
            $updateScoreStmt->execute();
            $updateScoreStmt->close();
        } else {
            // User does not exist for this courseId, insert a new row
            $insertScoreStmt = $conn->prepare("INSERT INTO course_module_scores (userId, courseId, moduleScores) VALUES (?, ?, JSON_OBJECT('module$module', ?))");
            $insertScoreStmt->bind_param('ssd', $userId, $courseId, $score);
            $insertScoreStmt->execute();
            $insertScoreStmt->close();
        }

        echo json_encode(array('success' => true, 'message' => "Module $module score updated successfully")); // Return success message as JSON
    } else {
        // If the authorization token is not provided, return an error
        http_response_code(401);
        echo json_encode(array('error' => 'Authorization token not provided')); // Return error message as JSON
    }
} else {
    // If the request method is not POST, return an error
    http_response_code(405);
    echo 'Method Not Allowed';
    exit();
}
?>


<?php
/*
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following methods from the client side
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Allow the following headers from the client side
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If the request method is OPTIONS, just return a 200 status code
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';
//include_once '../core.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the authorization token exists in the request headers
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        // Get the user ID from the authorization token
        $userId = $headers['Authorization'];

        // Retrieve module and score from request body
        $data = json_decode(file_get_contents('php://input'), true);
        $module = $data['module'];
        $score = $data['score'];

        // Validate module
        $validModules = [1, 2, 3, 'finaltest'];
        if (!in_array($module, $validModules)) {
            http_response_code(400);
            echo json_encode(array('error' => 'Invalid module')); // Return error message as JSON
            exit();
        }

        // Validate score
        if ($score < 0 || $score > 100) {
            http_response_code(400);
            echo json_encode(array('error' => 'Invalid score. Please provide a score between 0 and 100.')); // Return error message as JSON
            exit();
        }

        // Determine column name based on module
        $columnName = $module === 'finaltest' ? 'finaltestscore' : "module{$module}score";

        // Check if the user exists in the module_scores table
        $checkUserStmt = $conn->prepare("SELECT * FROM module_scores WHERE userId = ?");
        $checkUserStmt->bind_param('s', $userId);
        $checkUserStmt->execute();
        $checkUserResult = $checkUserStmt->get_result();
        
        if ($checkUserResult->num_rows > 0) {
            // User exists, update the score in the existing row
            $updateScoreStmt = $conn->prepare("UPDATE module_scores SET $columnName = ? WHERE userId = ?");
            $updateScoreStmt->bind_param('ds', $score, $userId);
            $updateScoreStmt->execute();
            $updateScoreStmt->close();
        } else {
            // User does not exist, insert a new row
            $insertScoreStmt = $conn->prepare("INSERT INTO module_scores (userId, $columnName) VALUES (?, ?)");
            $insertScoreStmt->bind_param('sd', $userId, $score);
            $insertScoreStmt->execute();
            $insertScoreStmt->close();
        }

        echo json_encode(array('success' => true, 'message' => "$columnName score updated successfully")); // Return success message as JSON
    } else {
        // If the authorization token is not provided, return an error
        http_response_code(401);
        echo json_encode(array('error' => 'Authorization token not provided')); // Return error message as JSON
    }
} else {
    // If the request method is not POST, return an error
    http_response_code(405);
    echo 'Method Not Allowed';
    exit();
}
*/
?>
