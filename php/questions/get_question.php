<?php
// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';
include_once '../core.php';

// Fetch questions from the database
$questionsStmt = $conn->prepare('SELECT * FROM questions');
$questionsStmt->execute();
$questionsResult = $questionsStmt->get_result();
$questionsStmt->close();

// Check if questions exist
if ($questionsResult->num_rows > 0) {
    $questions = [];
    // Loop through the questions and format them
    while ($questionRow = $questionsResult->fetch_assoc()) {
        $question = [
            'id' => $questionRow['id'],
            'question' => $questionRow['question'],
            'options' => [
                $questionRow['option1'],
                $questionRow['option2'],
                $questionRow['option3'],
                $questionRow['option4'],
            ],
            'answer' => intval($questionRow['answer']),
        ];
        $questions[] = $question;
    }

    // Return the questions as JSON response
    header('Content-Type: application/json');
    echo json_encode($questions);
} else {
    // No questions found
    http_response_code(404); // Not Found
    echo json_encode(array('message' => 'No questions found'));
}
?>
