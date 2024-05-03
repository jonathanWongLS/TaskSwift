import { useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import { IoMdSearch } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';

import { useSearchParams } from 'react-router-dom';

import Header from '../../components/Header/Header';
import TaskList from '../../components/TaskList/TaskList';
import ProjectMembers from '../../components/ProjectMembers/ProjectMembers';
import AlertBox from "../../components/AlertBox/AlertBox";

import './Tasks.css';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useJwt } from "react-jwt";

const Tasks = () => {
  const { decodedToken, isExpired } = useJwt(Cookies.get("jwt"));
  const [searchParams, setSearchParams] = useSearchParams();

  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectData, setProjectData] = useState(null);

  const [showChangeProjectNameModal, setShowChangeProjectNameModal] = useState(false);
  const [showChangeProjectDescModal, setShowChangeProjectDescModal] = useState(false);

  const [newProjectName, setNewProjectName] = useState(projectName);
  const [newProjectDesc, setNewProjectDesc] = useState(projectDesc);
  
  const [getProjectLoading, setGetProjectLoading] = useState(false);
  const [getProjectError, setGetProjectError] = useState(null);
  const [updateProjectLoading, setUpdateProjectLoading] = useState(false);
  const [updateProjectError, setUpdateProjectError] = useState(null);

  const [projectId, setProjectId] = useState(searchParams.get("projectId"));

  const handleShowEditProjectNameModal = () => setShowChangeProjectNameModal(true);

  const handleShowEditProjectDescModal = () => setShowChangeProjectDescModal(true);

  const handleCloseChangeProjectNameModal = () => setShowChangeProjectNameModal(false);

  const handleCloseChangeProjectDescModal = () => setShowChangeProjectDescModal(false);

  const handleProjectNewNameChange = (e) => {
    e.preventDefault();
    setNewProjectName(e.target.value);
    
  };

  const handleProjectNewDescChange = (e) => {
    e.preventDefault();
    setNewProjectDesc(e.target.value);
    
  };

  const handleSaveChangeProjectName = () => {
    setUpdateProjectLoading(true);
    setUpdateProjectError(null);

    let updatedProjectRequest = {
      "projectName": "",
      "projectDescription": null,
      "assignedUsers": []
    };

    if (projectName == newProjectName) {
      setUpdateProjectLoading(false);
      handleCloseChangeProjectNameModal();
      return;
    } else {
      updatedProjectRequest.projectName = newProjectName;
    }

    axios.put(
      `http://13.212.104.51:8081/api/v1/project/${projectId}`, 
      updatedProjectRequest,
      {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "Bearer " + Cookies.get("jwt")
          }
      })
      .then(function (response) {
          
          setProjectName(newProjectName);
      })
      .catch(function (error) {
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          
          if (error.response.status == 401) {
            window.location.href = "/sign-in?expired=true";
          } else {
            setUpdateProjectError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
          }
        } else if (error.request) {
          // The request was made but no response was received
          
          setUpdateProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        } else {
          // Something happened in setting up the request that triggered an error
          
          setUpdateProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
        setTimeout(() => {
          setUpdateProjectError(null);
        }, 6000);
      })
      .finally(() => {
        handleCloseChangeProjectNameModal();
        setUpdateProjectLoading(false);
      });
  };

  const handleSaveChangeProjectDesc = () => {
    setUpdateProjectLoading(true);
    setUpdateProjectError(null);

    let updatedProjectRequest = {
      "projectName": null,
      "projectDescription": "",
      "assignedUsers": []
    };

    if (projectDesc == newProjectDesc) {
      setUpdateProjectLoading(false);
      handleCloseChangeProjectDescModal();
      return;
    } else {
      updatedProjectRequest.projectDescription = newProjectDesc;
    }

    axios.put(
      `http://13.212.104.51:8081/api/v1/project/${projectId}`, 
      updatedProjectRequest,
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      })
      .then((response) => {
          
          setProjectDesc(newProjectDesc);
      })
      .catch((error) => {
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          
          if (error.response.status == 401) {
            window.location.href = "/sign-in?expired=true";
          } else {
            setUpdateProjectError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
          }
        } else if (error.request) {
          // The request was made but no response was received
          
          setUpdateProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        } else {
          // Something happened in setting up the request that triggered an error
          
          setUpdateProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
        setTimeout(() => {
          setUpdateProjectError(null);
        }, 6000);
      })
      .finally(() => {
        handleCloseChangeProjectDescModal();
        setUpdateProjectLoading(false);
      });
  };

  useEffect(() => {
    if (searchParams.get("projectId")) {  
      setGetProjectLoading(true);
      axios.get(
        `http://13.212.104.51:8081/api/v1/project/${ projectId }`,
        {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "Bearer " + Cookies.get("jwt")
          }
        },
      )
      .then((response) => {
        
        setProjectData(response.data);
        setProjectName(response.data.projectName);
        setProjectDesc(response.data.projectDescription);
      })
      .catch((error) => {
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          
          if (error.response.status == 401) {
            window.location.href = "/sign-in?expired=true";
          } else {
            setGetProjectError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
          }
        } else if (error.request) {
          // The request was made but no response was received
          
          setGetProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        } else {
          // Something happened in setting up the request that triggered an error
          
          setGetProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
        setTimeout(() => {
          setGetProjectError(null);
        }, 6000);
      })
      .finally(() => setGetProjectLoading(false))
    } else {
      window.location.href='/dashboard';
    }
  }, [projectId, searchParams]); 

  return (
    <>
      { decodedToken ? <Header loggedIn={ true } username={ decodedToken.sub } /> : <Header loggedIn={ false } username={null} /> }
      <div className="tasks-container">
        <>
          <AlertBox errorMessage={ updateProjectError } />
          <AlertBox errorMessage={ getProjectError } />
        </>  
        <div className="tasks-top-container">
          <h3>
            {projectName}
            <a className='edit-project-name-icon' onClick={ handleShowEditProjectNameModal }>
              <CiEdit />
            </a>
            <Modal dialogClassName="modal-change-project-name" show={ showChangeProjectNameModal } onHide={ handleCloseChangeProjectNameModal }>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                <h5>Change Project Name</h5>
                            </Form.Label>
                            <Form.Control as="textarea" type="text" placeholder='New project name' value={ newProjectName } onChange={ handleProjectNewNameChange } />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ handleSaveChangeProjectName }>
                        Save {''}
                        {
                            updateProjectLoading ? (
                              <Spinner animation="grow" size="sm" />
                            ) : (
                              ''
                            )
                        }
                    </Button>
                    <Button variant="danger" onClick={ handleCloseChangeProjectNameModal }>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
          </h3>
          <p>
            {projectDesc}
            <a className='edit-project-desc-icon' onClick={ handleShowEditProjectDescModal }>
              <CiEdit />
            </a>
            <Modal dialogClassName="modal-change-project-desc" show={ showChangeProjectDescModal } onHide={ handleCloseChangeProjectDescModal }>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                <h5>Change Project Description</h5>
                            </Form.Label>
                            <Form.Control as="textarea" type="text" placeholder='New project description' value={ newProjectDesc } onChange={ handleProjectNewDescChange } />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ handleSaveChangeProjectDesc }>
                        Save {''}
                        {
                            updateProjectLoading ? (
                                <Spinner animation="grow" size="sm" />
                            ) : (
                                ''
                            )
                        }
                    </Button>
                    <Button variant="danger" onClick={ handleCloseChangeProjectDescModal }>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
          </p>
          <div className="projects-search-add-project">
            <InputGroup className="projects-input-group">
              <Form.Control
                placeholder="Search by Task Name ..."
                aria-label="Search by Task Name ..."
              />
              <Button variant="outline-secondary">
                <IoMdSearch />
              </Button>
            </InputGroup>
          </div>
        </div>
        <div className="tasks-bottom-container">
          <Row>
            <Col sm={12} md={12} xl={8} className="mb-4">
              {
                getProjectLoading ? 
                <span className="d-flex justify-content-center text-align-center">
                  <Spinner animation="grow" size="sm" />
                </span> 
                :
                (
                  <>
                    {
                      projectData ? <TaskList tasks={ projectData.tasks } projectId={ projectId } projectMembers={ projectData.assignedUsers } /> : null 
                    }
                  </>
                )
              }
            </Col>
            <Col sm={12} md={12} xl={4} className="project-members">
              {
                getProjectLoading ? 
                  <span className="d-flex justify-content-center text-align-center">
                    <Spinner animation="grow" size="sm" />
                  </span> 
                  :
                  (
                    <>
                      {
                        projectData ? <ProjectMembers projectMembers={ projectData.assignedUsers } projectId={ projectId } /> : null 
                      }
                    </>
                  )
              }
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Tasks
