import "../assests/css/home.css";

import home1 from "../assests/img/home-1.webp";
import home2 from "../assests/img/home-2.jpg";
import home3 from "../assests/img/home-3.png";
import home4 from "../assests/img/home-4.jpeg";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import React, { useState, useEffect } from "react";

function Home() {
  let [myStyle] = useState({ color: "#30336b", fontWeight: 550 });

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

  return (
    <div>
      <Container fluid>
        <Row className="homeRow">
          <Col>
            <img src={home1} alt="" className="homeImg" />
          </Col>
          <Col>
            <div>
              <p className="homeTitle">
                When life gets <span style={{ color: "red" }}>hard</span>, it
                means you{" "}
                <span style={{ color: "green" }}>just leveled up</span> .
              </p>
              <p className="homeText">
                Cyber security is the application of technologies, processes,
                and controls to protect systems, networks, programs, devices and
                data from cyber attacks. It aims to reduce the risk of cyber
                attacks and protect against the unauthorised exploitation of
                systems, networks, and technologies.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* =========Courses Section======== */}
      <Container fluid>
        <Row style={{ background: "lightgrey" }} className="cardRow">
          <h1 style={{ textAlign: "center", color: "#130f40" }}>Our Courses</h1>
          {courses.map((course, index) => (
            <Col key={index}>
              <Card style={{ width: "18rem" }}>
                {/* Assuming your course data structure includes an 'image' property */}
                {/*<Card.Img variant="top" src={course.image} className="cardImg" />*/}
                <Card.Body>
                  <Card.Title className="cardTitle">{course.title}</Card.Title>
                  <Card.Text className="cardText">
                    {course.description}
                  </Card.Text>
                </Card.Body>
                <Button
                  variant="primary"
                  className="btnStyle"
                  href={course.status === "1" ? `/login` : "#"}
                  disabled={course.status === "0"}
                >
                  {course.status === "1" ? "Visit Course" : "Coming Soon"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
