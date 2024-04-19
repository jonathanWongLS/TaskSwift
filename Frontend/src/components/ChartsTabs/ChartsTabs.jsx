import { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Spinner from 'react-bootstrap/Spinner';

import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

import "./ChartsTabs.css";

const ChartsTabs = ({ projectProgressDetails, workloadDistributionDetails, loading }) => {
  const [projectProgressData, setProjectProgressData] = useState([]);
  const [workloadDistributionData, setWorkloadDistributionData] = useState([]);

  const [selectedGraph, setSelectedGraph] = useState("project-progress-event");
  const handleSelectGraph = (selectedGraph) => setSelectedGraph(selectedGraph);

  useEffect(() => {
    if (projectProgressDetails) {
      const progressData = projectProgressDetails.map(detail => ({
        name: detail.project.projectName,
        "To Do": detail.numberOfTodoTasks,
        "In Progress": detail.numberOfInProgressTasks,
        Done: detail.numberOfDoneTasks,
      }));
      setProjectProgressData(progressData);
    } else {
      setProjectProgressData([]);
    }

    if (workloadDistributionDetails) {
      const workloadData = workloadDistributionDetails.map(detail => ({
        name: detail.project.projectName,
        "No. of Assigned Tasks": detail.assignedTasksCount,
        "No. of Unassigned Tasks": detail.totalTasksCount - detail.assignedTasksCount,
      }));
      setWorkloadDistributionData(workloadData);
    } else {
      setWorkloadDistributionData([]);
    }
  }, [projectProgressDetails, workloadDistributionDetails]);

  return (
    <>
      <Nav variant="tabs charts-tabs-nav" defaultActiveKey="project-progress-event" activeKey={selectedGraph} onSelect={handleSelectGraph}>
        <Nav.Item className="charts-tabs-nav-item">
          <Nav.Link className="charts-tabs-nav-link" eventKey="project-progress-event">Project Progress</Nav.Link>
        </Nav.Item>
        <Nav.Item className="charts-tabs-nav-item">
          <Nav.Link className="charts-tabs-nav-link" eventKey="workload-distribution-event">Workload Distribution</Nav.Link>
        </Nav.Item>
      </Nav>
      {selectedGraph === 'project-progress-event' && (
        loading ? (
          <ResponsiveContainer className="chart-responsive-container" width="100%" height={360}>
            <span className="d-flex justify-content-center text-align-center mt-4">
              <Spinner animation="grow" size="sm" />
            </span>
          </ResponsiveContainer>
        ) : (
          <>
            {projectProgressData && projectProgressData.length > 0 ? (
              <ResponsiveContainer className="chart-responsive-container" width="100%" height={360}>
                <BarChart width={500} height={500} data={projectProgressData}>
                  <CartesianGrid />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="To Do" stackId="a" fill="#3D4D6A" />
                  <Bar dataKey="In Progress" stackId="a" fill="#0077DB" />
                  <Bar dataKey="Done" stackId="a" fill="#57987D" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer className="chart-responsive-container" width="100%" height={360}>
                <p className="d-flex justify-content-center mt-5">No projects yet</p>
              </ResponsiveContainer>
            )}
          </>
        )
      )}
      {selectedGraph === 'workload-distribution-event' &&
        (loading ? 
          (
            <ResponsiveContainer className="chart-responsive-container" width="100%" height={360}>
              <span className="d-flex justify-content-center text-align-center mt-4">
                <Spinner animation="grow" size="sm" />
              </span>
            </ResponsiveContainer>
          ) : (
          <>
            {
              workloadDistributionDetails && workloadDistributionDetails.length > 0 ?
              <ResponsiveContainer className="chart-responsive-container" width="100%" height={360}>
                <BarChart
                  layout="vertical"
                  width={500}
                  height={500}
                  data={workloadDistributionData}
                  margin={{
                    top: 30,
                    right: 20,
                    bottom: 10,
                    left: 10,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="No. of Assigned Tasks" stackId="a" fill="#2196F3" />
                  <Bar dataKey="No. of Unassigned Tasks" stackId="a" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
              :
              <ResponsiveContainer className="chart-responsive-container" width="100%" height={360}>
                <p className="d-flex justify-content-center mt-5">No projects yet</p>
              </ResponsiveContainer>
            }
          </>
        )
      )}
    </>
  )
}

ChartsTabs.propTypes = {
  projectProgressDetails: PropTypes.array,
  workloadDistributionDetails: PropTypes.array,
  loading: PropTypes.bool
}

export default ChartsTabs