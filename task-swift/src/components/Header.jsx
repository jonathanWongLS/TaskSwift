import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Header.css";

const UserForm = ({ option }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || password !== repeatPassword) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setValidated(false);
  }

  const handlePasswordChange = (event) => {
    console.log(event);
    setPassword(event.target.value);
    setValidated(false);
  }

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
    setValidated(false);
  }

  return (
    <Form noValidate validated={validated} className="account-form" onSubmit={handleSubmit}>
      <div className={'account-form-fields ' + (option === 1 ? 'sign-in' : (option === 2 ? 'sign-up' : 'forgot'))}>
        <InputGroup>
          <FormControl
            id="email"
            type="text"
            pattern=".+@.+\..{2,}"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <Form.Control.Feedback type="valid">Email looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Email is invalid.</Form.Control.Feedback>
        </InputGroup>
        <InputGroup>
          <FormControl
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            placeholder="Password"
            required={option === 1 || option === 2}
            disabled={option === 3}
            style={{ height: '3.2rem' }}
            onChange={handlePasswordChange} 
          />
          <Button
            className="showPassword"
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            style={{ height: '3.2rem' }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
          <Form.Control.Feedback type="valid">Password looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Password is invalid.</Form.Control.Feedback>
        </InputGroup>
        <InputGroup>
          <FormControl
            id="repeat-password"
            name="repeat-password"
            type={showRepeatedPassword ? "text" : "password"}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            placeholder="Repeat Password"
            required={option === 2}
            disabled={option === 1 || option === 3}
            onChange={handleRepeatPasswordChange}
            style={{ height: '3.2rem' }}
          />
          <Button
            className="showPassword"
            variant="outline-secondary"
            onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}
            style={{ height: '3.2rem' }}
          >
            {showRepeatedPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
          <Form.Control.Feedback type="valid">Password matches!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Passwords do not match.</Form.Control.Feedback>
        </InputGroup>
      </div>
      <button className="btn-submit-form" type="submit">
        {option === 1 ? "Sign in" : option === 2 ? "Sign up" : "Reset password"}
      </button>
    </Form>
  )
}

const Header = () => {
  const [show, setShow] = useState(false);
  const [formOption, setFormOption] = useState(1);
  const [formData, setFormData] = useState();

  const handleClose = () => {
    setShow(false);
    setFormData({'email': '', 'password': ''})
  };
  const handleShow = () => setShow(true);

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
                  Sign In
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Body>
                    <div className="form-container">
                      <header>
                        <div className={'header-headings ' + (formOption === 1 ? 'sign-in' : (formOption === 2 ? 'sign-up' : 'forgot')) }>
                          <span>Sign in to your account</span>
                          <span>Create an account</span>
                          <span>Reset your password</span>
                        </div>
                      </header>
                      <span className="options">
                        <p className={formOption === 1 ? 'active' : ''} onClick={() => setFormOption(1)}>Sign in</p>
                        <p className={formOption === 2 ? 'active' : ''} onClick={() => setFormOption(2)}>Sign up</p>
                        <p className={formOption === 3 ? 'active' : ''} onClick={() => setFormOption(3)}>Forgot Password</p>
                      </span>
                      <UserForm option={ formOption }/>
                    </div>
                  </Modal.Body>
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
