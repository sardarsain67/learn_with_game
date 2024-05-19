import { Navbar, Nav, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
// import logo from "./assests/img/logo.png";
import logo from "../assests/img/logo.jpg";

function Navbar1() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} alt="" style={{ width: "50px", height: "50px" }} />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              style={{ fontSize: "15px", fontWeight: "500", color: "white" }}
            >
              Home
            </Nav.Link>

            <Button href="/login" variant="outline-primary">
              Login
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
export default Navbar1;
