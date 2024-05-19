<?php

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
} else {
    //echo "Connection successful!";
    
}

// Optional: Set charset to UTF-8 (if needed)
$conn->set_charset("utf8");

// If you need to close the connection, you can do it like this:
// $conn->close();

?>
