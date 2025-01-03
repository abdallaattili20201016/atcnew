import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  document.title = "About Us";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Header Section */}
          <div className="mb-5 text-center">
            <h1>About Us</h1>
            <p className="text-muted">
              Welcome to the Academic Training Center! Empowering education and
              fostering growth through excellence and innovation.
            </p>
          </div>

          {/* Mission, Vision, and Values */}
          <Row className="mb-5">
            <Col md={4}>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">Our Mission</Card.Title>
                  <Card.Text>
                    To provide transformative training programs that empower
                    individuals to excel academically and professionally. We
                    aim to cultivate knowledge, skills, and leadership for a
                    brighter future.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">Our Vision</Card.Title>
                  <Card.Text>
                    To become a globally recognized academic training center
                    known for our excellence in education, innovation, and
                    positive societal impact.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">Our Values</Card.Title>
                  <Card.Text>
                    We are guided by integrity, inclusivity, and a relentless
                    pursuit of excellence. Our values inspire us to create a
                    community that fosters learning, respect, and collaboration.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* About the Center */}
          <Row className="mb-5">
            <Col>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">Who We Are</Card.Title>
                  <Card.Text>
                    The Academic Training Center (ATC) is a leading institution
                    committed to enhancing knowledge and skills through
                    high-quality educational programs. Since our inception, we
                    have dedicated ourselves to fostering a community of
                    learners who are prepared to tackle the challenges of a
                    dynamic world. Our programs are designed to cater to a
                    diverse audience, including students, professionals, and
                    organizations, ensuring everyone has the opportunity to
                    thrive.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Why Choose Us */}
          <Row className="mb-5">
            <Col>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">Why Choose Us?</Card.Title>
                  <Card.Text>
                    At ATC, we understand that every individual has unique
                    learning needs. That’s why we offer personalized training
                    experiences that align with your goals. Whether you’re
                    looking to advance in your career, acquire new skills, or
                    achieve academic success, we have the resources and support
                    you need.
                  </Card.Text>
                  <ul>
                    <li>Expert instructors with real-world experience</li>
                    <li>State-of-the-art facilities and technology</li>
                    <li>A wide range of programs and certifications</li>
                    <li>A supportive and inclusive learning environment</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Impact Section */}
          <Row>
            <Col>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">Our Impact</Card.Title>
                  <Card.Text>
                    Over the years, ATC has made a significant impact on the
                    lives of countless individuals and organizations. Here are
                    some highlights of what we’ve achieved:
                  </Card.Text>
                  <ul>
                    <li>Empowered thousands of students to achieve their goals</li>
                    <li>Partnered with leading organizations for customized training</li>
                    <li>Developed innovative programs that address real-world challenges</li>
                    <li>Fostered a community of lifelong learners</li>
                  </ul>
                  <Card.Text>
                    Join us on this journey of growth, learning, and success.
                    Together, we can achieve great things!
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AboutUs;
