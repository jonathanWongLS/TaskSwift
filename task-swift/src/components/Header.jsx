import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState();

  const handleClose = () => {
    setShow(false);
    setFormData({'email': '', 'password': ''})
  };
  const handleShow = () => setShow(true);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };
  const handleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleEmailChange = (newValue) => {
    setFormData(prevData => ({
      ...prevData, ['email']: newValue
    }));
  };

  const handlePasswordChange = (newValue) => {
    setFormData(prevData => ({
      ...prevData, ['password']: newValue
    }));
  };

  console.log(formData);
 
  useEffect(() => {
    document.title = "Dashboard - TaskSwift";
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="navbar-container">
          <Navbar.Brand href="#home">
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
                  onClick={() => handleShow(true)}
                >
                  Login
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Form.Group controlId="emailValidation">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          pattern=".+@.+\..{2,}"
                          onChange={e => handleEmailChange(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid email.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                          Email is valid!
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="passwordValidation">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            required
                            type={showPassword ? "text" : "password"}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            onChange={e => handlePasswordChange(e.target.value)}
                          />
                          <Button onClick={handleShowPassword}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </Button>
                        </InputGroup>
                        <Form.Text>
                          <p>Password must contain the following: A <b>lowercase</b> letter, a <b>capital (uppercase)</b> letter, a <b>number</b>, and a minimum <b>8 characters</b> </p>
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid password.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                          Password is valid!
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Check
                          required
                          label="Agree to terms and conditions"
                          feedback="You must agree before submitting."
                          feedbackType="invalid"
                        />
                      </Form.Group>
                      <br />
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
