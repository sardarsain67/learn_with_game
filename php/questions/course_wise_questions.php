<?php
// Include database connection and other necessary files
include_once '../db.php';
include_once '../core.php';

// Check if auth-token is provided in the request headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Set CORS headers for preflight request
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, auth-token'); // Allow auth-token header
    header('Access-Control-Allow-Credentials: true');
    header('HTTP/1.1 200 OK');
    exit;
}

// Check if auth-token is provided in the request headers
if (!isset($_SERVER['HTTP_AUTH_TOKEN'])) {
    http_response_code(401); // Unauthorized
    exit(json_encode(array("error" => "Auth token not provided")));
}

// Extract auth-token from the request headers
$authToken = $_SERVER['HTTP_AUTH_TOKEN'];


// Extract course ID from the request
$courseId = isset($_GET['courseId']) ? $_GET['courseId'] : null;

if (!$courseId) {
    http_response_code(400); // Bad request
    exit(json_encode(array("error" => "Course ID not provided")));
}

// Fetch questions for the specified course from the database
$query = "SELECT * FROM courses_questions WHERE courseId = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $courseId);
$stmt->execute();
$result = $stmt->get_result();

// Check if there are questions for the specified course
if ($result->num_rows > 0) {
    $questions = array();
    while ($row = $result->fetch_assoc()) {
        // Decode JSON data for each question
        $questionData = json_decode($row['question_data'], true);
        // Add the decoded question data to the array
        $questions[] = $questionData;
    }
    // Send the questions as JSON response
    echo json_encode(array("questions" => $questions));
} else {
    http_response_code(404); // Not found
    echo json_encode(array("error" => "No questions found for the specified course"));
}

// Close the database connection and statement
$stmt->close();
$conn->close();
?>
