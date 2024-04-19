import Card from "react-bootstrap/Card";
import { RxDot } from "react-icons/rx";
import "./UpcomingDeadline.css";
import PropTypes from "prop-types";

const UpcomingDeadline = ({ deadlineDetails }) => {
  return (
    <Card className="upcoming-deadline-card" style={{ height: '400px', overflowY: 'auto' }}>
      <Card.Body className="upcoming-deadline-card-body">
        <Card.Title className="upcoming-deadline-card-title">Upcoming Deadlines</Card.Title>
        <Card.Body> 
          {
            (deadlineDetails === null || deadlineDetails.length === 0) ? 
            <p className="d-flex justify-content-center mt-3">No upcoming deadlines</p> :
           (
              deadlineDetails.map((deadlineDetail, key) => {
                const taskDeadline = new Date(deadlineDetail.task.taskTimelineEndDateTime);
                let currentDate = new Date();
                currentDate.setTime(currentDate.getTime() + 480*60*1000);
                currentDate = new Date(currentDate.toISOString().split("T")[0]);

                if (taskDeadline > currentDate) {
                  return (
                    <div key={key} className="upcoming-deadline-task">
                      <div className="upcoming-deadline-task-details-top">
                        <h4>Project {deadlineDetail.projectName}</h4>
                        <RxDot /> 
                        Task {deadlineDetail.task.taskName}
                      </div>
                      <div className="upcoming-deadline-task-details-bottom">
                        <p>
                          Remaining Time: 
                          <b>
                            {' '}{ Math.ceil((taskDeadline - currentDate) / (1000 * 60 * 60 * 24)) }{" days"}  
                          </b>
                        </p>
                      </div>
                    </div>
                  )
                } else {
                  return null;
                }
            }))
          }
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

UpcomingDeadline.propTypes = {
  deadlineDetails: PropTypes.array
}

export default UpcomingDeadline;
