import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { IoMdSearch } from "react-icons/io";

import PropTypes from "prop-types";

import Header from "../../components/Header/Header";
import TaskList from "../../components/TaskList/TaskList";
import ProjectMembers from "../../components/ProjectMembers/ProjectMembers";

import "./Tasks.css";

const Tasks = ({ projectTitle }) => {
  return (
    <>
        <Header />
        <div className="tasks-container">
            <div className="tasks-top-container">
                <h3>{ projectTitle }</h3>
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
                        <TaskList />
                    </Col>
                    <Col sm={12} md={12} xl={4} className="project-members">
                        <ProjectMembers />
                    </Col>
                </Row>
            </div>
        </div>
    </>
  )
}

Tasks.propTypes = {
    projectTitle:  PropTypes.string.isRequired,
}

export default Tasks