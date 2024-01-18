import Card from "react-bootstrap/Card";
import { RxDot } from "react-icons/rx";
import "./UpcomingDeadline.css";

const UpcomingDeadline = ({deadlineDetails}) => {
  return (
    <div className="upcoming-deadline-container">
        <Card className="upcoming-deadline-card">
            <Card.Title className="p-3 upcoming-deadline-title">Upcoming Deadlines</Card.Title>
            <Card.Body className="upcoming-deadline-body">
              {[["Task 1", "Project 1", "10 days"], ["Task 2", "Project 2", "2 days"], ["Task 3", "Project 3", "1 day"], ["Task 4", "Project 4", "1 day"], ["Task 5", "Project 5", "1 day"]].map((deadlineDetail, key) => {
                return (
                  <div key={key} className="upcoming-deadline-task">
                    <div className="upcoming-deadline-task-details-top">
                      <h4>{deadlineDetail[0]}</h4>
                      <p><RxDot />{deadlineDetail[1]}</p>
                    </div>
                    <div className="upcoming-deadline-task-details-bottom">
                      <p>Remaining Time: <b>{deadlineDetail[2]}</b></p>
                    </div>
                  </div>
                );
              })}
              
            </Card.Body>
        </Card>
    </div>
  )
}

export default UpcomingDeadline