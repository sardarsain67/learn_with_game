


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

// Initialize an empty array to store the result
$result = array();

// Query to fetch courses
$courses_query = "SELECT * FROM courses";
$courses_result = mysqli_query($conn, $courses_query);

if ($courses_result) {
    while ($course_row = mysqli_fetch_assoc($courses_result)) {
        $course_id = $course_row['id'];
        $course_data = array(
            'id' => $course_id,
            'title' => $course_row['course_name'],
            'description' => $course_row['short_description'],
            'status' => $course_row['status'], // Add status value
            'modules' => array() // Initialize an array to store modules for this course
        );

        // Query to fetch headings for this course
        $headings_query = "SELECT heading_name AS heading, heading_content AS content FROM headings WHERE course_id = $course_id";
        $headings_result = mysqli_query($conn, $headings_query);

        if ($headings_result) {
            while ($heading_row = mysqli_fetch_assoc($headings_result)) {
                // Add each heading as a module to the course data
                $course_data['modules'][] = array(
                    'moduleName' => $course_row['module_name'],
                    'heading' => $heading_row['heading'],
                    'content' => $heading_row['content']
                );
            }
        }

        // Add the course data to the result array
        $result[] = $course_data;
    }

    // Close the result set
    mysqli_free_result($courses_result);
}

// Close the database connection
mysqli_close($conn);

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($result);


?>
