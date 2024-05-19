import { useState, useEffect } from "react";
import "../assests/css/profile.css";
import main1 from "../assests/img/main-1.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();


  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]); 
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseProgress, setCourseProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchCourses();
  }, []);



  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:80/learning_with_gaming/php/auth/getuser.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("auth-token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const userData = await response.json();
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
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
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchCourseProgress = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:80/learning_with_gaming/php/auth/user_progress_in_course.php?userId=${userData.id}&courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch course progress");
      }
      const courseProgressData = await response.json();
      setCourseProgress(courseProgressData);
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    console.log("Selected Course ID:", courseId);
    fetchCourseProgress(courseId);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Container fluid="p-0">
        <section className="profile">
          <img src={main1} alt="" className="profileImage" />
          <div className="profileDetails text-white">
            <h1>My Profile</h1>
            <Row className="mb-3">
              <Col sm={12}>
                <h2>{userData.username}</h2>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12}>
                <h2>{userData.email}</h2>
              </Col>
            </Row>
          </div>
        </section>
      </Container>

      <Container fluid="p-0">
        <Row className="border p-3">
          <Col sm={12}>
            <div className="courseSelect">
              <h2 className="mt-5">Select Course</h2>
              <select
                value={selectedCourseId}
                onChange={handleCourseChange}
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
          </Col>
        </Row>
      </Container>

      {courseProgress.length > 0 && (
        <Container fluid="p-0">
          <Row className="border p-3">
            <Col sm={6} className="progressContainer">
              <div className="progressSection">
                <h2 className="mt-5">Progress</h2>
                {Object.entries(courseProgress[0]).map(([moduleKey, progress], index) => {
                  if (moduleKey !== "modulefinaltest") {
                    return (
                      <Row key={index} className="mb-3">
                        <Col sm={12}>
                          <h4>{` ${moduleKey} Progress`}</h4>
                          <ProgressBar
                            now={progress}
                            label={`${progress}%`}
                            variant={progress === 0 ? "danger" : "info"}
                            min={0}
                            max={100}
                          />
                        </Col>
                      </Row>
                    );
                  }
                })}
                {courseProgress[0].modulefinaltest !== undefined && (
                  <Row className="mb-3">
                    <Col sm={12}>
                      <h4>Course Final Test Progress</h4>
                      <ProgressBar
                        now={courseProgress[0].modulefinaltest}
                        label={`${courseProgress[0].modulefinaltest}%`}
                        variant={courseProgress[0].modulefinaltest === 0 ? "danger" : "info"}
                        min={0}
                        max={100}
                      />
                    </Col>
                  </Row>
                )}
              </div>
            </Col>



            <Col sm={6} className="border-start">
              <div className="badgesSection px-2">
                <h2 className="mt-5">Badges</h2>
                {courseProgress.map((moduleProgress, index) => (
                  <div key={index}>
                    {moduleProgress.modulefinaltest === 100 && (
                      <Badge bg="danger" className="my-2 mr-2 px-2">
                        Diamond Medal
                      </Badge>
                    )}
                    {moduleProgress.module1 === 100 && (
                      <Badge bg="dark" className="my-2 mr-2 px-2">
                        Bronze Medal
                      </Badge>
                    )}
                    {moduleProgress.module2 === 100 && (
                      <Badge bg="secondary" className="my-2 mr-2 px-2">
                        Silver Medal
                      </Badge>
                    )}
                    {moduleProgress.module3 === 100 && (
                      <Badge bg="warning" className="my-2 mr-2 px-2">
                        Gold Medal
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Profile;
