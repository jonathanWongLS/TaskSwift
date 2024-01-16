import { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "./Header.css";

const Header = () => {
  useEffect(() => {
    document.title = "Dashboard - TaskSwift";
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="navbar-container">
          <Navbar.Brand href="/dashboard">
            <img height={60} width={60} src="taskswift-logo.svg" alt=""></img>
            TaskSwift
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="" id="basic-navbar-nav">
            <Nav activeKey="/dashboard">
              <Nav.Item>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link activeKey="/projects" href="/projects">
                  Projects
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Button
                  variant="outline-primary"
                  href="/sign-in"
                >
                  Sign In
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
