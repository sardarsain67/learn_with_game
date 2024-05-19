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
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Allow requests with the following headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Allow credentials
header("Access-Control-Allow-Credentials: true");

// Start session if not already started
session_start();

// Include database connection file
include_once '../db.php';

// Check if user ID and course ID are provided
if (isset($_GET['userId']) && isset($_GET['courseId'])) {
    $userId = $_GET['userId'];
    $courseId = $_GET['courseId'];

    // Query to fetch user progress in the selected course
    $query = "SELECT * FROM course_module_scores WHERE userId = '$userId' AND courseId = $courseId";

    $result = mysqli_query($conn, $query);

    if ($result) {
        $courseProgress = array();
        while ($row = mysqli_fetch_assoc($result)) {
            // Decode the JSON string to an array
            $moduleScores = json_decode($row['moduleScores'], true);
            // Append module scores to the course progress array
            array_push($courseProgress, $moduleScores);
        }
        // Send course progress data as JSON response
        echo json_encode($courseProgress);
    } else {
        echo json_encode(array('error' => 'Failed to fetch course progress'));
    }
} else {
    echo json_encode(array('error' => 'User ID or Course ID not provided'));
}
?>
