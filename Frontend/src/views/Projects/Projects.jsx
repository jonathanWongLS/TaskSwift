import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import AlertBox from "../../components/AlertBox/AlertBox";
import PropTypes from "prop-types";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from 'react-bootstrap/Spinner';

import { IoMdSearch } from "react-icons/io";
import { GrAdd } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";

import "./Projects.css";

import axios from "axios";
import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

const ProjectCard = ({ projectId, title, noOfAssignees, link }) => {

    const projectCardOnClick = () => {
        window.location.href = link;
        
    }

    return (
        <Card id={ projectId } className="project-card" onClick={ projectCardOnClick } style={{ cursor: "pointer" }}>
            <Card.Title className="project-card-title">{ title }</Card.Title>
            <Card.Body className="project-card-body">
                <div className="project-card-img">
                    <img src="./project-placeholder-image.jpg" alt="Project placeholder image" width="100%" height={200} />
                </div>
                <div className="project-card-info">
                    <div className="assignee-count">
                        <FaRegUser className="assignee-count-icon" fill="#DDEC68" size={30} />
                        <p className="assignee-count-value">{` ${noOfAssignees} member(s)`}</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

const Projects = () => {
    const { decodedToken, isExpired } = useJwt(Cookies.get("jwt"));
    
    const [projectCards, setProjectCards] = useState([])
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [addProjectRequest, setAddProjectRequest] = useState({
        projectName: null,
        projectDesc: null,
        projectAssigneesEmail: null
    });
    const [getProjectsLoading, setGetProjectsLoading] = useState(null);
    const [addProjectLoading, setAddProjectLoading] = useState(false);
    const [getProjectsError, setGetProjectsError] = useState(null);
    const [addProjectError, setAddProjectError] = useState(null);
    
    const handleOpenAddProjectModal = () => {
        setShowAddProjectModal(true);
    }

    const handleCloseAddProjectModal = () => {
        setShowAddProjectModal(false);
    }
    
    const handleSaveAddProjectModal = () => {
        setAddProjectLoading(true);
        let projectAssigneesEmailArr;
        let addProjectRequestJson;

        if (addProjectRequest.projectAssigneesEmail) {
            let projectAssigneesEmailStr = addProjectRequest.projectAssigneesEmail.trim();
            projectAssigneesEmailArr = projectAssigneesEmailStr.split(",");
            for (let i = 0; i < projectAssigneesEmailArr.length; i++) {
                projectAssigneesEmailArr[i] = projectAssigneesEmailArr[i].trim();
            }
            addProjectRequestJson = {
                "project": {
                    "projectName": addProjectRequest.projectName,
                    "projectDescription": addProjectRequest.projectDesc,
                },
                "assignedUserEmail": projectAssigneesEmailArr,
            };
        } else {
            addProjectRequestJson = {
                "project": {
                    "projectName": addProjectRequest.projectName,
                    "projectDescription": addProjectRequest.projectDesc,
                },
                "assignedUserEmail": [],
            }
        }

        axios.post(
            "https://54.169.240.7:8081/api/v1/project", 
            addProjectRequestJson,
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            })
            .then((response) => {
                
                location.reload();
            })
            .catch((error) => {
                if (error.response) {
                    // The server responded with a status code outside the 2xx range
                    
                    if (error.response.status == 401) {
                        window.location.href = "/sign-in?expired=true";
                    } else {
                        setAddProjectError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    
                    setAddProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                } else {
                    // Something happened in setting up the request that triggered an error
                    
                    setAddProjectError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
                setTimeout(() => {
                    setAddProjectError(null);
                }, 6000);
            })
            .finally(() => {
                setShowAddProjectModal(false);
                setAddProjectLoading(false);
            });
    };

    const handleCancelAddProjectModal = () => {
        setShowAddProjectModal(false);
    };

    const handleProjectUsernameChange = (e) => {
        e.preventDefault();
        setAddProjectRequest({ ...addProjectRequest, projectName: e.target.value });
        
    };

    const handleProjectDescChange = (e) => {
        e.preventDefault();
        setAddProjectRequest({ ...addProjectRequest, projectDesc: e.target.value });
        
    };

    const handleProjectAssigneeEmail = (e) => {
        e.preventDefault();
        setAddProjectRequest({ ...addProjectRequest, projectAssigneesEmail: e.target.value})
        
    };

    useEffect(() => {
        setGetProjectsLoading(true);

        axios.get(
            "https://54.169.240.7:8081/api/v1/projects", 
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            }
        ).then((response) => {
            setProjectCards(response.data);
            
        }).catch((error) => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                
                if (error.response.status == 401) {
                    window.location.href = "/sign-in?expired=true";
                } else {
                    setGetProjectsError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                
                setGetProjectsError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            } else {
                // Something happened in setting up the request that triggered an error
                
                setGetProjectsError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
            setTimeout(() => {
                setGetProjectsError(null);
            }, 6000);
        })
        .finally(() => setGetProjectsLoading(false));
    }, [])


    return (
        <>
            { decodedToken ? <Header loggedIn={ true } username={ decodedToken.sub } /> : <Header loggedIn={ false } username={null} /> }
            <div className="projects-container">
                
                <AlertBox errorMessage={ getProjectsError } />
                <AlertBox errorMessage={ addProjectError } />
                
                <div className="projects-top-container">
                    <h3>Hi, { decodedToken ? decodedToken.sub : "-" }!</h3>
                    <div className="projects-search-add-project">                    
                        <InputGroup className="projects-input-group">
                            <Form.Control 
                                placeholder="Search projects ..."
                                aria-label="Search projects ..."
                            />
                            <Button variant="outline-secondary">
                                <IoMdSearch />
                            </Button>
                        </InputGroup>
                        <Button className="add-project-btn" onClick={ handleOpenAddProjectModal }><GrAdd />{' '}Add Project</Button>
                        <Modal dialogClassName="modal-add-project" show={ showAddProjectModal } onHide={ handleCloseAddProjectModal }>
                            <Modal.Header>
                                <Modal.Title>Add New Project</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col sm={12} md={12} xl={8}>
                                        <Form>
                                            <Form.Group className="mb-3 project-name-group">
                                                <Form.Label>
                                                    <h5>Project Name</h5> 
                                                </Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={ addProjectRequest.projectName } 
                                                    onChange={ handleProjectUsernameChange }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 project-desc-group">
                                                <Form.Label>
                                                    <h5>Project Description</h5>
                                                </Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={3}
                                                    value={ addProjectRequest.projectDesc }
                                                    onChange={ handleProjectDescChange }
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col sm={12} md={12} xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <h5>Add Project Members</h5>
                                            </Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="user@email.com, user2@email.com, ..." 
                                                value={ addProjectRequest.projectAssigneesEmail }
                                                onChange={ handleProjectAssigneeEmail }
                                            />
                                            <Form.Text muted>Enter multiple comma-separated email addresses</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={ handleSaveAddProjectModal }>
                                    Save {''}
                                    {
                                        addProjectLoading ? (
                                            <Spinner animation="grow" size="sm" />
                                        ) : (
                                            ''
                                        )
                                    }
                                </Button>
                                <Button variant="danger" onClick={ handleCancelAddProjectModal }>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="projects-bottom-container">
                    {
                        getProjectsLoading ? (
                            <p>Loading projects...</p>
                        ) :  
                        (
                            projectCards.length <= 0 ? (
                                <p>No projects yet.</p>
                            ) : (
                                projectCards
                                .sort((a, b) => a.projectId > b.projectId ? 1 : -1)
                                .map((projectCardDetails, key) => {
                                    return (
                                        <ProjectCard
                                            key={key} 
                                            projectId={projectCardDetails.projectId}
                                            title={projectCardDetails.projectName} 
                                            noOfAssignees={projectCardDetails.assignedUsers.length} 
                                            link={`/tasks?projectId=${projectCardDetails.projectId}`}
                                        />
                                    );
                                })
                            )
                        )
                    }
                </div>
            </div>
        </>
    );
}

ProjectCard.propTypes = {
    projectId: PropTypes.number,
    title: PropTypes.string,
    noOfAssignees: PropTypes.number,
    link: PropTypes.string,
}

export default Projects