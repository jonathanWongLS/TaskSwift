import { useEffect, useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import { LuClipboardList } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAdd } from "react-icons/gr";
import { BsDashLg } from "react-icons/bs";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc';

import PropTypes from "prop-types";
import axios from 'axios';
import Cookies from 'js-cookie';

import "./TaskList.css";
import AlertBox from "../AlertBox/AlertBox";

dayjs.extend(timezone);
dayjs.extend(utc);

const TaskCard = ({ taskId, taskDetails }) => {
    const [taskStatus, setTaskStatus] = useState('');
    const [taskPriority, setTaskPriority] = useState('');

    useEffect(() => {
        if (taskDetails.taskPriority == "LOW") { 
            setTaskPriority("Low")
        } else if (taskDetails.taskPriority == "MEDIUM") {
            setTaskPriority("Medium")
        } else if (taskDetails.taskPriority == "HIGH") {
            setTaskPriority("High");
        }

        if (taskDetails.taskStatus == "TO_DO") { 
            setTaskStatus("TO DO")
        } else if (taskDetails.taskStatus == "IN_PROGRESS") {
            setTaskStatus("IN PROGRESS")
        } else if (taskDetails.taskStatus == "DONE") {
            setTaskStatus("DONE");
        }
    }, [taskDetails.taskPriority, taskDetails.taskStatus]);

    const getStatusDropdownColor = () => {
        switch (taskDetails.taskStatus) {
            case "TO_DO" || "TO DO":
                return {
                    backgroundColor: "#E4E6EA",
                    borderColor: "#E4E6EA",
                    color: "#3D4D6A",
                    fontWeight: 500,
                };
            case "IN_PROGRESS" || "IN PROGRESS":
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
        switch (taskDetails.taskPriority) {
            case "LOW" || "Low":
                return {
                backgroundColor: "#00FF00",
                borderColor: "#00FF00",
                color: "white",
                fontWeight: 500,
                };
            case "MEDIUM" || "Medium" :
                return {
                backgroundColor: "#FFD700",
                borderColor: "#FFD700",
                color: "white",
                fontWeight: 500,
                };
            case "HIGH" || "High":
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
        <>
            <div id={ taskId } style={{ cursor:"pointer" }} className="taskcard-container">
                <div className="taskcard-left">
                    <LuClipboardList size="2em" />
                    <p>{ taskDetails.taskName }</p>
                </div>
                <div className="taskcard-right">
                    <Dropdown>
                        <Dropdown.Toggle 
                            style={getStatusDropdownColor()} 
                        >
                            { taskStatus }
                        </Dropdown.Toggle>
                        <Dropdown.Menu defaultValue="TO DO">
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
                    <Dropdown>
                        <Dropdown.Toggle
                            className="priority-dropdown-toggle"
                            style={getPriorityDropdownColor()}
                        >
                            { taskPriority }
                        </Dropdown.Toggle>
                        <Dropdown.Menu defaultValue="Low">
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
                    <span>
                        <b>{ taskDetails.assignedUsers.length }</b>
                        {' '}
                        <FaUserCircle size="2em" className="task-assignees-icon" />
                    </span>
                </div>
            </div>
        </>
    );
};

const TaskList = ({ tasks, projectId, projectMembers }) => {
    // States for Adding Task
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [addTaskLoading, setAddTaskLoading] = useState(false);
    const [addTaskError, setAddTaskError] = useState(null);
    const [taskDetailsAdd, setTaskDetailsAdd] = useState({
        taskName: '',
        taskDesc: '',
        selectedTaskPriority: "Low",
        selectedTaskStatus: "TO DO",
        taskTimelineStartDate: dayjs(new Date().toLocaleDateString("en-US", {timeZone: "Asia/Kuala_Lumpur"})).utc("2024-04-17T00:00:00.000+08:00"),
        taskTimelineEndDate: dayjs(new Date().toLocaleDateString("en-US", {timeZone: "Asia/Kuala_Lumpur"})).utc("2024-04-17T00:00:00.000+08:00"),
        checkedAssignees: []
    });
    
    // States for Editing Task
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [editTaskLoading, setEditTaskLoading] = useState(false);
    const [editTaskError, setEditTaskError] = useState(null);
    const [taskDetailsEdit, setTaskDetailsEdit] = useState({
        taskId: '',
        taskName: '',
        taskDesc: '',
        selectedTaskPriority: '',
        selectedTaskStatus: '',
        taskTimelineStartDate: dayjs(null),
        taskTimelineEndDate: dayjs(null),
        checkedAssignees: []
    });

    // States for Deleting Task
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
    const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);
    const [deleteTaskError, setDeleteTaskError] = useState(null);

    // Functions for Adding Task
    const handleCloseAddTaskModal = () => setShowAddTaskModal(false);
    const handleOpenAddTaskModal = () => setShowAddTaskModal(true);

    const handleTaskPrioritySelectAdd = (e) => {
        setTaskDetailsAdd({...taskDetailsAdd, selectedTaskPriority: e});
        
    };

    const handleTaskStatusSelectAdd = (e) => {
        setTaskDetailsAdd({...taskDetailsAdd, selectedTaskStatus: e});
        
    };

    const handleTaskNameChangeAdd = (e) => {
        setTaskDetailsAdd({...taskDetailsAdd, taskName: e.target.value});
        
    };

    const handleTaskDescChangeAdd = (e) => {
        setTaskDetailsAdd({...taskDetailsAdd, taskDesc: e.target.value});
        
    };

    const handleTaskTimelineStartDateSelectAdd = (e) => { 
        setTaskDetailsAdd({...taskDetailsAdd, taskTimelineStartDate: e});
        
    };

    const handleTaskTimelineEndDateSelectAdd = (e) => {
        setTaskDetailsAdd({...taskDetailsAdd, taskTimelineEndDate: e});
        
    };

    const handleCheckboxAssigneesChangeAdd = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setTaskDetailsAdd(prevTaskDetailsAdd => ({
                ...prevTaskDetailsAdd,
                checkedAssignees: [...prevTaskDetailsAdd.checkedAssignees, parseInt(value)]
            }));
        } else {
            setTaskDetailsAdd(prevTaskDetailsAdd => ({
                ...prevTaskDetailsAdd,
                checkedAssignees: prevTaskDetailsAdd.checkedAssignees.filter((item) => item !== parseInt(value))
            }));
        }
        
    };

    const handleAddTaskToProject = () => {
        let taskStatusAdd = null;

        if (taskDetailsAdd.selectedTaskStatus == "TO DO") {
            taskStatusAdd = "TO_DO";
        } else if (taskDetailsAdd.selectedTaskStatus == "IN PROGRESS") {
            taskStatusAdd = "IN_PROGRESS";
        } else {
            taskStatusAdd = "DONE"
        }

        let taskTimelineStartDate = null;
        let taskTimelineEndDate = null;
        
        if ((taskDetailsAdd.taskTimelineStartDate.$M).toString().length == 1 && (taskDetailsAdd.taskTimelineStartDate.$D).toString().length == 1) { 
            taskTimelineStartDate = `${taskDetailsAdd.taskTimelineStartDate.$y}-0${taskDetailsAdd.taskTimelineStartDate.$M + 1}-0${taskDetailsAdd.taskTimelineStartDate.$D}`;
        } else if ((taskDetailsAdd.taskTimelineStartDate.$M).toString().length == 1 && (taskDetailsAdd.taskTimelineStartDate.$D).toString().length == 2) {
            taskTimelineStartDate = `${taskDetailsAdd.taskTimelineStartDate.$y}-0${taskDetailsAdd.taskTimelineStartDate.$M + 1}-${taskDetailsAdd.taskTimelineStartDate.$D}`;
        } else if ((taskDetailsAdd.taskTimelineStartDate.$M).toString().length == 2 && (taskDetailsAdd.taskTimelineStartDate.$D).toString().length == 1) {
            taskTimelineStartDate = `${taskDetailsAdd.taskTimelineStartDate.$y}-${taskDetailsAdd.taskTimelineStartDate.$M + 1}-0${taskDetailsAdd.taskTimelineStartDate.$D}`;
        } else {
            taskTimelineStartDate = `${taskDetailsAdd.taskTimelineStartDate.$y}-${taskDetailsAdd.taskTimelineStartDate.$M + 1}-${taskDetailsAdd.taskTimelineStartDate.$D}`;
        }

        if ((taskDetailsAdd.taskTimelineEndDate.$M).toString().length == 1 && (taskDetailsAdd.taskTimelineEndDate.$D).toString().length == 1) { 
            taskTimelineEndDate = `${taskDetailsAdd.taskTimelineEndDate.$y}-0${taskDetailsAdd.taskTimelineEndDate.$M + 1}-0${taskDetailsAdd.taskTimelineEndDate.$D}`;
        } else if ((taskDetailsAdd.taskTimelineEndDate.$M).toString().length == 1 && (taskDetailsAdd.taskTimelineEndDate.$D).toString().length == 2) {
            taskTimelineEndDate = `${taskDetailsAdd.taskTimelineEndDate.$y}-0${taskDetailsAdd.taskTimelineEndDate.$M + 1}-${taskDetailsAdd.taskTimelineEndDate.$D}`;
        } else if ((taskDetailsAdd.taskTimelineEndDate.$M).toString().length == 2 && (taskDetailsAdd.taskTimelineEndDate.$D).toString().length == 1) {
            taskTimelineEndDate = `${taskDetailsAdd.taskTimelineEndDate.$y}-${taskDetailsAdd.taskTimelineEndDate.$M + 1}-0${taskDetailsAdd.taskTimelineEndDate.$D}`;
        } else {
            taskTimelineEndDate = `${taskDetailsAdd.taskTimelineEndDate.$y}-${taskDetailsAdd.taskTimelineEndDate.$M + 1}-${taskDetailsAdd.taskTimelineEndDate.$D}`;
        }

        axios.post(
            `https://13.212.104.51:8081/api/v1/add-task/${projectId}`, 
            {
                taskToAdd: {
                    taskName: taskDetailsAdd.taskName,
                    taskDescription: taskDetailsAdd.taskDesc,
                    taskTimelineStartDateTime: taskTimelineStartDate,
                    taskTimelineEndDateTime: taskTimelineEndDate,
                    taskStatus: taskStatusAdd,
                    taskPriority: taskDetailsAdd.selectedTaskPriority.toUpperCase(),
                },
                assignedUsersIdList: taskDetailsAdd.checkedAssignees,
            },
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            }
        ).then((response) => {
            
            location.reload();
        })
        .catch((error) => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                
                if (error.response.status == 401) {
                    window.location.href = "/sign-in?expired=true";
                } else {
                    setAddTaskError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                
                setAddTaskError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            } else {
                // Something happened in setting up the request that triggered an error
                
                setAddTaskError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
            setTimeout(() => {
                setAddTaskError(null);
            }, 6000);
        })
        .finally(() => { 
            setShowAddTaskModal(false)
            setAddTaskLoading(false);
        })
    }

    const getPriorityDropdownColorAdd = () => {
        switch (taskDetailsAdd.selectedTaskPriority) {
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

    const getStatusDropdownColorAdd = () => {
        switch (taskDetailsAdd.selectedTaskStatus) {
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

    // Functions for Editing Task
    const handleCloseEditTaskModal = () => { 
        setShowEditTaskModal(false);
        setTaskDetailsEdit({...taskDetailsEdit,
            taskName: '',
            taskDesc: '',
            selectedTaskPriority: '',
            selectedTaskStatus: '',
            taskTimelineStartDate: dayjs(null),
            taskTimelineEndDate: dayjs(null),
            checkedAssignees: [],
        });
    }
    const handleOpenEditTaskModal = (taskId) => { 
        const task = tasks.find(task => task.taskId == taskId);
        let updatedTaskDetails = { ...taskDetailsEdit };

        if (task.taskPriority == "LOW") { 
            updatedTaskDetails.selectedTaskPriority = "Low";
        } else if (task.taskPriority == "MEDIUM") {
            updatedTaskDetails.selectedTaskPriority = "Medium";
        } else if (task.taskPriority == "HIGH") {
            updatedTaskDetails.selectedTaskPriority = "High";
        }

        if (task.taskStatus == "TO_DO" || task.taskStatus == "TO DO") { 
            updatedTaskDetails.selectedTaskStatus = "TO DO";
        } else if (task.taskStatus == "IN_PROGRESS" || task.taskStatus == "IN PROGRESS") {
            updatedTaskDetails.selectedTaskStatus = "IN PROGRESS";
        } else if (task.taskStatus == "DONE") {
            updatedTaskDetails.selectedTaskStatus = "Done";
        }

        updatedTaskDetails = {
            ...updatedTaskDetails,
            taskId: task.taskId,
            taskName: task.taskName,
            taskDesc: task.taskDescription,
            taskTimelineStartDate: dayjs(task.taskTimelineStartDateTime),
            taskTimelineEndDate: dayjs(task.taskTimelineEndDateTime),
            checkedAssignees: task.assignedUsers.map(user => user.id),
        };

        setTaskDetailsEdit(updatedTaskDetails);
        
        setShowEditTaskModal(true);   
    };

    const handleTaskPrioritySelectEdit = (e) => {
        setTaskDetailsEdit({...taskDetailsEdit, selectedTaskPriority: e});
        
    };

    const handleTaskStatusSelectEdit = (e) => {
        setTaskDetailsEdit({...taskDetailsEdit, selectedTaskStatus: e});
        
    };

    const handleTaskNameChangeEdit = (e) => {
        setTaskDetailsEdit({...taskDetailsEdit, taskName: e.target.value});
        
    };

    const handleTaskDescChangeEdit = (e) => {
        setTaskDetailsEdit({...taskDetailsEdit, taskDesc: e.target.value});
        
    };

    const handleTaskTimelineStartDateSelectEdit = (e) => {
        setTaskDetailsEdit({...taskDetailsEdit, taskTimelineStartDate: e});
        
    };

    const handleTaskTimelineEndDateSelectEdit = (e) => {
        setTaskDetailsEdit({...taskDetailsEdit, taskTimelineEndDate: e });
        
    };

    const handleCheckboxAssigneesChangeEdit = (e) => {
        const { value, checked } = e.target;
        
        if (checked) {
            setTaskDetailsEdit(prevTaskDetailsEdit => ({
                ...prevTaskDetailsEdit,
                checkedAssignees: [...prevTaskDetailsEdit.checkedAssignees, parseInt(value)]
            }))
        } else {
            
            setTaskDetailsEdit(prevTaskDetailsEdit => ({
                ...prevTaskDetailsEdit,
                checkedAssignees: prevTaskDetailsEdit.checkedAssignees.filter((item) => item !== parseInt(value))
            }))
        }
    };

    const getPriorityDropdownColorEdit = (priority) => {
        switch (priority.toUpperCase()) {
            case "LOW" || "Low":
                return {
                    backgroundColor: "#00FF00",
                    borderColor: "#00FF00",
                    color: "white",
                    fontWeight: 500,
                };
            case "MEDIUM" || "Medium":
                return {
                    backgroundColor: "#FFD700",
                    borderColor: "#FFD700",
                    color: "white",
                    fontWeight: 500,
                };
            case "HIGH" || "High":
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

    const getStatusDropdownColorEdit = (status) => {
        switch (status) {
            case "TO DO" || "TO_DO":
                return {
                    backgroundColor: "#E4E6EA",
                    borderColor: "#E4E6EA",
                    color: "#3D4D6A",
                    fontWeight: 500,
                };
            case "IN PROGRESS" || "IN_PROGRESS":
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
        }
    };

    const handleUpdateTaskSave = () => {
        setEditTaskLoading(true);

        let taskStatusAdd = null;
        if (taskDetailsEdit.selectedTaskStatus == "TO DO") {
            taskStatusAdd = "TO_DO";
        } else if (taskDetailsEdit.selectedTaskStatus == "IN PROGRESS") {
            taskStatusAdd = "IN_PROGRESS";
        } else if (taskDetailsEdit.selectedTaskStatus == "DONE") {
            taskStatusAdd = "DONE"
        }

        let taskTimelineStartDate = null;
        let taskTimelineEndDate = null;
        
        if ((taskDetailsEdit.taskTimelineStartDate.$M).toString().length == 1 ) { 
            taskTimelineStartDate = `${taskDetailsEdit.taskTimelineStartDate.$y}-0${taskDetailsEdit.taskTimelineStartDate.$M + 1}-${taskDetailsEdit.taskTimelineStartDate.$D}`;
        } else {
            taskTimelineStartDate = `${taskDetailsEdit.taskTimelineStartDate.$y}-${taskDetailsEdit.taskTimelineStartDate.$M + 1}-${taskDetailsEdit.taskTimelineStartDate.$D}`;
        }

        if ((taskDetailsEdit.taskTimelineEndDate.$M).toString().length == 1 ) { 
            taskTimelineEndDate = `${taskDetailsEdit.taskTimelineEndDate.$y}-0${taskDetailsEdit.taskTimelineEndDate.$M + 1}-${taskDetailsEdit.taskTimelineEndDate.$D}`;
        } else {
            taskTimelineEndDate = `${taskDetailsEdit.taskTimelineEndDate.$y}-${taskDetailsEdit.taskTimelineEndDate.$M + 1}-${taskDetailsEdit.taskTimelineEndDate.$D}`;
        }

        axios.put(
            `https://13.212.104.51:8081/api/v1/project/${projectId}/task/${taskDetailsEdit.taskId}`, 
            {
                taskToAdd: {
                    taskName: taskDetailsEdit.taskName,
                    taskDescription: taskDetailsEdit.taskDesc,
                    taskTimelineStartDateTime: taskTimelineStartDate,
                    taskTimelineEndDateTime: taskTimelineEndDate,
                    taskStatus: taskStatusAdd,
                    taskPriority: taskDetailsEdit.selectedTaskPriority.toUpperCase(),
                },
                assignedUsersIdList: taskDetailsEdit.checkedAssignees,
            },
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            }
        ).then((response) => {
            
            location.reload();
        })
        .catch((error) => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                
                if (error.response.status == 401) {
                    window.location.href = "/sign-in?expired=true";
                } else {
                    setEditTaskError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                
                setEditTaskError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            } else {
                // Something happened in setting up the request that triggered an error
                
                setEditTaskError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
            setTimeout(() => {
                setEditTaskError(null);
            }, 6000);
            setShowEditTaskModal(false);
        })
        .finally(() => {
            handleCloseEditTaskModal();
            setEditTaskLoading(false);
        })
    };

    // Functions for Deleting Task
    const handleOpenDeleteTaskModal = () => {
        setShowEditTaskModal(false);
        setShowDeleteTaskModal(true); 
    }
    const handleCloseDeleteTaskModal = () => setShowDeleteTaskModal(false);

    const handleDeleteTask = () => {
        setDeleteTaskLoading(true);
        axios.delete(
            `https://13.212.104.51:8081/api/v1/project/${projectId}/task/${taskDetailsEdit.taskId}`,
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            }
        ).then((response) => {
            
            setShowDeleteTaskModal(false);
            location.reload();
        })
        .catch((error) => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                
                if (error.response.status == 401) {
                    window.location.href = "/sign-in?expired=true";
                } else {
                    setDeleteTaskError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                
                setDeleteTaskError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            } else {
                // Something happened in setting up the request that triggered an error
                
                setDeleteTaskError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
            setTimeout(() => {
                setDeleteTaskError(null);
            }, 6000);
            
        })
        .finally(() => {
            handleCloseDeleteTaskModal();
            setDeleteTaskLoading(false);
        })
    };
    
    return (
        <div className="tasklist-container">
            <AlertBox errorMessage={ addTaskError } />
            <AlertBox errorMessage={ editTaskError } />
            <AlertBox errorMessage={ deleteTaskError } />
            
            <div className="tasklist-cards">
                { tasks.length == 0 ? (
                    <div className="d-flex flex-column align-items-center">
                        <br/>
                        <h5>No tasks yet...</h5>
                        <br/>
                    </div>
                    ) : (
                        tasks
                        .sort((a, b) => a.taskId > b.taskId ? 1 : -1)
                        .map((task, taskKey) => {
                            return ( 
                                <a key={ taskKey } onClick={() => { handleOpenEditTaskModal(task.taskId) }}>
                                    <TaskCard 
                                        key={ taskKey } 
                                        projectId={ projectId }
                                        taskId={ task.taskId }
                                        taskDetails={ task }
                                        projectMembers={ projectMembers }
                                    />
                                </a>
                            )
                        })
                    )}
            </div>
            {/* Modal for Adding Task */}
            <>
                <Button className="add-task-btn" onClick={handleOpenAddTaskModal}>
                    <GrAdd fontSize="1.1em" />
                    <p>Add Task</p>
                </Button>
                <Modal dialogClassName="modal-add-task" show={ showAddTaskModal } onHide={ handleCloseAddTaskModal }>
                    <Modal.Header>
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
                                        <Form.Control type="text" value={ taskDetailsAdd.taskName } onChange={ handleTaskNameChangeAdd }/>
                                        <Form.Text muted>Name of the task</Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3 task-desc-group">
                                        <Form.Label>
                                            <h5>Description</h5>
                                        </Form.Label>
                                        <Form.Control as="textarea" rows={3} value={ taskDetailsAdd.taskDesc } onChange={ handleTaskDescChangeAdd } />
                                        <Form.Text muted>Description of the task</Form.Text>
                                    </Form.Group>
                                    <div className="task-timeframe-container">
                                        <Form.Group className="mb-3 task-timeframe-group">
                                            <Form.Label>
                                                <h5>Timeframe</h5>
                                            </Form.Label>
                                            <div className="task-timeframe-inputs-container">
                                                <InputGroup className="task-timeframe-start-group">
                                                    <DatePicker label="Start Date" value={ taskDetailsAdd.taskTimelineStartDate } onChange={ handleTaskTimelineStartDateSelectAdd }/>
                                                </InputGroup>
                                                <BsDashLg />
                                                <InputGroup className="task-timeframe-end-group">
                                                    <DatePicker label="End Date" value={ taskDetailsAdd.taskTimelineEndDate } onChange={ handleTaskTimelineEndDateSelectAdd }/>
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
                                                { taskDetailsAdd.selectedTaskPriority }
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
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <h5>Status</h5>
                                        </Form.Label>
                                        <Dropdown onSelect={handleTaskStatusSelectAdd}>
                                            <Dropdown.Toggle variant="success" style={getStatusDropdownColorAdd()}>
                                                { taskDetailsAdd.selectedTaskStatus }
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
                                        <Form.Text muted>Progress of this task</Form.Text>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={12} md={12} xl={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <h5>Assignees</h5>
                                        {
                                            projectMembers.map((projectMember, index) => {
                                                return (
                                                    <Form.Check
                                                        key={ index }
                                                        type="checkbox"
                                                        label={ projectMember.username }    
                                                        value={ projectMember.id }
                                                        checked={ taskDetailsAdd.checkedAssignees.includes(parseInt(projectMember.id)) }
                                                        onChange={ handleCheckboxAssigneesChangeAdd }
                                                    />
                                                )
                                            })
                                        }
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={ handleAddTaskToProject }>
                            Save
                            {
                                addTaskLoading ? 
                                <span className="d-flex justify-content-center text-align-center">
                                  <Spinner animation="grow" size="sm" />
                                </span>
                                :
                                null 
                            }
                        </Button>
                        <Button variant="danger" onClick={ handleCloseAddTaskModal }>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            {/* Modal for Editing Task */}
            <>
                <Modal dialogClassName="modal-edit-task" show={ showEditTaskModal } onHide={ handleCloseEditTaskModal }>
                    <Modal.Header>
                        <Modal.Title>Edit Task &quot;{ taskDetailsEdit.taskName }&quot;</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} md={12} xl={8}>
                                <Form>
                                    <Form.Group className="mb-3 task-name-group">
                                        <Form.Label>
                                            <h5>Name</h5> 
                                        </Form.Label>
                                        <Form.Control type="text" value={ taskDetailsEdit.taskName } onChange={ handleTaskNameChangeEdit }/>
                                        <Form.Text muted>Name of the task</Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3 task-desc-group">
                                        <Form.Label>
                                            <h5>Description</h5>
                                        </Form.Label>
                                        <Form.Control as="textarea" rows={3} value={ taskDetailsEdit.taskDesc } onChange={ handleTaskDescChangeEdit } />
                                        <Form.Text muted>Description of the task</Form.Text>
                                    </Form.Group>
                                    <div className="task-timeframe-container">
                                        <Form.Group className="mb-3 task-timeframe-group">
                                            <Form.Label>
                                                <h5>Timeframe</h5>
                                            </Form.Label>
                                            <div className="task-timeframe-inputs-container">
                                                <InputGroup className="task-timeframe-start-group">
                                                    <DatePicker label="Start Date" value={ dayjs(dayjs(taskDetailsEdit.taskTimelineStartDate).toDate()) } onChange={ handleTaskTimelineStartDateSelectEdit }/>
                                                </InputGroup>
                                                <BsDashLg />
                                                <InputGroup className="task-timeframe-end-group">
                                                    <DatePicker label="End Date" value={ dayjs(dayjs(taskDetailsEdit.taskTimelineEndDate).toDate()) } onChange={ handleTaskTimelineEndDateSelectEdit }/>
                                                </InputGroup>
                                            </div>
                                        </Form.Group>
                                    </div> 
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <h5>Priority</h5>
                                        </Form.Label>
                                        <Dropdown onSelect={ handleTaskPrioritySelectEdit }>
                                            <Dropdown.Toggle variant="success" style={ getPriorityDropdownColorEdit(taskDetailsEdit.selectedTaskPriority) }>
                                                { taskDetailsEdit.selectedTaskPriority }
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
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <h5>Status</h5>
                                        </Form.Label>
                                        <Dropdown onSelect={handleTaskStatusSelectEdit}>
                                            <Dropdown.Toggle variant="success" style={ getStatusDropdownColorEdit(taskDetailsEdit.selectedTaskStatus) }>
                                                { taskDetailsEdit.selectedTaskStatus }
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
                                        <Form.Text muted>Progress of this task</Form.Text>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={12} md={12} xl={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <h5>Assignees</h5>
                                        {
                                            projectMembers.map((projectMember, index) => {
                                                return (
                                                    <Form.Check
                                                        key={ index }
                                                        type="checkbox"
                                                        label={ projectMember.username }    
                                                        value={ projectMember.id }
                                                        checked={ taskDetailsEdit.checkedAssignees.map((taskAssignee) => taskAssignee).includes(parseInt(projectMember.id)) }
                                                        onChange={ handleCheckboxAssigneesChangeEdit }
                                                    />
                                                )
                                            })
                                        }
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='light' onClick={ handleOpenDeleteTaskModal }>
                            <RiDeleteBin6Line size="1.5em" fill="red" className="task-delete-icon" />
                        </Button>
                        <Button variant="primary" onClick={ handleUpdateTaskSave }>
                            Save
                            {
                                editTaskLoading ? 
                                <span className="d-flex justify-content-center text-align-center">
                                  <Spinner animation="grow" size="sm" />
                                </span> 
                                :
                                null
                            }
                        </Button>
                        <Button variant="danger" onClick={ handleCloseEditTaskModal }>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            {/* Modal for Deleting Task */}
            <Modal dialogClassName="modal-delete-task" show={ showDeleteTaskModal } onHide={ handleCloseDeleteTaskModal }>
                <Modal.Header>
                    <Modal.Title>Edit Task &quot;{ taskDetailsEdit.taskName }&quot;</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the task?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ handleDeleteTask }>
                        I&apos;m sure!
                        {
                            deleteTaskLoading ? 
                            <span className="d-flex justify-content-center text-align-center">
                              <Spinner animation="grow" size="sm" />
                            </span>
                            : 
                            null 
                        }
                    </Button>
                    <Button variant="danger" onClick={ handleCloseDeleteTaskModal }>
                        Cancel
                    </Button>
                </Modal.Footer>
            </ Modal>
        </div>
    );
};

TaskCard.propTypes = {
    taskId: PropTypes.number.isRequired,
    taskDetails: PropTypes.object.isRequired,
};

TaskList.propTypes = {
    tasks: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    projectMembers: PropTypes.array.isRequired,
};

export default TaskList;
