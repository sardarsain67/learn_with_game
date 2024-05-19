import React, { useState, useEffect } from "react";
import "../assests/css/courseList.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
const CourseList = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminAuthToken");

    if (!adminAuthToken) {
      navigate("/admin");
    }
  }, [navigate]);



  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:80/learning_with_gaming/php/admin/course/get_course.php"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleDelete = async (courseId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:80/learning_with_gaming/php/admin/course/delete_course.php?id=${courseId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      // Remove the course from the list
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleToggleStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === "0" ? "1" : "0";
      const response = await fetch(
        `http://localhost:80/learning_with_gaming/php/admin/course/toggle_status.php?id=${courseId}&status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: courseId,
            status: newStatus,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle course status");
      }
      // Update the status in the course list
      setCourses(
        courses.map((course) =>
          course.id === courseId ? { ...course, status: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Error toggling course status:", error);
    }
  };

  return (
    <section className="courseListMain">
      <div className="container">
        <h2 className="title">Course List</h2>
        <Button
          href="/course"
          variant="btn btn-primary"
          style={{ marginLeft: "6px", marginBottom: "6px" }}
        >
          Add New Course
        </Button>
        <table className="table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>

              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>

                <td>{course.status === "0" ? "Closed" : "Live"}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`btn ${
                      course.status === "0" ? "btn-success" : "btn-warning"
                    }`}
                    onClick={() => handleToggleStatus(course.id, course.status)}
                  >
                    {course.status === "0" ? "Live" : "Close"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CourseList;
