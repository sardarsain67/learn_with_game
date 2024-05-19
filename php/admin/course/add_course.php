<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Decode JSON data received from the POST request
    $data = json_decode(file_get_contents("php://input"));

    // Check if required fields are present
    if (
        isset($data->courseName) &&
        isset($data->shortDescription) &&
        isset($data->numModules) &&
        isset($data->moduleNames) &&
        isset($data->headings)
    ) {
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

        // Begin transaction
        $conn->begin_transaction();

   // Extract data
$courseName = mysqli_real_escape_string($conn, $data->courseName);
$shortDescription = mysqli_real_escape_string($conn, $data->shortDescription);
$numModules = intval($data->numModules);
$moduleNames = $data->moduleNames;
$headings = $data->headings;

// Extract module names and concatenate them into a comma-separated string
$moduleNamesString = implode(",", $moduleNames);

// Insert data into the courses table
$insertCourseSql = "INSERT INTO courses (course_name, short_description, num_modules, module_name) 
                    VALUES ('$courseName', '$shortDescription', '$numModules', '$moduleNamesString')";


        if ($conn->query($insertCourseSql) === TRUE) {
            $courseId = $conn->insert_id;

            // Loop through the headings array and insert each heading into the headings table
            foreach ($headings as $index => $heading) {
                // Extract properties from each heading object
                $moduleName = mysqli_real_escape_string($conn, $heading->moduleName);
                $headingName = mysqli_real_escape_string($conn, $heading->heading);
                $content = mysqli_real_escape_string($conn, $heading->content);

                // Insert data into the headings table
                $insertHeadingSql = "INSERT INTO headings (course_id, module_name, module_number, heading_name, heading_content) 
                                    VALUES ('$courseId', '$moduleName', '". ($index + 1) . "', '$headingName', '$content')";

                if ($conn->query($insertHeadingSql) !== TRUE) {
                    echo json_encode(array("error" => "Error inserting heading: " . $conn->error));
                    $conn->rollback(); // Rollback transaction
                    $conn->close();
                    exit();
                }
            }

            $conn->commit(); // Commit transaction
            echo json_encode(array("message" => "Course added successfully."));
        } else {
            echo json_encode(array("error" => "Error inserting course: " . $conn->error));
        }

        // Close the database connection
        $conn->close();
    } else {
        echo json_encode(array("error" => "Missing required fields."));
    }
} else {
    // Return an error message if the request method is not POST
    echo json_encode(array("error" => "Invalid request method."));
}
?>
