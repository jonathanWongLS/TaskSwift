import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import { ResponsiveContainer, BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from "recharts";
import "./ChartsTabs.css";

const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const dataWorkloadDist = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

const ChartsTabs = () => {

    const [selectedGraph, setSelectedGraph] = useState("task-completion-rate-event");
    const handleSelectGraph = (selectedGraph) => setSelectedGraph(selectedGraph);

    return (
        <>
            <Nav variant="tabs charts-tabs-nav" defaultActiveKey="task-completion-rate-event" activeKey={selectedGraph} onSelect={handleSelectGraph}>
                <Nav.Item className="charts-tabs-nav-item">
                    <Nav.Link className="charts-tabs-nav-link" eventKey="task-completion-rate-event">Task Completion Rate</Nav.Link>
                </Nav.Item>
                <Nav.Item className="charts-tabs-nav-item">
                    <Nav.Link className="charts-tabs-nav-link" eventKey="project-progress-event">Project Progress</Nav.Link>
                </Nav.Item>
                <Nav.Item className="charts-tabs-nav-item">
                    <Nav.Link className="charts-tabs-nav-link" eventKey="workload-distribution-event">Workload Distribution</Nav.Link>
                </Nav.Item>
            </Nav>
            {selectedGraph === 'task-completion-rate-event' && 
                <ResponsiveContainer className="chart-responsive-container" width="100%" height={400}>
                    <BarChart data={data} margin={{top: 50}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            }
            {selectedGraph === 'project-progress-event' && 
                <ResponsiveContainer className="chart-responsive-container" width="100%" height={400}>
                    <LineChart data={data} margin={{top: 50}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            }
            {selectedGraph === 'workload-distribution-event' &&
                <ResponsiveContainer className="chart-responsive-container" width="100%" height={400}>
                    <BarChart data={dataWorkloadDist} margin={{top: 50}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            }
        </>
    )
}

export default ChartsTabs