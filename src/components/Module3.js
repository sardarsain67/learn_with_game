import React, { useEffect, useState } from "react";
import { GrLinkNext } from "react-icons/gr";

import { useNavigate } from 'react-router-dom';
function Module3() {

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
      header: "Understanding Regulatory Landscape in Cybersecurity",
      text: `In the realm of cybersecurity, understanding the regulatory landscape is crucial for organizations to ensure compliance and avoid potential legal and financial repercussions. Various regulations and standards govern cybersecurity practices across different industries and jurisdictions, each with its own set of requirements, guidelines, and compliance obligations. `,
    },
    {
      header: "Comprehensive Cybersecurity Compliance Program",
      text: `Building a comprehensive cybersecurity compliance program is essential for organizations to establish a structured approach to managing and mitigating cybersecurity risks, ensuring compliance with regulatory requirements, and safeguarding sensitive data and information assets.`,
    },
    {
      header: "Ensuring Vendor and Third-Party Compliance in Cybersecurity",
      text: `Ensuring vendor and third-party compliance in cybersecurity is an integral aspect of managing cybersecurity risks and maintaining a secure and trusted business environment. Organizations often rely on external vendors, suppliers, contractors, and service providers to support their operations, deliver services, and manage critical business functions, thereby sharing access to sensitive data and information assets. `,
    },
    {
      header:
        " Conducting Regular Cybersecurity Compliance Audits and Assessments",
      text: `Conducting regular cybersecurity compliance audits and assessments is a fundamental component of maintaining a strong cybersecurity posture, ensuring ongoing compliance with regulatory requirements, and identifying and mitigating potential risks and vulnerabilities. `,
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
      alert("Current Module 3 is Completed");

      try {
        const response = await fetch("http://localhost:5000/api/scores/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('auth-token')
          },
          body: JSON.stringify({
            module: 3, // Module 3
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
            <h2>Congratulations! Module 3 is Completed</h2>
            <button className="btn btn-primary justify-content mx-3 my-3" onClick={() => window.location.href = "/learn"}>Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Module3;
