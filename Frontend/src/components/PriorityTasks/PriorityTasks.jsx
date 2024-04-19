import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import PropTypes from 'prop-types';

import "./PriorityTasks.css";

const PriorityTasks = ({ priorityTasksDetails }) => {
  return (
    <Card className="priority-tasks-card">
      <Card.Title className="priority-tasks-card-title">
        Priority Tasks
      </Card.Title>
      <Card.Body className="priority-tasks-card-body">
        <Table className="priority-tasks-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Task Description</th>
              <th>Assignee(s)</th>
              <th>Deadline</th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {
              priorityTasksDetails.map((priorityTasksDetails, key) => {
                return (
                  <tr key={key} className="priority-tasks-tr">
                    <td className="task-name">{ priorityTasksDetails.task.taskName }</td>
                    <td className="task-desc">{ priorityTasksDetails.task.taskDescription }</td>
                    <td className="task-assignee">
                      {
                        priorityTasksDetails.task.assignedUsers.map((assignedUser, assignedUserKey) => (
                          <span key={ assignedUserKey }>{ assignedUser.username }<br/></span>
                        ))
                      }
                    </td>
                    <td className="task-deadline">
                      { priorityTasksDetails.task.taskTimelineEndDateTime }
                    </td>
                    <td className="task-project">{ priorityTasksDetails.projectName }</td>
                  </tr>
                );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

PriorityTasks.propTypes = {
  priorityTasksDetails: PropTypes.array, 
}

export default PriorityTasks;
