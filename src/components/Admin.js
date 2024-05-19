import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Admin() {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a fetch request to your admin.php endpoint to validate credentials
    const response = await fetch(
      "http://localhost:80/learning_with_gaming/php/admin/auth/admin.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      // If response is successful, extract the auth token from the response
      const { authToken } = await response.json();
      // Save the auth token to local storage
      localStorage.setItem("adminAuthToken", authToken);
      // Navigate to the admin home page or question page
      navigate("/adminhome");
      //navigate("/question");
    } else {
      // If response is not successful, show error message
      alert("Invalid credentials");
    }
  };

  // Redirect to the admin page if already authenticated
  if (localStorage.getItem("adminAuthToken")) {
    //navigate("/adminhome");
  }

  return (
    <div>
      <div className="wrapperBody">
        <div className={`wrapper`}>
          <div className="form-box login">
            <form onSubmit={handleSubmit}>
              <h1>Admin</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <FaUser className="icon" />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="icon" />
              </div>

              <div className="remember-forgot">
                <label htmlFor="">
                  <input type="checkbox" name="" id="" />
                  Remember Me
                </label>
                <a href="#">Forgot Password</a>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
