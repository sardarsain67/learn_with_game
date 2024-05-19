<?php
// Include your database connection file
include_once '../db.php';
include_once '../core.php';

// Allow requests from the specified origin
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: DELETE, OPTIONS'); // Allow DELETE and OPTIONS requests
header('Access-Control-Allow-Headers: Content-Type, Authorization, auth-token'); // Allow specified headers

// Check if the request method is OPTIONS (preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with HTTP status code 200 (OK) to preflight requests
    http_response_code(200);
    exit;
}

// Check if the request method is DELETE
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    // Retrieve data from the DELETE request
    $requestData = json_decode(file_get_contents('php://input'), true);

    // Check if courseId and questionText are provided in the request
    if (!isset($requestData["courseId"]) || !isset($requestData["questionText"])) {
        http_response_code(400); // Bad Request
        echo json_encode(array("error" => "Course ID or question text not provided"));
        exit;
    }

    $courseId = $requestData["courseId"]; // Extract courseId
    $questionText = $requestData["questionText"]; // Extract question text

    // Prepare and execute the SELECT statement to fetch existing question data for the courseId
    $selectStmt = $conn->prepare("SELECT question_data FROM courses_questions WHERE courseId = ?");
    $selectStmt->bind_param("i", $courseId);
    $selectStmt->execute();
    $selectStmt->store_result();

    // If there is existing data for the courseId, fetch and remove the specified question
    if ($selectStmt->num_rows > 0) {
        $selectStmt->bind_result($existingData);
        $selectStmt->fetch();
        $existingArray = json_decode($existingData, true);

        // Find and remove the question with the given question text
        $updatedQuestionsArray = array_values(array_filter($existingArray, function($question) use ($questionText) {
            return $question['question'] !== $questionText;
        }));

        // Encode the updated questions array back to JSON
        $updatedQuestionData = json_encode($updatedQuestionsArray);

        // Prepare and execute the UPDATE statement to update the existing question_data
        $updateStmt = $conn->prepare("UPDATE courses_questions SET question_data = ? WHERE courseId = ?");
        $updateStmt->bind_param("si", $updatedQuestionData, $courseId);

        if ($updateStmt->execute()) {
            // If update is successful, send a success response
            http_response_code(200); // OK
            echo json_encode(array("message" => "Question deleted successfully"));
        } else {
            // If update fails, send an error response
            http_response_code(500); // Internal Server Error
            echo json_encode(array("error" => "Failed to delete question"));
        }
        $updateStmt->close();
    } else {
        // If there is no existing data for the courseId, return a not found error
        http_response_code(404); // Not Found
        echo json_encode(array("error" => "Course not found"));
    }
    $selectStmt->close();
} else {
    // If the request method is not DELETE, return a method not allowed error
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Method not allowed"));
}
?>
