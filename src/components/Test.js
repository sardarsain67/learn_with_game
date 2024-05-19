import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestResult from "./TestResult";
import "../assests/css/test.css";

function Test() {
  const navigate = useNavigate();


  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]); 


  
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [testData, setTestData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [clickedOption, setClickedOption] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:80/learning_with_gaming/php/admin/course/get_course.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  const fetchQuestions = async (courseId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:80/learning_with_gaming/php/questions/get_questions_by_course.php?courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const questionsData = await response.json();

      if (questionsData.length === 0) {
        console.log("No questions available for this course");
      } else {
        setTestData(questionsData[0]); // Set the first element of the response array
        console.log("Response:", questionsData[0]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const changeQuestion = () => {
    if (answerSubmitted) {
      updateScore();
      if (currentQuestionIndex < testData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setClickedOption(0);
        setAnswerSubmitted(false);
      } else {
        setShowResult(true);
      }
    } else {
      setAnswerSubmitted(true);
    }
  };

  const isOptionCorrect = (optionIndex) => {
    return optionIndex === parseInt(testData[currentQuestionIndex]?.correctOption);
  };

  const updateScore = () => {
    if (clickedOption === parseInt(testData[currentQuestionIndex]?.correctOption)) {
      setScore(score + 1);
    }
  };

  const handleFetchError = (error) => {
    console.error("Error fetching data:", error);
    // Handle error (e.g., display error message to user)
  };

  return (
    <div>
      <p className="headingTitle">Select Course</p>
      <div className="courseSelect">
        {!selectedCourseId && (
          <div className="d-flex justify-content-center">
            <div className="col-sm-6 my-5">
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  const courseId = e.target.value;
                  console.log("Selected Course ID:", courseId);
                  setSelectedCourseId(courseId);
                  setTestData([]); // Reset testData when a new course is selected
                  fetchQuestions(courseId).catch(handleFetchError); // Call fetchQuestions with courseId and handle errors
                }}
                className="form-select"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      {selectedCourseId && (
        <div className="testBox">
          {showResult ? (
            <TestResult
              score={score}
              totalScore={testData.length}
              testData={testData}
              courseId={selectedCourseId} // Pass courseId as a prop
            />
          ) : (
            <>
              {testData.length > 0 && testData[currentQuestionIndex] && (
                <div className="question">
                  <span id="quesNumber">{currentQuestionIndex + 1}</span>
                  <span id="question-txt">
                    {testData[currentQuestionIndex].question}
                  </span>
                </div>
              )}
              {testData.length > 0 && testData[currentQuestionIndex] && (
                <div className="optionContainer">
                  {testData[currentQuestionIndex].options.map((option, index) => {
                    const isCorrect = isOptionCorrect(index + 1);
                    const isSelected = clickedOption === index + 1;
                    return (
                      <button
                        key={index}
                        className={`optionBtn ${isSelected ? "selected" : ""} ${answerSubmitted
                          ? isCorrect
                            ? "correct"
                            : "wrong"
                          : ""}`}
                        onClick={() => {
                          if (!answerSubmitted) {
                            setClickedOption(index + 1);
                          }
                        }}
                        disabled={answerSubmitted}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
              <input
                type="button"
                value={answerSubmitted ? "Next" : "Submit"}
                id="nextButton"
                onClick={changeQuestion}
                disabled={!clickedOption && !answerSubmitted}
                className="nextBtnDisabled"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Test;
