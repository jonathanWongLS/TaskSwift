import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import PropTypes from 'prop-types';

import AlertBox from "../../components/AlertBox/AlertBox";

import "./Header.css";

import axios from "axios";
import Cookies from "js-cookie";
import { Spinner } from "react-bootstrap";

const Header = ({ loggedIn, username }) => {
  const [openLogoutConfirmModal, setOpenLogoutConfirmModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const handleOpenLogoutConfirmModal = () => setOpenLogoutConfirmModal(true);
  const handleCloseLogoutConfirmModal = () => setOpenLogoutConfirmModal(false);

  const handleLogout = () => {
    setLogoutLoading(true);
    axios.get(
      'https://54.169.240.7:8081/logout',
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then(() => {
      Cookies.remove("jwt");
      window.location.href = "/sign-up";
    }).catch((error) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setLogoutError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setLogoutError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        setLogoutError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
      setTimeout(() => {
        setLogoutError(null);
      }, 6000);
    })
    .finally(() => {
        handleCloseLogoutConfirmModal();
        setLogoutLoading(false);
      }
    );
  }

  return (
    <>
      <AlertBox errorMessage={ logoutError } />
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="navbar-container">
          <Navbar.Brand href="/dashboard">
            <img height={60} width={60} src="taskswift-logo.svg" alt=""></img>
            TaskSwift
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="" id="basic-navbar-nav">
            <Nav variant="underline">
              <Nav.Item className="header-nav-item">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              <Nav.Item className="header-nav-item">
                <Nav.Link href="/projects">Projects</Nav.Link>
              </Nav.Item>
              <Nav.Item className="header-nav-item">
                { 
                  loggedIn ? 
                  <Button variant="outline-dark" href="#" onClick={ handleOpenLogoutConfirmModal }>Hi, { username }</Button> 
                  : 
                  <Button variant="outline-primary" href="/sign-in">Sign In</Button> 
                }
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={openLogoutConfirmModal} onHide={handleCloseLogoutConfirmModal}>
        <Modal.Header>
          <Modal.Title>Are you sure you want to logout?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleLogout()}>
            I&apos;m sure!
            {
              logoutLoading ? 
              <Spinner animation="grow" size="sm" />
              :
              null
            }
          </Button>
          <Button variant="danger" onClick={ handleCloseLogoutConfirmModal }>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Header.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
}

export default Header;
