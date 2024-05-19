import { useState } from "react";
import "../assests/css/LoginRegister.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LoginRegister() {
  const [action, setAction] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let url = "";
    let message = "";

    if (action === "active") {
      url =
        "http://localhost:80/learning_with_gaming/php/auth/signup.php";
      message = "Account created successfully!";
    } else {
      url =
        "http://localhost:80/learning_with_gaming/php/auth/signin.php";
      message = "Logged in successfully!";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Save authToken in localStorage
        localStorage.setItem("auth-token", data.authToken);
        //console.log(data.authToken);
        setAlert({ type: "success", message });
        // Redirect to main page
        navigate("/main");
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <div>
      {alert && (
        <div className={`alert ${alert.type}`}>
          <p>{alert.message}</p>
          <button onClick={() => setAlert(null)}>Close</button>
        </div>
      )}

      <div className="wrapperBody">
        <div className={`wrapper ${action}`}>
          <div className="form-box login">
            <form action="" method="post" onSubmit={handleSubmit}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                />
                <FaUser className="icon" />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
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

              <button type="submit">Login</button>

              <div className="register-link">
                <p>
                  Don't have an account?{" "}
                  <a href="#" onClick={registerLink}>
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="form-box register">
            <form action="" method="post" onSubmit={handleSubmit}>
              <h1>Registration</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                />
                <FaUser className="icon" />
              </div>

              <div className="input-box">
                <input type="email" name="email" placeholder="Email" required />
                <FaEnvelope className="icon" />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <FaLock className="icon" />
              </div>

              <div className="remember-forgot">
                <label htmlFor="">
                  <input type="checkbox" name="" id="" />I agree to the Terms
                  and Conditions
                </label>
              </div>

              <button type="submit">Register</button>

              <div className="register-link">
                <p>
                  Already have an account?{" "}
                  <a href="#" onClick={loginLink}>
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
