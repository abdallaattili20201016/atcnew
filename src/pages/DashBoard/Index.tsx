import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";



const Dashboard = () => {
  document.title = "Dashboard";
  const [isShow, setIsShow] = useState(false);
  

  // Sample data for the chart
  const chartData = [
    { name: "Jan", courses: 10 },
    { name: "Feb", courses: 12 },
    { name: "Mar", courses: 8 },
    { name: "Apr", courses: 15 },
  ];

  const hidePaymentModal = () => {
    setIsShow(!isShow);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Dashboard</h2>

          {/* Row for stats widgets */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-white bg-primary mb-3">
                <Card.Body>
                  <Card.Title>Total Courses</Card.Title>
                  <Card.Text>25</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-white bg-success mb-3">
                <Card.Body>
                  <Card.Title>New Announcements</Card.Title>
                  <Card.Text>5</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-white bg-warning mb-3">
                <Card.Body>
                  <Card.Title>New Trainees</Card.Title>
                  <Card.Text>8</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>



          {/* Recent Activities */}
          <Row className="mt-4">
            <Col md={12}>
              <h4>Recent Activities</h4>
              <ul className="list-group">
                <li className="list-group-item">Course "React Basics" added.</li>
                <li className="list-group-item">Announcement "Holiday Schedule" posted.</li>
                <li className="list-group-item">New trainee registered: John Doe.</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
