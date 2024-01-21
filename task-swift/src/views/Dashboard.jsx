import Header from "../components/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import SummaryCard from "../components/SummaryCard";
import UpcomingDeadline from "../components/UpcomingDeadline/UpcomingDeadline";
import ChartsTabs from "../components/ChartsTabs/ChartsTabs";
import Progress from "../components/Progress/Progress";
import PriorityTasks from "../components/PriorityTasks/PriorityTasks";

import { FaArrowRightLong } from "react-icons/fa6";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="dashboard-container">
        <Row className="dashboard-row">
          <Col sm={12} md={3} xl={4} className="create-task-col-btn">
            <Button className="create-task-btn">
              <b>View Projects</b>{'  '}<FaArrowRightLong />
            </Button>
          </Col>
          <Col sm={12} md={9} xl={8} className="top-dashboard-cards">
            {[["In Progress", "progress-bar.svg", 3], ["Completed", "task-complete.svg", 3], ["Overdue", "expire.svg", 2]].map((cardDetails, index) => {
              if (index === 0) {
                return <SummaryCard key={index} cardTitle={cardDetails[0]} iconSrc={cardDetails[1]} value={index} darkBg={true} />
              }
              else {
                return <SummaryCard key={index} cardTitle={cardDetails[0]} iconSrc={cardDetails[1]} value={index} darkBg={false} />
              }
            })}
          </Col>
        </Row>
        <Row className="dashboard-row">
          <Col sm={12} md={12} xl={4} className="upcoming-deadline-col" >
            <UpcomingDeadline />
          </Col>
          <Col sm={12} md={12} xl={8} className="charts-tabs-col">
            <ChartsTabs />
          </Col>
        </Row>
        <Row className="dashboard-row">
            <Col sm={12} md={12} xl={4}>
              <Progress />
            </Col>
            <Col sm={12} md={12} xl={6}>
              <PriorityTasks />
            </Col>
            <Col sm={12} md={12} xl={2}>Hey</Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
