import React, { useState, useEffect } from "react";
import "../assests/css/Questions.css"; // Import custom CSS file
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();
  const [showQuestions, setShowQuestions] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: "",
    courseId: "", // Add courseId to formData state
  });
  const [courses, setCourses] = useState([]); // State variable to store courses

  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminAuthToken");
    if (!adminAuthToken) {
      // Navigate to the admin home page
      navigate("/admin");
    }
    // Function to fetch courses from the database
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:80/learning_with_gaming/php/admin/course/get_course.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data); // Set the list of courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    // Call the fetchCourses function
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "courseId" && value !== "") {
      // Fetch questions for the selected course
      fetchQuestions(value);
    } else {
      // Reset the questions array if no course is selected
      setQuestions([]);
    }
  };

  const fetchQuestions = async (courseId) => {
    try {
      const adminAuthToken = localStorage.getItem("adminAuthToken");

      console.log(adminAuthToken);
      const response = await fetch(
        `http://localhost:80/learning_with_gaming/php/questions/course_wise_questions.php?courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": adminAuthToken // Include adminAuthToken in the request headers
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuestions(data.questions); // Set the fetched questions for the selected course
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const toggleShowQuestions = () => {
    setShowQuestions(!showQuestions);
    setAddQuestion(false);
  };

  const toggleAddQuestion = () => {
    setAddQuestion(!addQuestion);
    setShowQuestions(false);
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...formData.options];
    newOptions[index] = e.target.value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleAddQuestion = async () => {
    try {
      // Construct the question data object
      const questionData = {
        courseId: formData.courseId,
        questionData: {
          question: formData.question,
          options: formData.options,
          correctOption: formData.correctOption
        }
      };

      // Send a request to add the new question to the database
      const response = await fetch(
        "http://localhost:80/learning_with_gaming/php/questions/add_question.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        }
      );

      if (response.ok) {
        // If the question is added successfully, display a success message
        alert("Question added successfully");

        // Reset the form fields for adding a new question
        setFormData({
          courseId: "",
          question: "",
          options: ["", "", "", ""],
          correctOption: "",
        });
      } else {
        // If adding the question fails, display an error message
        alert("Failed to add question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };



  const handleDeleteQuestion = async (courseId, questionText) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (confirmDelete) {
      console.log('courseId:', courseId, 'question:', questionText);

      // Send a request to delete the question
      try {
        const adminAuthToken = localStorage.getItem("adminAuthToken");
        const response = await fetch(
          `http://localhost:80/learning_with_gaming/php/questions/delete_question.php`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": adminAuthToken // Include adminAuthToken in the request headers
            },
            body: JSON.stringify({ courseId, questionText }) // Send data in the request body
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Handle success response
        const data = await response.json();
        console.log(data.message); // Log the success message
        // Refresh the questions list
        fetchQuestions(courseId);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };


  return (
    <div className="container-fluid ">
      <section className="questionMain">
        <div>
          <p className="quesContent">
            In today's interconnected digital landscape, cybersecurity stands as
            a paramount concern for individuals and organizations alike.
          </p>
        </div>
        <div className="buttons-container">
          {" "}
          {/* Wrap buttons in a container */}
          <button
            className="btn btn-primary mx-2"
            onClick={toggleShowQuestions}
          >
            Show Questions
          </button>
          <button className="btn btn-primary" onClick={toggleAddQuestion}>
            Add Question
          </button>
        </div>
      </section>
      {showQuestions && (
        <div>
          {/* Show the course select dropdown */}
          <div className="form-group position-relative custom-dropdown" style={{ width: "300px", float: "left", marginRight: "20px" }}>
            <label className="mb-2">Select Course:</label>
            <select
              className="form-control custom-select"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>


          {/* Show the questions table */}
          <h2 className="mt-4">All Questions</h2>
          <table className="table table-bordered table-striped mt-3">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Question ID</th>
                <th scope="col">Question</th>
                <th scope="col">Options</th>
                <th scope="col">Correct Option</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((questionSet, setIndex) => (
                  questionSet.map((question, index) => (
                    <tr key={setIndex + "-" + index}>
                      <td>{setIndex + "-" + index}</td>
                      <td>{question.question}</td>
                      <td>
                        <ul className="options-list">
                          {question.options.map((option, i) => (
                            <li key={i} className="numbered-option"> {option}</li>
                          ))}
                        </ul>


                      </td>
                      <td>{question.correctOption}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteQuestion(formData.courseId, question.question)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ))
              ) : (
                <tr>
                  <td colSpan="5">No questions available , please select course first</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {addQuestion && (
        <section className="addQuestionMain">
          <div className="d-flex justify-content-center">
            {" "}
            {/* Center the form horizontally */}
            <div className="custom-form-container">
              {" "}
              {/* Apply custom width */}
              <h2 style={{ textAlign: "center" }}>Add Question</h2>
              <form>
                <div className="form-group">
                  <label>Course:</label>
                  <select
                    className="form-control"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Question:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Options:</label>
                  {formData.options.map((option, index) => (
                    <div
                      key={index}
                      className="form-group"
                      style={{ marginBottom: "10px" }}
                    >
                      <label>{1 + index}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => handleOptionChange(e, index)}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Correct Option:</label>
                  <select
                    className="form-control"
                    name="correctOption"
                    value={formData.correctOption}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Correct Option</option>
                    {[1, 2, 3, 4].map((option) => (
                      <option key={option} value={option}>
                        Option {option}
                      </option>
                    ))}
                  </select>
                </div>



                <button
                  className="btn btn-primary my-2"
                  type="button"
                  onClick={handleAddQuestion}
                >
                  Add Question
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Questions;
