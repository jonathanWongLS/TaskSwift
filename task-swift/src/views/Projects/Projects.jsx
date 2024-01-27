import { useState } from "react";
import Header from "../../components/Header/Header";
import PropTypes from "prop-types";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import { IoMdSearch } from "react-icons/io";
import { GrAdd } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineClipboardCheck } from "react-icons/hi";

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

ProjectCard.propTypes = {
    title: PropTypes.string.isRequired,
    noOfAssignees: PropTypes.number.isRequired,
    projectDeadline: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
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
                        <Button className="add-project-btn"><GrAdd />{' '}Add Project</Button>
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

export default Projects