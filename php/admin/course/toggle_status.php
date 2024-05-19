<?php
// Allow requests from the specified origin
header("Access-Control-Allow-Origin: http://localhost:3000");

// Allow the specified HTTP methods
header("Access-Control-Allow-Methods: PUT, DELETE");

// Allow the Content-Type header
header("Access-Control-Allow-Headers: Content-Type");

// Respond to OPTIONS requests with HTTP OK status
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Read the input data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the required data is present
    if (isset($data['id']) && isset($data['status'])) {
        // Extract the course ID and status from the request data
        $courseId = $data['id'];
        $status = $data['status'];

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

        // Update the course status in the database
        $sql = "UPDATE courses SET status='$status' WHERE id='$courseId'";

        if ($conn->query($sql) === TRUE) {
            // Return a success message
            echo json_encode(["message" => "Course status toggled successfully"]);
        } else {
            // Return an error message if the SQL query fails
            http_response_code(500); // Internal Server Error
            echo json_encode(["message" => "Error updating course status: " . $conn->error]);
        }

        // Close database connection
        $conn->close();
    } else {
        // Return an error message if the required data is not provided
        http_response_code(400); // Bad request
        echo json_encode(["message" => "Course ID and status are required"]);
    }
} else {
    // Return an error message if the request method is not PUT
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Only PUT method is allowed"]);
}
?>
