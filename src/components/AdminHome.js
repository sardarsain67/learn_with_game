import React from "react";

import "../assests/css/AdminHome.css";
import {useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminAuthToken");

    if (!adminAuthToken) {
      navigate("/admin");
    }
  }, [navigate]);


  

  /*
  const adminAuthToken = localStorage.getItem("adminAuthToken");
  if (!adminAuthToken) {
    // Navigate to the admin home page
    navigate("/admin");
  }
  */

  const handleCoursesClick = () => {
    // Redirect to /courses page
    navigate("/course");
  };

  const handleQuestionsClick = () => {
    // Redirect to /question page
    navigate("/question");
  };
  const handleCoursesShowClick = () => {
    // Redirect to /question page
    navigate("/courselist");
  };

  return (
    <section className="main">
      <div className="container">
        <h1 className="mb-5 title">Welcome to Admin Panel</h1>
        <div className="row justify-content-center">
          {/* <div className="col-md-4"> */}
          <div className="adminBtn">
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleCoursesClick}
            >
              Courses
            </button>
            {/* </div>
          <div className="col-md-4"> */}
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleCoursesShowClick}
            >
              Show Courses
            </button>
            {/* </div>
          <div className="col-md-4"> */}
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleQuestionsClick}
            >
              Questions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
