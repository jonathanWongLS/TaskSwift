import { useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { LuClipboardList } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAdd } from "react-icons/gr";
import { BsDashLg } from "react-icons/bs";

import "./TaskList.css";

const TaskCard = ({ taskTitle }) => {
    const [selectedTaskStatus, setSelectedTaskStatus] = useState("TO DO");
    const [selectedTaskPriority, setSelectedTaskPriority] = useState("Low");

    const handleTaskStatusSelect = (eventKey) => {
        setSelectedTaskStatus(eventKey);
    };

    const handleTaskPrioritySelect = (eventKey) => {
        setSelectedTaskPriority(eventKey);
    };

    const getStatusDropdownColor = () => {
        switch (selectedTaskStatus) {
        case "TO DO":
            return {
            backgroundColor: "#E4E6EA",
            borderColor: "#E4E6EA",
            color: "#3D4D6A",
            fontWeight: 500,
            };
        case "IN PROGRESS":
            return {
            backgroundColor: "#E9F2FF",
            borderColor: "#E9F2FF",
            color: "#0077DB",
            fontWeight: 500,
            };
        case "DONE":
            return {
            backgroundColor: "#DCFFF1",
            borderColor: "#DCFFF1",
            color: "#57987D",
            fontWeight: 500,
            };
        default:
            return {};
        }
    };

    const getPriorityDropdownColor = () => {
        switch (selectedTaskPriority) {
        case "Low":
            return {
            backgroundColor: "#00FF00",
            borderColor: "#00FF00",
            color: "white",
            fontWeight: 500,
            };
        case "Medium":
            return {
            backgroundColor: "#FFD700",
            borderColor: "#FFD700",
            color: "white",
            fontWeight: 500,
            };
        case "High":
            return {
            backgroundColor: "#B30000",
            borderColor: "#B30000",
            color: "white",
            fontWeight: 500,
            };
        default:
            return {};
        }
    };

    return (
        <div className="taskcard-container">
            <div className="taskcard-left">
                <LuClipboardList size="2em" />
                <p>{taskTitle}</p>
            </div>
            <div className="taskcard-right">
                <Dropdown onSelect={handleTaskStatusSelect}>
                <Dropdown.Toggle style={getStatusDropdownColor()}>
                    {selectedTaskStatus}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <div className="todo-item-container">
                    <Dropdown.Item eventKey="TO DO" className="todo-item">
                        TO DO
                    </Dropdown.Item>
                    </div>
                    <div className="inprogress-item-container">
                    <Dropdown.Item eventKey="IN PROGRESS" className="inprogress-item">
                        IN PROGRESS
                    </Dropdown.Item>
                    </div>
                    <div className="done-item-container">
                    <Dropdown.Item eventKey="DONE" className="done-item">
                        DONE
                    </Dropdown.Item>
                    </div>
                </Dropdown.Menu>
                </Dropdown>
                <Dropdown onSelect={handleTaskPrioritySelect}>
                <Dropdown.Toggle
                    className="priority-dropdown-toggle"
                    style={getPriorityDropdownColor()}
                >
                    {selectedTaskPriority}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <div className="low-item-container">
                    <Dropdown.Item eventKey="Low" className="low-item">
                        Low
                    </Dropdown.Item>
                    </div>
                    <div className="medium-item-container">
                    <Dropdown.Item eventKey="Medium" className="medium-item">
                        Medium
                    </Dropdown.Item>
                    </div>
                    <div className="high-item-container">
                    <Dropdown.Item eventKey="High" className="high-item">
                        High
                    </Dropdown.Item>
                    </div>
                </Dropdown.Menu>
                </Dropdown>
                <FaUserCircle size="2em" className="task-assignees-icon" />
                <RiDeleteBin6Line size="2em" fill="red" className="task-delete-icon" />
            </div>
        </div>
    );
};

const TaskList = () => {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [selectedTaskPriorityAdd, setSelectedTaskPriorityAdd] = useState("Low");

    const handleCloseAddTaskModal = () => setShowAddTaskModal(false);
    const handleOpenAddTaskModal = () => setShowAddTaskModal(true);
    const handleTaskPrioritySelectAdd = (eventKey) => {
        setSelectedTaskPriorityAdd(eventKey);
    };

    const getPriorityDropdownColorAdd = () => {
        switch (selectedTaskPriorityAdd) {
            case "Low":
                return {
                    backgroundColor: "#00FF00",
                    borderColor: "#00FF00",
                    color: "white",
                    fontWeight: 500,
                };
            case "Medium":
                return {
                    backgroundColor: "#FFD700",
                    borderColor: "#FFD700",
                    color: "white",
                    fontWeight: 500,
                };
            case "High":
                return {
                    backgroundColor: "#B30000",
                    borderColor: "#B30000",
                    color: "white",
                    fontWeight: 500,
                };
            default:
                return {};
        }
    };

    return (
        <div className="tasklist-container">
            <div className="tasklist-cards">
                <TaskCard taskTitle="Task One" />
                <TaskCard taskTitle="Task Two" />
                <TaskCard taskTitle="Task Three" />
            </div>
            <>
                <Button className="add-task-btn" onClick={handleOpenAddTaskModal}>
                <GrAdd fontSize="1.1em" />
                <p>Add Task</p>
                </Button>

                <Modal dialogClassName="modal-add-task" show={showAddTaskModal} onHide={handleCloseAddTaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} xl={8}>
                            <Form>
                                <Form.Group className="mb-3 task-name-group">
                                    <Form.Label>
                                        <h5>Name</h5> 
                                    </Form.Label>
                                    <Form.Control type="text" />
                                    <Form.Text muted>Name of the task</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3 task-desc-group">
                                    <Form.Label>
                                        <h5>Description</h5>
                                    </Form.Label>
                                    <Form.Control as="textarea" rows={3} />
                                    <Form.Text muted>Description of the task</Form.Text>
                                </Form.Group>
                                <div className="task-timeframe-container">
                                    <Form.Group className="mb-3 task-timeframe-group">
                                        <Form.Label>
                                            <h5>Timeframe</h5>
                                        </Form.Label>
                                        <div className="task-timeframe-inputs-container">
                                            <InputGroup className="task-timeframe-start-group">
                                                <Form.Control placeholder="Starts at (mm/dd/yyyy)" />
                                                <Button variant="outline-secondary">
                                                    X
                                                </Button>
                                            </InputGroup>
                                            <BsDashLg />
                                            <InputGroup className="task-timeframe-end-group">
                                                <Form.Control placeholder="Ends at (mm/dd/yyyy)" />
                                                <Button variant="outline-secondary" id="button-addon2">
                                                X
                                                </Button>
                                            </InputGroup>
                                        </div>
                                    </Form.Group>
                                </div> 
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <h5>Priority</h5>
                                    </Form.Label>
                                    <Dropdown onSelect={handleTaskPrioritySelectAdd}>
                                        <Dropdown.Toggle variant="success" style={getPriorityDropdownColorAdd()}>
                                            { selectedTaskPriorityAdd }
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <div className="low-item-container">
                                                <Dropdown.Item eventKey="Low" className="low-item">
                                                    Low
                                                </Dropdown.Item>
                                            </div>
                                            <div className="medium-item-container">
                                                <Dropdown.Item eventKey="Medium" className="medium-item">
                                                    Medium
                                                </Dropdown.Item>
                                            </div>
                                            <div className="high-item-container">
                                                <Dropdown.Item eventKey="High" className="high-item">
                                                    High
                                                </Dropdown.Item>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Form.Text muted>How important this task is</Form.Text>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col sm={12} md={12} xl={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <h5>Assignees</h5>
                                    <Form.Check
                                        type="checkbox"
                                        label="User 1"    
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="User 1"    
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="User 1"    
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="User 1"    
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="User 1"    
                                    />
                                </Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseAddTaskModal}>
                    Save
                    </Button>
                    <Button variant="danger" onClick={handleCloseAddTaskModal}>
                    Cancel
                    </Button>
                </Modal.Footer>
                </Modal>
            </>
        </div>
    );
};

export default TaskList;
