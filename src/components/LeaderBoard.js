import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import "../assests/css/leaderBoard.css";
import { useNavigate } from "react-router-dom";

function LeaderBoard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({
    rank: 0,
    finaltestscore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchCourses() {
      try {
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
        setLoading(false); // Set loading to false after fetching courses
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false); // Set loading to false on error
      }
    }

    fetchCourses();
  }, []);

  // Inside the handleCourseChange function
  // Inside the handleCourseChange function
  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    console.log("Selected Course ID:", courseId);

    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        console.error("Auth token not found");
        return;
      }

      const response = await fetch(
        `http://localhost:80/learning_with_gaming/php/auth/course_wise_leaderboard.php?courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );

      if (!response.ok) {
        console.error("Server error:", response.statusText);
        return;
      }

      const responseData = await response.json();

      // Update leaderboard data
      setLeaderboardData(responseData.leaderboard);

      // Update logged-in user data
      setLoggedInUser(responseData.loggedInUser);

    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };


  if (loading) {
    return <p>Loading...</p>; // Display loading message
  }

  return (
    <Container fluid="p-0">
      <div className="courseSelect mt-5">
        <h2 className="mb-4">Select Course</h2>
        <select
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="form-select"
          style={{ maxWidth: "300px" }} // Set max width for better appearance
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>


      {/* Render leaderboard section only when a course is selected */}
      {leaderboardData.length > 0 && (
        <>
          {/* Render top three students */}
          <div className="leader">
            {leaderboardData.map((item, index) => (
              <Card key={index} style={{ width: "18rem" }} className="cardBody">
                <Card.Body>
                  <Card.Title>{item.username}</Card.Title>
                  <Card.Text>Rank: {item.rank}</Card.Text>
                  <Card.Text>Score: {item.finaltestscore}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Render leaderboard table */}
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Rank</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {/* Render the first row with logged-in user data */}
              <tr>
                <td></td>
                <td>You</td>
                <td>{loggedInUser.rank}</td>
                <td>{loggedInUser.finaltestscore}</td>
              </tr>
              {/* Render other leaderboard data */}
              {leaderboardData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.rank}</td>
                  <td>{item.finaltestscore}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}

export default LeaderBoard;
