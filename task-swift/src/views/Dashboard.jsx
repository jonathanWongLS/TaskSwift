import Header from "../components/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaPlus } from "react-icons/fa6";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="dashboard-container">
        <Row className="dashboard-row">
          <Col sm={4} className="create-task-col-btn">
            <Button variant="primary" className="create-task-btn">
              <FaPlus />{' '}
              <b>Create Task</b>
            </Button>
          </Col>
          <Col sm={8} className="top-dashboard-cards">
            <Card className="text-center in-progress">
              <Card.Body>
                <Row>
                  <Col lg={12} xl={4} className="top-dashboard-cards-col">
                    <div>
                      <img width={40} height={40} src="progress-bar.svg" />
                    </div>
                  </Col>
                  <Col lg={12} xl={8}>
                    <Card.Title>In Progress</Card.Title>
                    <Card.Text>
                      <h4>3</h4>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="text-center completed">
              <Card.Body>
                <Row>
                  <Col lg={12} xl={4} className="top-dashboard-cards-col">
                    <div className="top-dashboard-cards-img">
                      <img width={40} height={40} src="task-complete.svg" />
                    </div>
                  </Col>
                  <Col lg={12} xl={8}>
                    <Card.Title>Completed</Card.Title>
                    <Card.Text>
                      <h5>3</h5>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="text-center overdue">
              <Card.Body>
                <Row>
                  <Col lg={12} xl={4} className="top-dashboard-cards-col">
                    <div className="top-dashboard-cards-img">
                      <img width={40} height={40} src="expire.svg" />
                    </div>
                  </Col>
                  <Col lg={12} xl={8}>
                    <Card.Title>Overdue</Card.Title>
                    <Card.Text>
                      <h5>3</h5>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
