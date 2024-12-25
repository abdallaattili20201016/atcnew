import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";



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
          <Card.Body className="pt-1">
                                    <Row>
                                        <Col lg={4} className="mini-widget pb-3 pb-lg-0">
                                            <div className="d-flex align-items-end">
                                                <div className="flex-grow-1">
                                                    <h2 className="mb-0 fs-24"></h2>
                                                    <h5 className="text-muted fs-16 mt-2 mb-0">Clients Added</h5>
                                                    <p className="text-muted mt-3 pt-1 mb-0 text-truncate"> <span className="badge bg-info me-1">1.15%</span>  since last week</p>
                                                    </div>
                                                    </div>

                                        </Col>

                                        <Col lg={4} className="mini-widget pb-3 pb-lg-0">
                                            <div className="d-flex align-items-end">
                                                <div className="flex-grow-1">
                                                    <h2 className="mb-0 fs-24"></h2>
                                                    <h5 className="text-muted fs-16 mt-2 mb-0">Contracts Signed</h5>
                                                    <p className="text-muted mt-3 pt-1 mb-0 text-truncate"> <span className="badge bg-danger me-1">1.15%</span>  since last week</p>
                                                </div>                                                
                                                </div>
                                        </Col>

                                        <Col lg={4} className="mini-widget pb-3 pb-lg-0">
                                            <div className="d-flex align-items-end">
                                                <div className="flex-grow-1">
                                                    <h2 className="mb-0 fs-24"></h2>
                                                    <h5 className="text-muted fs-16 mt-2 mb-0">Invoice Sent</h5>
                                                    <p className="text-muted mt-3 pt-1 mb-0 text-truncate"> <span className="badge bg-info me-1">3.14%</span>  since last week</p>
                                                </div>                                               
                                            </div>
                                        </Col >
                                    </Row>
                                </Card.Body> 
          </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
