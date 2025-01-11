import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { getFirebaseBackend } from "../../helpers/firebase_helper";

const TraineeDashboard = () => {
  document.title = "Trainee Dashboard";

  const [courses, setCourses] = useState<any[]>([]);
  const [assignmentsCompleted, setAssignmentsCompleted] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        const dataList = await firebaseBackend.getTraineeCourses();
        setCourses(dataList);

        let completedAssignments = 0;
        dataList.forEach((course: any) => {
          if (course.completedAssignments) {
            completedAssignments += course.completedAssignments;
          }
        });
        setAssignmentsCompleted(completedAssignments);
      } catch (error) {
        console.error("Error loading trainee dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <h2 className="my-4">Trainee Dashboard</h2>

        <Row>
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-book fs-40 text-primary"></i>
                <h5 className="mt-3">Courses Enrolled</h5>
                <h2 className="mb-0">{isLoading ? "Loading..." : courses.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-check-circle fs-40 text-success"></i>
                <h5 className="mt-3">Assignments Completed</h5>
                <h2 className="mb-0">{isLoading ? "Loading..." : assignmentsCompleted}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Enrolled Courses</h4>
                {isLoading ? (
                  <Spinner animation="grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : courses && courses.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Course Title</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course: any, index: number) => (
                        <tr key={index}>
                          <td>{course.title}</td>
                          <td>{course.description}</td>
                          <td>
                            <a
                              href={`/trainee-courses-details/${course.id}`}
                              className="btn btn-primary"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No courses enrolled</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Recent Announcements</h4>
                <p>No announcements available</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TraineeDashboard;