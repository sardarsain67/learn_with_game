import React, { useEffect, useState } from "react";
import { GrLinkNext } from "react-icons/gr";

import { useNavigate } from 'react-router-dom';
function Module1() {

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
      header: "Malware Attacks",
      text: `Malicious software, or malware, is a broad category that includes 
             viruses, worms, trojans, and ransomware. These malicious programs are designed 
             to infiltrate systems, steal data, or cause damage.`,
    },
    {
      header: "Phishing and Social Engineering",
      text: `Phishing attacks use deceptive emails, websites, or messages 
             to trick individuals into revealing sensitive information, 
             such as passwords or credit card numbers. Social engineering 
             tactics exploit human psychology to manipulate individuals into 
             divulging confidential data or performing actions that compromise 
             security.`,
    },
    {
      header:
        "Denial of Service (DoS) and Distributed Denial of Service (DDoS) Attacks",
      text: `These attacks overwhelm a system, network, or website with 
             excessive traffic, causing it to become slow or unavailable to 
             legitimate users.`,
    },
    {
      header: "Man-in-the-Middle (MitM) Attacks",
      text: `In MitM attacks, cybercriminals intercept and potentially alter 
            communication between two parties without their knowledge, allowing 
            them to eavesdrop or manipulate data.`,
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
      alert("Current Module 1 is Completed");

      try {
        const response = await fetch("http://localhost:5000/api/scores/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('auth-token')
          },
          body: JSON.stringify({
            module: 1, // Module 1
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
            <h2>Congratulations! Module 1 is Completed</h2>
            <button className="btn btn-primary justify-content mx-3 my-3" onClick={() => window.location.href = "/learn"}>Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Module1;
