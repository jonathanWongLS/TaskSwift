import { useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import { LuClipboardList } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import "./TaskList.css";

const TaskCard = ({ taskTitle }) => {
    const [selectedTaskStatus, setSelectedTaskStatus] = useState("TO DO");
    const [selectedTaskPriority, setSelectedTaskPriority] = useState("Low");
    
    const handleTaskStatusSelect = (eventKey) => {
        setSelectedTaskStatus(eventKey);
    }

    const handleTaskPrioritySelect = (eventKey) => {
        setSelectedTaskPriority(eventKey);
    }

    const getStatusDropdownColor = () => {
        switch (selectedTaskStatus) {
            case "TO DO":
                return {backgroundColor: "#E4E6EA", borderColor: "#E4E6EA", color: "#3D4D6A", fontWeight: 500};
            case "IN PROGRESS":
                return {backgroundColor: "#E9F2FF", borderColor: "#E9F2FF", color: "#0077DB", fontWeight: 500};
            case "DONE":
                return {backgroundColor: "#DCFFF1", borderColor: "#DCFFF1", color: "#57987D", fontWeight: 500};
            default:
                return {};
        }
    }

    const getPriorityDropdownColor = () => {
        switch (selectedTaskPriority) {
            case "Low":
                return {backgroundColor: "#00FF00", borderColor: "#00FF00", color: "white", fontWeight: 500};
            case "Medium":
                return {backgroundColor: "#FFD700", borderColor: "#FFD700", color: "white", fontWeight: 500};
            case "High":
                return {backgroundColor: "#B30000", borderColor: "#B30000", color: "white", fontWeight: 500};
            default:
                return {};
        }
    }

    return (
        <div className="taskcard-container">
            <div className="taskcard-left">
                <LuClipboardList size="2em" />
                <p>{ taskTitle }</p>
            </div>
            <div className="taskcard-right">
                <Dropdown onSelect={ handleTaskStatusSelect }>
                    <Dropdown.Toggle style={ getStatusDropdownColor() }>
                        { selectedTaskStatus }
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <div className="todo-item-container">
                            <Dropdown.Item eventKey="TO DO" className="todo-item">TO DO</Dropdown.Item>
                        </div>
                        <div className="inprogress-item-container">
                            <Dropdown.Item eventKey="IN PROGRESS" className="inprogress-item">IN PROGRESS</Dropdown.Item>
                        </div>
                        <div className="done-item-container">
                            <Dropdown.Item eventKey="DONE" className="done-item">DONE</Dropdown.Item>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown onSelect={ handleTaskPrioritySelect }>
                    <Dropdown.Toggle className="priority-dropdown-toggle" style={ getPriorityDropdownColor() }>
                        { selectedTaskPriority }
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <div className="low-item-container">
                            <Dropdown.Item eventKey="Low" className="low-item">Low</Dropdown.Item>
                        </div>
                        <div className="medium-item-container">
                            <Dropdown.Item eventKey="Medium" className="medium-item">Medium</Dropdown.Item>
                        </div>
                        <div className="high-item-container">
                            <Dropdown.Item eventKey="High" className="high-item">High</Dropdown.Item>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
                <FaUserCircle size="2em" className="task-assignees-icon" />
                <RiDeleteBin6Line size="2em" fill="red" className="task-delete-icon" />
            </div>
        </div>
    );
}

const TaskList = () => {
  return (
    <div className="tasklist-container">
        <TaskCard taskTitle="Task One" />
        <TaskCard taskTitle="Task Two" />
        <TaskCard taskTitle="Task Three" />
    </div>
  );
};

export default TaskList;
