import React, { useEffect, useState } from "react";
import { GrLinkNext } from "react-icons/gr";

import { useNavigate } from 'react-router-dom';
function Module2() {

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the auth-token exists in localStorage
    const authToken = localStorage.getItem('auth-token');

    if (!authToken) {
      // Redirect to the login page if the auth-token doesn't exist
      navigate('/login');
    }
  }, [navigate]); 
  const moduleContents = [
    {
      header: "Implementing Strong Password Policies",
      text: `One of the foundational elements of cybersecurity best practices 
             is implementing strong password policies. Weak or easily guessable 
             passwords can be a significant vulnerability, allowing cybercriminals 
             to gain unauthorized access to systems, networks, and sensitive data. `,
    },
    {
      header: "Keeping Software and Systems Up to Date",
      text: `Keeping software and systems up to date is another critical cybersecurity best practice. Software updates and patches often contain security fixes for known vulnerabilities that cybercriminals can exploit to compromise systems and networks.  `,
    },
    {
      header: "Implementing Robust Endpoint Security Measures",
      text: `Endpoint security is a crucial component of cybersecurity best practices, focusing on protecting the network's endpoints, such as computers, mobile devices, and servers, from malicious activities and unauthorized access.  `,
    },
    {
      header: "Conducting Regular Security Awareness Training",
      text: `Security awareness training is an essential cybersecurity best practice that aims to educate employees and users about the latest cyber threats, attack techniques, and best practices for maintaining a secure computing environment.  `,
    },
  ];

  const [moduleContentIndex, setModuleContentIndex] = useState(0);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setNextButtonVisible(true);
    }, 1000);
  }, [moduleContentIndex]);

  const handleNextClick = async () => {
    if (moduleContentIndex < moduleContents.length - 1) {
      setModuleContentIndex((prevIndex) => prevIndex + 1);
      setNextButtonVisible(false);
    } else {
      // Display congratulation message and home button
      setNextButtonVisible(false);
      alert("Current Module 2 is Completed");

      try {
        const response = await fetch("http://localhost:5000/api/scores/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('auth-token')
          },
          body: JSON.stringify({
            module: 2, // Module 1
            score: 100,
          }),
        });

        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }
  };

  return (
    <div>
      <div
        style={{
          flex: 2,
          width: "450px",
          margin: "20px auto",
          borderRadius: "20px",
          backgroundColor: "lightgray",
        }}
      >
        <div
          style={{
            background: "#3498db",
            fontSize: "20px",
            fontWeight: "550",
            fontFamily: "cursive",
            marginBottom: "5px",
            textAlign: "center",
            padding: "15px 20px",
            color: "#fff",
            borderRadius: "20px",
          }}
        >
          {moduleContents[moduleContentIndex].header}
        </div>
        <div
          style={{ fontSize: "15px", fontWeight: "550", padding: "5px 10px" }}
        >
          {moduleContents[moduleContentIndex].text}
        </div>
        {nextButtonVisible && (
          <button
            onClick={handleNextClick}
            style={{
              width: "40px",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "10px",
              backgroundColor: "blue",
              border: "none",
              marginLeft: "190px",
              marginBottom: "10px",
            }}
          >
            <GrLinkNext />
          </button>
        )}
        {/* Display congratulation message and home button on last slide */}
        {!nextButtonVisible && moduleContentIndex === moduleContents.length - 1 && (
          <div>
            <h2>Congratulations! Module 2 is Completed</h2>
            <button className="btn btn-primary justify-content mx-3 my-3" onClick={() => window.location.href = "/learn"}>Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Module2;
