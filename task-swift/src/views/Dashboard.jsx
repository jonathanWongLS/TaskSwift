import Header from "../components/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SummaryCard from "../components/SummaryCard";
import Button from "react-bootstrap/Button";
import { FaPlus } from "react-icons/fa6";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="dashboard-container">
        <Row className="dashboard-row">
          <Col sm={12} md={3} xl={4} className="create-task-col-btn">
            <Button variant="primary" className="create-task-btn">
              <FaPlus />{' '}
              <b>Create Task</b>
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
      </div>
    </>
  );
};

export default Dashboard;
