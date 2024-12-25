import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";



const AdminAnnouncements = () => {
  document.title = "AdminAnnouncements";
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
          <h2 className="my-4">AdminAnnouncements</h2>

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
        <Card className="card-body">
                                <div className="avatar-sm mb-3">
                                    <div className="avatar-title bg-success-subtle text-success fs-base rounded">
                                        <i className="ri-smartphone-line"></i>
                                    </div>
                                </div>
                                <h4 className="card-title">Text Application</h4>
                                <p className="card-text text-muted">Send a link to apply on mobile device. Appropriately communicate one-to-one technology.</p>
                                <Link to="/TrainerCoursesList" className="btn btn-success">Apply Now</Link>
                            </Card>
      </div>
    </React.Fragment>
  );
};

export default AdminAnnouncements;
