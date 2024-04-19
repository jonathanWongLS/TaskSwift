import { useState,useEffect } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import ProgressBar from "react-bootstrap/ProgressBar";
import PropTypes from 'prop-types';

import "./Progress.css";

const Progress = ({ projectTaskSummary }) => {
  const [progressOfNonDoneProjects, setProgressOfNonDoneProjects] = useState([]);
  const [progressOfDoneProjects, setProgressOfDoneProjects] = useState([]);

  useEffect(() => {
    const nonDoneProjects = [];
    const doneProjects = [];

    if (Array.isArray(projectTaskSummary)) {
      for (let projectTaskDetail of projectTaskSummary) {
        if ((projectTaskDetail.numberOfTasks - projectTaskDetail.numberOfNonDoneTasks) === projectTaskDetail.numberOfTasks) {
          doneProjects.push(projectTaskDetail);
        } else {
          nonDoneProjects.push(projectTaskDetail);
        }
      }
    }

    setProgressOfDoneProjects(doneProjects);
    setProgressOfNonDoneProjects(nonDoneProjects);
  }, [projectTaskSummary]);

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
                    progressOfNonDoneProjects.length === 0 ? 
                    <p className="d-flex justify-content-center">No ongoing projects!</p> 
                    : 
                    (
                      progressOfNonDoneProjects.map((progressOfNonDoneProject, key) => {
                        return(
                            <Card key={key} className="project-progress-card">
                                <Card.Body>
                                    <h5>{ progressOfNonDoneProject.project.projectName }</h5>
                                    <ProgressBar label={ `${progressOfNonDoneProject.numberOfTasks - progressOfNonDoneProject.numberOfNonDoneTasks} / ${progressOfNonDoneProject.numberOfTasks} tasks completed!`} animated now={ progressOfNonDoneProject.numberOfNonDoneTasks/progressOfNonDoneProject.numberOfTasks * 100 } />
                                </Card.Body>
                            </Card>
                        );
                    })
                    )
                }
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className="progress-accordion-item" eventKey="1">
            <Accordion.Header className="progress-accordion-header">
                <h5>Completed</h5>
            </Accordion.Header>
            <Accordion.Body>
                {
                  progressOfDoneProjects.length === 0 ? 
                  <p className="d-flex justify-content-center">No completed projects!</p>
                  :
                  (
                    progressOfDoneProjects.map((doneProjectDetail, doneKey) => {
                      return(
                          <Card key={doneKey} className="project-progress-card">
                              <Card.Body>
                                  <h5>{ doneProjectDetail.project.projectName }</h5>
                                  <ProgressBar label="100%" animated variant="success" now={100} />
                              </Card.Body>
                          </Card>
                      );
                  }))
                }
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

Progress.propTypes = {
  projectTaskSummary: PropTypes.array
}

export default Progress;
