import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../assests/css/learn.css";
import { useNavigate } from "react-router-dom";

function Learn() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [moduleProgress, setModuleProgress] = useState({}); // New state to store module progress
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const response = await fetch(
          `http://localhost:80/learning_with_gaming/php/admin/course/get_course_details.php?courseId=${courseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourseDetails(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    }

    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    async function fetchUserProgress() {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) return;

      try {
        const userId = localStorage.getItem("auth-token"); // Change this to userId
        if (!userId) return;

        const response = await fetch(
          `http://localhost:80/learning_with_gaming/php/auth/user_progress_in_course.php?userId=${userId}&courseId=${courseId}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user progress");
        }
        const data = await response.json();
        console.log("User Progress Data:", data); // Log user progress data
        setUserProgress(data);

        // Update moduleProgress state based on userProgress
        const progress = {};
        data.forEach((item) => {
          const [module, value] = Object.entries(item)[0];
          progress[module] = value;
        });
        setModuleProgress(progress);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    }

    fetchUserProgress();
  }, [courseId]);

  const handleStartLearn = (index) => {
    setCurrentModuleIndex(index);
    setCurrentContentIndex(0);
  };

  const handleNextContent = () => {
    if (courseDetails && currentModuleIndex !== null) {
      const currentModule = courseDetails.modules[currentModuleIndex];
      const totalSlides = currentModule.contents.length;
      const scoreIncrementPerSlide = 100 / totalSlides;

      if (currentContentIndex < totalSlides - 1) {
        setCurrentContentIndex((prevIndex) => prevIndex + 1);
        updateScore(
          currentModuleIndex + 1,
          (currentContentIndex + 1) * scoreIncrementPerSlide
        );
      } else {
        if (currentModuleIndex < courseDetails.modules.length - 1) {
          setCurrentModuleIndex((prevIndex) => prevIndex + 1);
          setCurrentContentIndex(0);
          congratulateUser(currentModuleIndex + 1);
          updateScore(currentModuleIndex + 1, 100);
        } else {
          alert("Congratulations! You have completed this course.");
          updateScore(currentModuleIndex + 1, 100);
        }
      }
    }
  };

  const congratulateUser = (moduleIndex) => {
    alert(`Congratulations! You have completed Module ${moduleIndex}.`);
  };

  const updateScore = async (module, score) => {
    const authToken = localStorage.getItem("auth-token");
    const requestData = {
      courseId,
      module,
      score,
    };

    try {
      const response = await fetch(
        "http://localhost:80/learning_with_gaming/php/score/update_score.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <section className="learnMain">
      <div className="container mt-4">
        {courseDetails ? (
          <div>
            <div>
              <h1
                style={{
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                {courseDetails.title}
              </h1>
              <p style={{ fontWeight: "bold", color: "#fff" }}>
                Overview of the course: {courseDetails.description}
              </p>
            </div>
            {currentModuleIndex === null ? (
              <div>
                {courseDetails.modules.map((module, index) => (
                  <Card key={index} className="mb-4">
                    <Card.Header>{module.moduleName}</Card.Header>
                    <Card.Body>
                      <Card.Text>{module.shortDescription}</Card.Text>
                      <Button
                        variant="primary"
                        disabled={
                          (() => {
                            const isFirstModule = index === 0;
                            const previousModuleProgress = moduleProgress[`module${index}`] || 0;

                            if (isFirstModule) {
                              // Enable only if no progress in any module
                              return previousModuleProgress !== 0;
                            } else {
                              // Enable only if previous module's progress is not 100
                              return previousModuleProgress !== 100;
                            }
                          })()
                        }
                        onClick={() => {
                          handleStartLearn(index);
                         
                        }}
                      >
                        Start Learn
                        {(() => {
                          const isFirstModule = index === 0;
                          const previousModuleProgress = moduleProgress[`module${index}`] || 0;

                          if (!isFirstModule && previousModuleProgress !== 100) {
                            // Show the message only when the button is disabled
                            return <span style={{ color: 'red' }}>Please complete the previous module:{previousModuleProgress}</span>;
                          }
                        })()}
                      </Button>





                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mb-4">
                <Card.Header>
                  {courseDetails.modules[currentModuleIndex].moduleName}
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {
                      courseDetails.modules[currentModuleIndex].contents[
                        currentContentIndex
                      ].heading
                    }
                  </Card.Title>
                  <Card.Text>
                    {
                      courseDetails.modules[currentModuleIndex].contents[
                        currentContentIndex
                      ].content
                    }
                  </Card.Text>
                  <Button variant="primary" onClick={handleNextContent}>
                    Next
                  </Button>
                </Card.Body>
              </Card>
            )}
          </div>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>
    </section>
  );
}

export default Learn;
