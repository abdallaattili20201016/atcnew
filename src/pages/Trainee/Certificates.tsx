import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

const Certificates = () => {
  document.title = "Certificates";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <h2 className="mb-4">Certificates</h2>
          <Row className="mb-4">
            <Col className="text-end">
              <Card className="text-center p-4 shadow-sm">
               
                <p className="text-muted">
                  When you complete a course, your certificate will appear here.
                </p>
                <p className="text-muted">
                  Stay dedicated and work hard to achieve your goals!
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Certificates;
