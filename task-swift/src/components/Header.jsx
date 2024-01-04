import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Header.css";

const UserForm = ({ option }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="account-form" onSubmit={(e) => e.preventDefault()}>
      <div className={'account-form-fields ' + (option === 1 ? 'sign-in' : (option === 2 ? 'sign-up' : 'forgot'))}>
        <InputGroup>
          <FormControl
            id="email"
            type="text"
            pattern=".+@.+\..{2,}"
            placeholder="E-mail"
            required
          />
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
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            style={{ height: '3.2rem' }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </InputGroup>
        <InputGroup>
          <FormControl
            id="repeat-password"
            name="repeat-password"
            type={showPassword ? "text" : "password"}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            placeholder="Repeat Password"
            required={option === 2}
            disabled={option === 1 || option === 3}
          />
        </InputGroup>
      </div>
      <button className="btn-submit-form" type="submit">
        {option === 1 ? "Sign in" : option === 2 ? "Sign up" : "Reset password"}
      </button>
    </form>
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
