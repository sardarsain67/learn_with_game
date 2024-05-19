import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assests/img/logo.jpg";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Navbar2(props) {
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
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} alt="" style={{ width: "50px", height: "50px" }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                href="/main"
                style={{ fontSize: "15px", fontWeight: "500", color: "black" }}
              >
                Home
              </Nav.Link>
              {/*<Nav.Link
                href="/learn"
                style={{ fontSize: "15px", fontWeight: "500", color: "black" }}
              >
                Learn
  </Nav.Link>*/}
              <Nav.Link
                href="/leaderBoard"
                style={{ fontSize: "15px", fontWeight: "500", color: "black" }}
                onClick={props.toggleMode}
              >
                LeaderBoard
              </Nav.Link>
              <Nav.Link
                href="/profile"
                style={{ fontSize: "15px", fontWeight: "500", color: "black" }}
              >
                Profile
              </Nav.Link>
              <Nav.Link
                href="/test"
                style={{ fontSize: "15px", fontWeight: "500", color: "black" }}
              >
                Test
              </Nav.Link>
              <Button
                variant="danger"
                style={{ fontSize: "15px", fontWeight: "500", color: "white" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
export default Navbar2;
