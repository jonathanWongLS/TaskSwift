import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import ProgressBar from "react-bootstrap/ProgressBar";

import "./Progress.css";

const Progress = () => {
  return (
    <Card className="progress-card">
      <Card.Title className="progress-card-title">Progress</Card.Title>
      <Card.Body className="progress-card-body">
        <Accordion className="progress-accordion">
          <Accordion.Item className="progress-accordion-item" eventKey="0">
            <Accordion.Header className="progress-accordion-header">
                <h5>Ongoing</h5>
            </Accordion.Header>
            <Accordion.Body>
                {
                    [["Project 1", 4, 5], ["Project 2", 3, 10]].map((progressDetails, key) => {
                        return(
                            <Card key={key} className="project-progress-card">
                                <Card.Body>
                                    <h5>{progressDetails[0]}</h5>
                                    <ProgressBar animated now={progressDetails[1]/progressDetails[2] * 100} />
                                </Card.Body>
                            </Card>
                        );
                    })
                }
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className="progress-accordion-item" eventKey="1">
            <Accordion.Header className="progress-accordion-header">
                <h5>Completed</h5>
            </Accordion.Header>
            <Accordion.Body>
                {
                    ["Project 3", "Project 4"].map((completedProjectDetails, completedKey) => {
                        return(
                            <Card key={completedKey} className="project-progress-card">
                                <Card.Body>
                                    <h5>{ completedProjectDetails }</h5>
                                    <ProgressBar animated variant="success" now={100} />
                                </Card.Body>
                            </Card>
                        );
                    })
                }
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default Progress;
