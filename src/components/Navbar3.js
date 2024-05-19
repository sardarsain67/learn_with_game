import { Navbar, Nav, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import logo from "../assests/img/logo.jpg";
import { useNavigate } from "react-router-dom";

function Navbar3() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:80/learning_with_gaming/php/auth/logout.php",
        {
          method: "POST",
          body: new FormData(), // No need to pass any data since it's just a logout request
        }
      );

      // Check if the status code indicates success (2xx range)
      if (response.ok) {
        // Clear local storage
        localStorage.clear();

        // Redirect to root path
        navigate("/");
      } else {
        // Handle non-successful responses
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} alt="" style={{ width: "50px", height: "50px" }} />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button href="/question" variant="outline-primary">
              Question
            </Button>
            {/* <Button
              href="/course"
              variant="outline-primary"
              style={{ marginLeft: "6px" }}
            >
              Course
            </Button> */}
            <Button
              href="/courselist"
              variant="outline-primary"
              style={{ marginLeft: "6px" }}
            >
              See Courses
            </Button>
            <Button
              variant="danger"
              style={{
                fontSize: "15px",
                fontWeight: "500",
                color: "white",
                marginLeft: "8px",
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbar3;
