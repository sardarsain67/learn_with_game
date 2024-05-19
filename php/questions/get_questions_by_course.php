<?php
// Set the appropriate headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Replace * with the appropriate origin(s) if needed
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

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

// Get the courseId from the query parameters
$courseId = $_GET['courseId'];

// Prepare the query to fetch questions for the selected course
$questions_query = "SELECT question_data FROM courses_questions WHERE courseId = ?";

// Prepare the statement
$stmt = $conn->prepare($questions_query);
$stmt->bind_param("i", $courseId);
$stmt->execute();
$stmt->store_result();

// Bind the result variable
$stmt->bind_result($question_data);

// Fetch questions data and add to the result array
$result = array();
while ($stmt->fetch()) {
    $question_data_decoded = json_decode($question_data, true);
    $result[] = $question_data_decoded;
}

// Close the statement
$stmt->close();

// Close the database connection
mysqli_close($conn);

// Set the Content-Type header to JSON
header('Content-Type: application/json');

// Output the JSON data
echo json_encode($result);
?>
