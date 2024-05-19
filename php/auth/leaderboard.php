<?php
// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';
include_once '../core.php';

// Check if auth-token is provided in the request headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Set CORS headers for preflight request
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, auth-token'); // Allow auth-token header
    header('Access-Control-Allow-Credentials: true');
    header('HTTP/1.1 200 OK');
    exit;
}

// Check if auth-token is provided in the request headers
if (!isset($_SERVER['HTTP_AUTH_TOKEN'])) {
    http_response_code(401); // Unauthorized
    exit(json_encode(array("error" => "Auth token not provided")));
}

// Extract auth-token from the request headers
$authToken = $_SERVER['HTTP_AUTH_TOKEN'];

// Fetch leaderboard based on final test scores
$leaderboardStmt = $conn->prepare('SELECT ms.userId, ms.finaltestscore, ul.username 
                                   FROM module_scores ms 
                                   JOIN userlogin ul ON ms.userId = ul.id 
                                   ORDER BY ms.finaltestscore DESC');
$leaderboardStmt->execute();
$leaderboardResult = $leaderboardStmt->get_result();
$leaderboardStmt->close();

$rank = 0;
$prevScore = null;
$leaderboardWithRank = [];
$loggedInUserDetails = null;

// Loop through the leaderboard results and assign ranks
while ($userRow = $leaderboardResult->fetch_assoc()) {
    $currentScore = $userRow['finaltestscore'];
    if ($currentScore !== $prevScore) {
        $rank++;
    }
    $userData = array(
        'rank' => $rank,
        'userId' => $userRow['userId'],
        'username' => $userRow['username'],
        'finaltestscore' => $userRow['finaltestscore']
    );
    $leaderboardWithRank[] = $userData;

    // Check if the user is logged in and match the user ID with the auth-token
    if ($userRow['userId'] == $authToken) {
        $loggedInUserDetails = $userData;
    }
    $prevScore = $currentScore;
}

// Prepare response data including both leaderboard and logged-in user details
$responseData = array(
    'leaderboard' => $leaderboardWithRank,
    'loggedInUser' => $loggedInUserDetails
);

// Set CORS headers for actual request
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

// Return the response data as JSON
header('Content-Type: application/json');
echo json_encode($responseData);
?>
