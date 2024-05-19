<?php
// Allow requests from the specified origin
header("Access-Control-Allow-Origin: http://localhost:3000");

// Allow the specified HTTP methods
header("Access-Control-Allow-Methods: DELETE");

// Allow the Content-Type header
header("Access-Control-Allow-Headers: Content-Type");

// Respond to OPTIONS requests with HTTP OK status
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("message" => "Method Not Allowed"));
    exit();
}

// Check if the course ID is provided in the URL
if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Course ID is required"));
    exit();
}

$courseId = $_GET['id'];

// Database configuration
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'learn_cyber';
$port = 3306;

// Create connection
$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare a DELETE statement for headings table
$stmt_headings = $conn->prepare("DELETE FROM headings WHERE course_id = ?");
$stmt_headings->bind_param("i", $courseId);

// Execute the DELETE statement for headings table
$stmt_headings->execute();

// Prepare a DELETE statement for courses table
$stmt_courses = $conn->prepare("DELETE FROM courses WHERE id = ?");
$stmt_courses->bind_param("i", $courseId);

// Execute the DELETE statement for courses table
if ($stmt_courses->execute()) {
    http_response_code(200); // OK
    echo json_encode(array("message" => "Course deleted successfully"));
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("message" => "Failed to delete course"));
}

// Close the statements and database connection
$stmt_headings->close();
$stmt_courses->close();
$conn->close();
?>
