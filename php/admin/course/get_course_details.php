<?php
// Set the appropriate headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Replace * with the appropriate origin(s) if needed
header("Access-Control-Allow-Methods: GET");
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

// Initialize an empty array to store the result
$result = array();

// Get the course ID from the query parameter
$courseId = $_GET['courseId'];

// Query to fetch course details from the courses table
$course_query = "SELECT * FROM courses WHERE id = $courseId";
$course_result = mysqli_query($conn, $course_query);

if ($course_result && mysqli_num_rows($course_result) > 0) {
    // Fetch course details
    $course_row = mysqli_fetch_assoc($course_result);
    $course_data = array(
        'id' => $course_row['id'],
        'title' => $course_row['course_name'],
        'description' => $course_row['short_description'],
        'modules' => array() // Initialize an array to store modules for this course
    );

    // Query to fetch headings for this course from the headings table
    $headings_query = "SELECT * FROM headings WHERE course_id = $courseId";
    $headings_result = mysqli_query($conn, $headings_query);

    if ($headings_result) {
        while ($heading_row = mysqli_fetch_assoc($headings_result)) {
            // Add each heading as a content to the appropriate module
            $module_index = intval($heading_row['module_number']) - 1;
            $course_data['modules'][$module_index]['moduleName'] = $heading_row['module_name'];
            $course_data['modules'][$module_index]['contents'][] = array(
                'heading' => $heading_row['heading_name'],
                'content' => $heading_row['heading_content']
            );
        }
    }

    // Add the course data to the result array
    $result = $course_data;
} else {
    // If no course found with the provided ID, return an error message
    $result = array('error' => 'Course not found');
}

// Close the database connection
mysqli_close($conn);

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($result);
?>
