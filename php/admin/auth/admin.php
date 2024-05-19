<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is OPTIONS and return early
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200); // OK
    exit;
}

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve username and password from the POST request
    $requestData = json_decode(file_get_contents('php://input'), true); // Retrieve JSON data
    $username = $requestData["username"];
    $password = $requestData["password"];

    // Perform validation (You should implement your validation logic here, e.g., checking against a database)
    if ($username === "admin" && $password === "admin123") {
        // Credentials are valid
        $authToken = md5("adminsarrainsda"); // Generate auth token
        http_response_code(200); // OK
        echo json_encode(array("message" => "Success", "authToken" => $authToken));
        exit;
    } else {
        // Credentials are invalid
        http_response_code(401); // Unauthorized
        echo json_encode(array("message" => "Invalid username or password"));
        exit;
    }
} else {
    // If the request method is not POST, return a method not allowed error
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("message" => "Method not allowed"));
    exit;
}
?>
