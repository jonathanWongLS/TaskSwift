import Header from "../../components/Header/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

import SummaryCard from "../../components/SummaryCard/SummaryCard";
import UpcomingDeadline from "../../components/UpcomingDeadline/UpcomingDeadline";
import ChartsTabs from "../../components/ChartsTabs/ChartsTabs";
import Progress from "../../components/Progress/Progress";
import PriorityTasks from "../../components/PriorityTasks/PriorityTasks";
import AlertBox from "../../components/AlertBox/AlertBox";

import { FaArrowRightLong } from "react-icons/fa6";

import "./Dashboard.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useJwt } from "react-jwt";

const Dashboard = () => {
  const [taskCountByStatus, setTaskCountByStatus] = useState({
    inProgress: null,
    completed: null,
    overdue: null,
  });
  const [tasksOrderedByCalendarDesc, setTasksOrderedByCalendarDesc] = useState(null);
  const [projectTaskSummary, setProjectTaskSummary] = useState([]);
  const [projectProgress, setProjectProgress] = useState([]);
  const [workloadDistribution, setWorkloadDistribution] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);

  const [getTaskCountByStatusError, setGetTaskCountByStatusError] = useState(null);
  const [getTasksOrderedByCalendarDescError, setGetTasksOrderedByCalendarDescError]  = useState(null);
  const [getProjectProgressError, setGetProjectProgressError] = useState(null); 
  const [getWorkloadDistributionError, setGetWorkloadDistributionError] = useState(null);
  const [getProjectTaskSummaryError, setGetProjectTaskSummaryError] = useState(null);
  const [getPriorityTasksError, setGetPriorityTasksError] = useState(null);


  const [getTaskCountByStatusLoading, setGetTaskCountByStatusLoading] = useState(false);
  const [getTasksOrderedByCalendarDescLoading, setGetTasksOrderedByCalendarDescLoading]  = useState(false);
  const [getProjectProgressLoading, setGetProjectProgressLoading] = useState(false); 
  const [getWorkloadDistributionLoading, setGetWorkloadDistributionLoading] = useState(false);
  const [getProjectTaskSummaryLoading, setGetProjectTaskSummaryLoading] = useState(false);
  const [getPriorityTasksLoading, setGetPriorityTasksLoading] = useState(false);

  const { decodedToken, isExpired } = useJwt(Cookies.get("jwt"));

  const getTaskCountByStatus = async () => {
    setGetTaskCountByStatusLoading(true);
    await axios.get(
      'http://13.212.104.51:8081/api/v1/task-count-status',
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then((response) => {
      setGetTaskCountByStatusLoading(false);
      setTaskCountByStatus({
        ...taskCountByStatus, 
        inProgress: response.data[0],
        completed: response.data[1],
        overdue: response.data[2]
      });
      
    }).catch((error) => {
      setGetTaskCountByStatusLoading(false);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setGetTaskCountByStatusError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        
        setGetTaskCountByStatusError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        
        setGetTaskCountByStatusError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
      setTimeout(() => {
        setGetTaskCountByStatusError(null);
      }, 6000);
    })
    .finally(() => setGetTaskCountByStatusLoading(false));
  };

  const getTasksOrderedByCalendarDesc = async () => {
    setGetTasksOrderedByCalendarDescLoading(true);
    await axios.get(
      'http://13.212.104.51:8081/api/v1/tasks-ordered-by-datetime-desc',
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then((response) => {
      setTasksOrderedByCalendarDesc(response.data);
      
    }).catch((error) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setGetTasksOrderedByCalendarDescError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        
        setGetTasksOrderedByCalendarDescError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        
        setGetTasksOrderedByCalendarDescError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
      setTimeout(() => {
        setGetTasksOrderedByCalendarDescError(null);
      }, 6000);
    })
    .finally(() => setGetTasksOrderedByCalendarDescLoading(false));
  };

  const getProjectTaskSummary = async () => {
    setGetProjectTaskSummaryLoading(true);
    await axios.get(
      'http://13.212.104.51:8081/api/v1/project-task-summary',
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then((response) => {
      setProjectTaskSummary(response.data);
    }).catch((error) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setGetProjectTaskSummaryError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        
        setGetProjectTaskSummaryError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        
        setGetProjectTaskSummaryError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
      setTimeout(() => {
        setGetProjectTaskSummaryError(null);
      }, 6000);
    })
    .finally(() => setGetProjectTaskSummaryLoading(false));
  };

  const getProjectProgress = async () => {
    setGetProjectProgressLoading(true);
    await axios.get(
      'http://13.212.104.51:8081/api/v1/project-progress',
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then((response) => {
      setProjectProgress(response.data);
      
    }).catch((error) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setGetProjectProgressError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        
        setGetProjectProgressError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        
        setGetProjectProgressError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
      setTimeout(() => {
        setGetProjectProgressError(null);
      }, 6000);
    })
    .finally(() => setGetProjectProgressLoading(false));
  };

  const getWorkloadDistribution = async () => {
    setGetWorkloadDistributionLoading(true);
    await axios.get(
      'http://13.212.104.51:8081/api/v1/workload-distribution',
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then((response) => {
      setWorkloadDistribution(response.data);
      
    }).catch((error) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setGetWorkloadDistributionError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        
        setGetWorkloadDistributionError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        
        setGetWorkloadDistributionError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
    })
    .finally(() => setGetWorkloadDistributionLoading(false));
  };

  const getPriorityTasks = async () => {
    setGetPriorityTasksLoading(true);
    await axios.get(
      'http://13.212.104.51:8081/api/v1/priority-tasks',
      {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + Cookies.get("jwt")
        }
      }
    ).then((response) => {
      setPriorityTasks(response.data);
      
    }).catch((error) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        
        if (error.response.status == 401) {
          window.location.href = "/sign-in?expired=true";
        } else {
          setGetPriorityTasksError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        
        setGetPriorityTasksError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      } else {
        // Something happened in setting up the request that triggered an error
        
        setGetPriorityTasksError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
      }
      setTimeout(() => {
        setGetPriorityTasksError(null);
      }, 6000);
    })
    .finally(() => setGetPriorityTasksLoading(false));
  };

  useEffect(() => {
    document.title = "Dashboard - TaskSwift";
    getTaskCountByStatus();
    getTasksOrderedByCalendarDesc();
    getProjectTaskSummary();
    getProjectProgress();
    getWorkloadDistribution();
    getPriorityTasks();
  }, []);

  return (
    <>
      { decodedToken ? <Header loggedIn={ true } username={ decodedToken.sub } /> : <Header loggedIn={ false } username={null} /> }
      <div className="dashboard-container">
        <AlertBox errorMessage={ getTaskCountByStatusError } />
        <AlertBox errorMessage={ getTasksOrderedByCalendarDescError } />
        <AlertBox errorMessage={ getProjectTaskSummaryError } />
        <AlertBox errorMessage={ getProjectProgressError } />
        <AlertBox errorMessage={ getWorkloadDistributionError } />
        <AlertBox errorMessage={ getPriorityTasksError } />

        <Row className="dashboard-row">
          <Col sm={12} md={3} xl={4} className="create-task-col-btn">
            <Button className="create-task-btn" href="/projects">
              <b>View Projects</b>{'  '}<FaArrowRightLong />
            </Button>
          </Col>
          { 
            getTaskCountByStatusLoading ? 
              <Col sm={12} md={9} xl={8} className="top-dashboard-cards">
                <SummaryCard cardTitle="In Progress" iconSrc="progress-bar.svg" value="" loading={ true }/>
                <SummaryCard cardTitle="Completed" iconSrc="task-complete.svg" value="" loading={ true }/>
                <SummaryCard cardTitle="Overdue" iconSrc="expire.svg" value="" loading={ true }/>
              </Col>
              :
              (
                (taskCountByStatus === null || taskCountByStatus.inProgress === null || taskCountByStatus.completed === null || taskCountByStatus.overdue === null) ? (
                  <Col sm={12} md={9} xl={8} className="top-dashboard-cards">
                    <SummaryCard cardTitle="In Progress" iconSrc="progress-bar.svg" value="-" loading={ false }/>
                    <SummaryCard cardTitle="Completed" iconSrc="task-complete.svg" value="-" loading={ false }/>
                    <SummaryCard cardTitle="Overdue" iconSrc="expire.svg" value="-" loading={ false }/>
                  </Col>
                ) : (
                  <Col sm={12} md={9} xl={8} className="top-dashboard-cards">
                    <SummaryCard cardTitle="In Progress" iconSrc="progress-bar.svg" value={ taskCountByStatus.inProgress.toString() } loading={ false }/>
                    <SummaryCard cardTitle="Completed" iconSrc="task-complete.svg" value={ taskCountByStatus.completed.toString() } loading={ false }/>
                    <SummaryCard cardTitle="Overdue" iconSrc="expire.svg" value={ taskCountByStatus.overdue.toString() } loading={ false }/>
                  </Col>
                )
              )
          }
        </Row>
        <Row className="dashboard-row">
          <Col sm={12} md={12} xl={4} className="upcoming-deadline-col mb-4" >
            {
              getTasksOrderedByCalendarDescLoading ? 
              <span className="d-flex justify-content-center text-align-center">
                <Spinner animation="grow" size="sm" />
              </span> 
              :
              <UpcomingDeadline deadlineDetails={ tasksOrderedByCalendarDesc } />
            }
          </Col>
          <Col sm={12} md={12} xl={8} className="charts-tabs-col">   
            <ChartsTabs projectProgressDetails={ projectProgress } workloadDistributionDetails={ workloadDistribution } loading={ getProjectProgressLoading || getWorkloadDistributionLoading } />
          </Col>
        </Row>
        <Row className="dashboard-row">
            <Col sm={12} md={12} xl={4} className="mb-4">
              {
                getProjectTaskSummaryLoading ? 
                <span className="d-flex justify-content-center text-align-center">
                  <Spinner animation="grow" size="sm" />
                </span> 
                :
                <Progress projectTaskSummary={ projectTaskSummary }/>
              }
            </Col>
            <Col sm={12} md={12} xl={8} className="mb-4">
              <PriorityTasks priorityTasksDetails={ priorityTasks }/>
            </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
