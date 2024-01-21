import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import "./PriorityTasks.css";

const PriorityTasks = () => {
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
              <th>Assignee</th>
              <th>Deadline</th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Task 1",
                description: "Task 1 does lorem ipsum",
                assignees: "User 1, User 2, User 3, User 4",
                deadlineDate: "10/10/2023",
                deadlineTime: "10:00AM",
                project: "Project 1",
              },
              {
                name: "Task 2",
                description: "Task 2 does lorem ipsum",
                assignees: "User 1, User 2, User 3, User 4",
                deadlineDate: "10/10/2023",
                deadlineTime: "10:00AM",
                project: "Project 2",
              },
              {
                name: "Task 3",
                description: "Task 3 does lorem ipsum",
                assignees: "User 1, User 2, User 3, User 4",
                deadlineDate: "10/10/2023",
                deadlineTime: "10:00AM",
                project: "Project 3",
              },
            ].map((priorityTasksDetails, key) => {
              return (
                <tr key={key} className="priority-tasks-tr">
                  <td className="task-name">{ priorityTasksDetails.name }</td>
                  <td className="task-desc">{ priorityTasksDetails.description }</td>
                  <td className="task-assignee">
                    { priorityTasksDetails.assignees }
                  </td>
                  <td className="task-deadline">
                    { priorityTasksDetails.deadlineDate }
                    <br />
                    { priorityTasksDetails.deadlineTime }
                  </td>
                  <td className="task-project">{ priorityTasksDetails.project }</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PriorityTasks;
