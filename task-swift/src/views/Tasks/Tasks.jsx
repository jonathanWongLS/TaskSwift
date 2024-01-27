import Header from "../../components/Header/Header";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoMdSearch } from "react-icons/io";
import PropTypes from "prop-types";

import TaskList from "../../components/TaskList/TaskList";

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
                    <Col sm={12} md={9} xl={9}>
                        <TaskList />
                    </Col>
                    <Col sm={12} md={3} xl={3}>

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