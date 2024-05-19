import main2 from "../assests/img/main-2.png";
import main3 from "../assests/img/main-3.png";
import main4 from "../assests/img/main-4.jpg";
import "../assests/css/main.css";
import main1 from "../assests/img/main-1.jpg";
import Card from "react-bootstrap/Card";

// import game from "../assests/img/images-1.jpg";
// import game1 from "../assests/img/game1.jpg";
// import game2 from "../assests/img/image-2.png";
// import game3 from "../assests/img/image-3.jpeg";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
function Main() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(
          "http://localhost:80/learning_with_gaming/php/admin/course/get_course.php"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data); // Update this line
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    // Check if the auth-token exists in localStorage
    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      // Redirect to the login page if the auth-token doesn't exist
      navigate("/login");
    }
  }, [navigate]);

  let [myStyle] = useState({ color: "#30336b", fontWeight: 550 });
  return (
    <>
      {/* =========Slider========= */}
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={main2}
              className="d-block w-100"
              alt="..."
              style={{ width: "100%", height: "500px" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src={main3}
              className="d-block w-100"
              alt="..."
              style={{ width: "100%", height: "500px" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src={main4}
              className="d-block w-100"
              alt="..."
              style={{ width: "100%", height: "500px" }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* =========Image with Content========= */}
      <section className="section-1">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-6">
              <div className="pray">
                <img src={main1} alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="panel text-left">
                <h1>Increasing Sophistication</h1>
                <p className="pt-4">
                  One of the most notable trends in the digital threat landscape
                  is the increasing sophistication of cyberattacks. Attackers
                  constantly develop new techniques and strategies to breach
                  security systems, steal sensitive data, or disrupt critical
                  services
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========Learn========= */}
      <section className="section-2 container-fluid p-0">
        <div className="cover">
          <div className="content text-center">
            <h1>Some Features That Made Us Unique</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
              officia.
            </p>
          </div>
        </div>
        <div className="container-fluid text-center">
          <div className="numbers d-flex flex-md-row flex-wrap justify-content-center">
            <div className="rect">
              <p>
                It takes 20 years to build a reputation and a few minutes of
                cyber-incident to ruin it
              </p>
            </div>
            <div className="rect">
              <p>
                There’s no silver bullet with cybersecurity; a layered defense
                is the only viable option.
              </p>
            </div>
            <div className="rect">
              <p>A breach alone is not a disaster, but mishandling it is.</p>
            </div>
            <div className="rect">
              <p>
                Cybercrime is the greatest threat to every company in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*==========Cards========== */}
      <section className="container-fluid p-0">
        {/* =========Courses Section======== */}
        <Container fluid>
          <Row style={{ background: "lightgrey" }} className="cardRow">
            <h1 style={{ textAlign: "center", color: "#130f40" }}>
              Our Courses
            </h1>
            {courses.map((course, index) => (
              <Col key={index}>
                <Card style={{ width: "18rem" }}>
                  {/* Assuming your course data structure includes an 'image' property */}
                  {/*<Card.Img variant="top" src={course.image} className="cardImg" />*/}
                  <Card.Body>
                    <Card.Title className="cardTitle">
                      {course.title}
                    </Card.Title>
                    <Card.Text className="cardText">
                      {course.description}
                    </Card.Text>
                  </Card.Body>
                  <Button
                    variant="primary"
                    className="btnStyle"
                    href={course.status === "1" ? `/learn/${course.id}` : "#"}
                    disabled={course.status === "0"}
                  >
                    {course.status === "1" ? "Visit Course" : "Coming Soon"}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
export default Main;
