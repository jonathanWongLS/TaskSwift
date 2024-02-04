import { useState } from "react";
import Header from "../../components/Header/Header";
import PropTypes from "prop-types";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

import { IoMdSearch } from "react-icons/io";
import { GrAdd } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { BsDashLg } from "react-icons/bs";

import "./Projects.css";

const ProjectCard = ({ title, noOfAssignees, projectDeadline, link }) => {

    const projectCardOnClick = () => {
        window.location.href = link;
        console.log("Clicked!");
    }

    return (
        <Card className="project-card" onClick={ projectCardOnClick } style={{ cursor: "pointer" }}>
            <Card.Title>{ title }</Card.Title>
            <Card.Body className="project-card-body">
                <div className="project-card-img">
                    <img src="./project-placeholder-image.jpg" alt="Project placeholder image" width="100%" height={200} />
                </div>
                <div className="project-card-info">
                    <div className="assignee-count">
                        <FaRegUser className="assignee-count-icon" fill="#DDEC68" size={30} />
                        <p className="assignee-count-value">{` ${noOfAssignees}`}</p>
                    </div>
                    <div className="project-deadline">
                        <HiOutlineClipboardCheck className="project-deadline-icon" stroke="#DDEC68" size={40}/>
                        <p className="project-deadline-value">{ projectDeadline }</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

const Projects = () => {
    const [username, setUsername] = useState("Username");
    const [projectCards, setProjectCards] = useState(
        [
            {
                title: "Project #1",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-1",
            },
            {
                title: "Project #2",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-2",
            },
            {
                title: "Project #3",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-3",
            },
            {
                title: "Project #4",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-4",
            },
            {
                title: "Project #1",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-4",
            },
            {
                title: "Project #1",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-5",
            },
            {
                title: "Project #1",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-5",
            },
            {
                title: "Project #6",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-6",
            },
            {
                title: "Project #7",
                noOfAssignees: 2,
                projectDeadline: "10 Dec 2023",
                projectId: "project-7",
            },
        ]
    )
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    
    const handleCloseAddProjectModal = () => {
        setShowAddProjectModal(false);
    }

    const handleOpenAddProjectModal = () => {
        setShowAddProjectModal(true);
    }

    return (
        <>
            <Header />
            <div className="projects-container">
                <div className="projects-top-container">
                    <h3>Hi, { username }!</h3>
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
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group className="mb-3 project-desc-group">
                                                <Form.Label>
                                                    <h5>Project Description</h5>
                                                </Form.Label>
                                                <Form.Control as="textarea" rows={3} />
                                            </Form.Group>
                                            <div className="project-timeframe-container">
                                                <Form.Group className="mb-3 project-timeframe-group">
                                                    <Form.Label>
                                                        <h5>Project Timeframe</h5>
                                                    </Form.Label>
                                                    <div className="project-timeframe-inputs-container">
                                                        <InputGroup className="task-timeframe-start-group">
                                                            <Form.Control placeholder="Starts at (mm/dd/yyyy)" />
                                                            <Button variant="outline-secondary">
                                                                X
                                                            </Button>
                                                        </InputGroup>
                                                        <BsDashLg />
                                                        <InputGroup className="project-timeframe-end-group">
                                                            <Form.Control placeholder="Ends at (mm/dd/yyyy)" />
                                                            <Button variant="outline-secondary" id="button-addon2">
                                                            X
                                                            </Button>
                                                        </InputGroup>
                                                    </div>
                                                </Form.Group>
                                            </div> 
                                        </Form>
                                    </Col>
                                    <Col sm={12} md={12} xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <h5>Add Project Members</h5>
                                            </Form.Label>
                                            <Form.Control type="text" placeholder="user@email.com, user2@email.com, ..." />
                                            <Form.Text muted>Enter multiple comma-separated email addresses</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={ handleCloseAddProjectModal }>
                                Save
                                </Button>
                                <Button variant="danger" onClick={ handleCloseAddProjectModal }>
                                Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="projects-bottom-container">
                    {projectCards.map((projectCardDetails, key) => {
                        return (
                            <ProjectCard
                                key={key} 
                                title={projectCardDetails.title} 
                                noOfAssignees={projectCardDetails.noOfAssignees} 
                                projectDeadline={projectCardDetails.projectDeadline} 
                                link={`/projects/${projectCardDetails.projectId}`}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}



ProjectCard.propTypes = {
    title: PropTypes.string.isRequired,
    noOfAssignees: PropTypes.number.isRequired,
    projectDeadline: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
}

export default Projects