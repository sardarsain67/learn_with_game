<?php
// Include your database connection file
include_once '../db.php';

// Allow requests from the specified origin
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST'); // Allow only POST requests
header('Access-Control-Allow-Headers: Content-Type'); // Allow only Content-Type header

// Check if the request method is OPTIONS (preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with HTTP status code 200 (OK) to preflight requests
    http_response_code(200);
    exit;
}

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve question data from the POST request
    $requestData = json_decode(file_get_contents('php://input'), true);
    $courseId = $requestData["courseId"]; // Extract courseId
    $questionData = $requestData["questionData"]; // Extract question data

    // Prepare and execute the SELECT statement to fetch existing question data for the courseId
    $selectStmt = $conn->prepare("SELECT question_data FROM courses_questions WHERE courseId = ?");
    $selectStmt->bind_param("i", $courseId);
    $selectStmt->execute();
    $selectStmt->store_result();

    // If there is existing data for the courseId, fetch and append the new question
    if ($selectStmt->num_rows > 0) {
        $selectStmt->bind_result($existingData);
        $selectStmt->fetch();
        $existingArray = json_decode($existingData, true);
        // Check if the existing data is an array
        if (is_array($existingArray)) {
            // Get the index of the last question and increment it by 1
            $lastIndex = count($existingArray);
            $existingArray[$lastIndex] = $questionData; // Append new question to existing array
            $newQuestionData = json_encode($existingArray);
        } else {
            // Handle the case where existing data is not an array
            $existingArray = [];
            $existingArray[] = $questionData;
            $newQuestionData = json_encode($existingArray);
        }
        $selectStmt->close();
        // Prepare and execute the UPDATE statement to update the existing question_data
        $updateStmt = $conn->prepare("UPDATE courses_questions SET question_data = ? WHERE courseId = ?");
        $updateStmt->bind_param("si", $newQuestionData, $courseId);

        if ($updateStmt->execute()) {
            // If update is successful, send a success response
            http_response_code(200); // OK
            echo json_encode(array("message" => "Question added successfully"));
        } else {
            // If update fails, send an error response
            http_response_code(500); // Internal Server Error
            echo json_encode(array("message" => "Failed to add question"));
        }
        $updateStmt->close();
    } else {
        // If there is no existing data for the courseId, insert new row with the question data
        $insertStmt = $conn->prepare("INSERT INTO courses_questions (courseId, question_data) VALUES (?, ?)");
        $insertStmt->bind_param("is", $courseId, json_encode([$questionData]));

        if ($insertStmt->execute()) {
            // If insertion is successful, send a success response
            http_response_code(200); // OK
            echo json_encode(array("message" => "Question added successfully"));
        } else {
            // If insertion fails, send an error response
            http_response_code(500); // Internal Server Error
            echo json_encode(array("message" => "Failed to add question"));
        }
        $insertStmt->close();
    }
} else {
    // If the request method is not POST, return a method not allowed error
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("message" => "Method not allowed"));
}
?>




<?php
/*
// Include your database connection file
include_once '../db.php';

// Allow requests from the specified origin
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST'); // Allow only POST requests
header('Access-Control-Allow-Headers: Content-Type'); // Allow only Content-Type header

// Check if the request method is OPTIONS (preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with HTTP status code 200 (OK) to preflight requests
    http_response_code(200);
    exit;
}

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve question data from the POST request
    $requestData = json_decode(file_get_contents('php://input'), true);
    $question = $requestData["question"];
    $options = $requestData["options"]; // Assuming options is an array
    $correctOption = $requestData["correctOption"];

    // Prepare and execute the INSERT statement
    $stmt = $conn->prepare("INSERT INTO questions (question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssi", $question, $options[0], $options[1], $options[2], $options[3], $correctOption);

    if ($stmt->execute()) {
        // If insertion is successful, send a success response
        http_response_code(200); // OK
        echo json_encode(array("message" => "Question added successfully"));
    } else {
        // If insertion fails, send an error response
        http_response_code(500); // Internal Server Error
        echo json_encode(array("message" => "Failed to add question"));
    }

    // Close the statement
    $stmt->close();
} else {
    // If the request method is not POST, return a method not allowed error
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("message" => "Method not allowed"));
}

*/
?>
