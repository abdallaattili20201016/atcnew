import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  document.title = "Dashboard";
  const [isShow, setIsShow] = useState(false);

  // Sample data for the charts
  const chartData = [
    { name: "Jan", courses: 10 },
    { name: "Feb", courses: 12 },
    { name: "Mar", courses: 8 },
    { name: "Apr", courses: 15 },
  ];

  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const hidePaymentModal = () => {
    setIsShow(!isShow);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Dashboard</h2>
          <Row>
            <Col lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <i className="las la-users fs-40 text-primary"></i>
                  <h5 className="mt-3">Clients Added</h5>
                  <h2 className="mb-0">0</h2>
                  <p className="text-muted mt-3"><span className="badge bg-info me-1">1.15%</span> since last week</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <i className="las la-file-signature fs-40 text-success"></i>
                  <h5 className="mt-3">Contracts Signed</h5>
                  <h2 className="mb-0">0</h2>
                  <p className="text-muted mt-3"><span className="badge bg-danger me-1">1.15%</span> since last week</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <i className="las la-file-invoice fs-40 text-warning"></i>
                  <h5 className="mt-3">Invoice Sent</h5>
                  <h2 className="mb-0">0</h2>
                  <p className="text-muted mt-3"><span className="badge bg-info me-1">3.14%</span> since last week</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <Button variant="primary" className="position-relative">
                    Notifications
                    {/* Replace 2 with your unreadAnnouncements + unreadMessages */}
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      2
                    </span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <h4 className="card-title">Monthly Courses Data</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="courses" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <h4 className="card-title">Sales Data</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="courses" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <h4 className="card-title">User Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <h4 className="card-title">Recent Activities</h4>
                  <ul className="list-group">
                    {/* Replace with dynamic data */}
                    <li className="list-group-item">User A added a new course</li>
                    <li className="list-group-item">User B signed a contract</li>
                    <li className="list-group-item">User C sent an invoice</li>
                    <li className="list-group-item">User D received a notification</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
