import React, { useEffect } from "react";

function TestResult(props) {
  useEffect(() => {
    // Calculate percentage score
    const percentage = (props.score / props.totalScore) * 100;
    console.log(percentage);

    // Submit final test score to the server
    const submitFinalTestScore = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");
        const response = await fetch(
          "http://localhost:80/learning_with_gaming/php/score/update_score.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify({
              module: "finaltest",
              score: percentage, // Send percentage score to the server
              courseId: props.courseId, // Pass courseId to the server
            }),
          }
        );
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error("Error updating final test score:", error);
      }
    };

    submitFinalTestScore();
  }, [props.score, props.totalScore, props.courseId]); // Add courseId to the dependency array

  return (
    <div className="showScore">
      Your score is {props.score} out of {props.totalScore}
    </div>
  );
}

export default TestResult;
