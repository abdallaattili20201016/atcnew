import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../App";

const TrainerCoursesList = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "Courses"));
      const fetchedCourses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Available Courses</h2>
          <Row>
            {isLoading ? (
              <p>Loading...</p>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <Col key={course.id} md={4} className="mb-4">
                  <Card>
                    <Card.Body className="pt-1">
                      <Row>
                        <Col lg={12} className="mini-widget pb-3 pb-lg-0">
                          <div className="d-flex align-items-end">
                            <div className="flex-grow-1">
                              <h2 className="mb-0 fs-24">{course.title}</h2>
                              <h5 className="text-muted fs-16 mt-2 mb-0">
                                {course.description.slice(0, 50)}...
                              </h5>
                              <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                                <span className="badge bg-info me-1">
                                  Duration: {course.duration || "N/A"}
                                </span>
                              </p>
                              <Button
                                variant="primary"
                                className="btn-animation mt-2"
                                data-text="View Details"
                                onClick={() => navigate(`/courses/${course.id}`)}
                              >
                                <span>View Details</span>
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TrainerCoursesList;
