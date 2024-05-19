<?php
// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';
include_once '../core.php';

// Set CORS headers for preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, auth-token');
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

// Initialize $loggedInUserDetails with default values
$loggedInUserDetails = array(
    'username' => '',
    'finaltestscore' => 0,
    'rank' => 0
);

// Check if course ID is provided in the request
if (isset($_GET['courseId'])) {
    $courseId = $_GET['courseId'];

    // Query to fetch leaderboard data for the selected course from course_module_scores table
    $query = "SELECT cms.userId, cms.moduleScores, ul.username 
              FROM course_module_scores cms 
              JOIN userlogin ul ON cms.userId = ul.id 
              WHERE cms.courseId = $courseId";

    $result = mysqli_query($conn, $query);

    if ($result) {
        $leaderboardData = array();
        //$prevScore = null; // Variable to keep track of previous score
        // Assign ranks
        $rank = 0;
        $prevScore = null;
        while ($row = mysqli_fetch_assoc($result)) {
            // Parse moduleScores JSON data
            $moduleScores = json_decode($row['moduleScores'], true);

            // Extract final test score
            $finalTestScore = isset($moduleScores['modulefinaltest']) ? $moduleScores['modulefinaltest'] : 0;

            // Append username and final test score to leaderboard data
            $leaderboardData[] = array(
                'username' => $row['username'], // Use username from userlogin table
                'finaltestscore' => $finalTestScore
            );

            // If the user ID matches the auth token, store the user details
            if ($row['userId'] == $authToken) {
                $loggedInUserDetails = array(
                    'username' => $row['username'],
                    'finaltestscore' => $finalTestScore
                    //'rank' => $rank
                );
            }
        }

        // Sort leaderboard data based on final test score in descending order
        usort($leaderboardData, function ($a, $b) {
            return $b['finaltestscore'] - $a['finaltestscore'];
        });

        // Assign ranks
        //$rank = 0;
        //$prevScore = null;
        $loggedInUserRank = null; // Store the rank of the logged-in user

        foreach ($leaderboardData as $index => &$user) {
            $currentScore = $user['finaltestscore'];
            if ($currentScore !== $prevScore) {
                $rank++;
            }
            $user['rank'] = $rank;
            $prevScore = $currentScore;

            // Check if the user is logged in and assign the rank to the logged-in user
            if ($user['username'] === $loggedInUserDetails['username']) {
                $loggedInUserDetails['rank'] = $rank;
                $loggedInUserRank = $index; // Store the index for later use
            }
        }

        // Prepare response data
        $responseData = array(
            'leaderboard' => $leaderboardData,
            'loggedInUser' => $loggedInUserDetails
        );

        // If the logged-in user is not found in the leaderboard, update their rank to 0
        if ($loggedInUserRank === null) {
            $responseData['loggedInUser']['rank'] = 0;
        }

        // Send leaderboard data as JSON response
        echo json_encode($responseData);
    } else {
        echo json_encode(array('error' => 'Failed to fetch leaderboard data'));
    }
} else {
    echo json_encode(array('error' => 'Course ID not provided'));
}

?>





<?php
/*
// Start session if not already started
session_start();

// Include database connection and other necessary files
include_once '../db.php';
include_once '../core.php';

// Set CORS headers for preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, auth-token');
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

// Check if course ID is provided in the request
if (isset($_GET['courseId'])) {
    $courseId = $_GET['courseId'];

    // Query to fetch leaderboard data for the selected course from course_module_scores table
    $query = "SELECT cms.userId, cms.moduleScores, ul.username 
              FROM course_module_scores cms 
              JOIN userlogin ul ON cms.userId = ul.id 
              WHERE cms.courseId = $courseId";

    $result = mysqli_query($conn, $query);

    if ($result) {
        $leaderboardData = array();
        $prevScore = null; // Variable to keep track of previous score

        while ($row = mysqli_fetch_assoc($result)) {
            // Parse moduleScores JSON data
            $moduleScores = json_decode($row['moduleScores'], true);

            // Extract final test score
            $finalTestScore = isset($moduleScores['modulefinaltest']) ? $moduleScores['modulefinaltest'] : 0;

            // Append username and final test score to leaderboard data
            $leaderboardData[] = array(
                'username' => $row['username'], // Use username from userlogin table
                'finaltestscore' => $finalTestScore
            );

            // If the user ID matches the auth token, store the user details
            if ($row['userId'] == $authToken) {
                $loggedInUserDetails = array(
                    'username' => $row['username'],
                    'finaltestscore' => $finalTestScore
                );
            }
        }

        // Sort leaderboard data based on final test score in descending order
        usort($leaderboardData, function ($a, $b) {
            return $b['finaltestscore'] - $a['finaltestscore'];
        });

        // Assign ranks
        $rank = 0;
        $prevScore = null;

        foreach ($leaderboardData as &$user) {
            $currentScore = $user['finaltestscore'];
            if ($currentScore !== $prevScore) {
                $rank++;
            }
            $user['rank'] = $rank;
            $prevScore = $currentScore;
        }

        // Prepare response data
        $responseData = array(
            'leaderboard' => $leaderboardData,
            'loggedInUser' => isset($loggedInUserDetails) ? $loggedInUserDetails : array('username' => '', 'finaltestscore' => 0, 'rank' => 0) // Default values for loggedInUser
        );

        // Send leaderboard data as JSON response
        echo json_encode($responseData);
    } else {
        echo json_encode(array('error' => 'Failed to fetch leaderboard data'));
    }
} else {
    echo json_encode(array('error' => 'Course ID not provided'));
}
*/
?>
