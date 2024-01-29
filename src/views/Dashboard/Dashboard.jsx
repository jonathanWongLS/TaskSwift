import Header from "../../components/Header/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import SummaryCard from "../../components/SummaryCard/SummaryCard";
import UpcomingDeadline from "../../components/UpcomingDeadline/UpcomingDeadline";
import ChartsTabs from "../../components/ChartsTabs/ChartsTabs";
import Progress from "../../components/Progress/Progress";
import PriorityTasks from "../../components/PriorityTasks/PriorityTasks";
import Feed from "../../components/Feed/Feed";

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
          <Col sm={12} md={12} xl={4} className="upcoming-deadline-col mb-4" >
            <UpcomingDeadline />
          </Col>
          <Col sm={12} md={12} xl={8} className="charts-tabs-col">
            <ChartsTabs />
          </Col>
        </Row>
        <Row className="dashboard-row">
            <Col sm={12} md={12} xl={4} className="mb-4">
              <Progress />
            </Col>
            <Col sm={12} md={12} xl={5} className="mb-4">
              <PriorityTasks />
            </Col>
            <Col sm={12} md={12} xl={3}>
              <Feed />
            </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
