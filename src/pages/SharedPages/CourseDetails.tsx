import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { db } from "../../App";
import BreadCrumb from "../../Common/BreadCrumb";
import { getAuth } from "firebase/auth";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  trainer: string;
  assignments?: { id: string; title: string }[];
  trainees?: string[];
}

const CourseDetails = () => {
  document.title = "Course Details";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          } else {
            console.error("User not found");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole("guest"); 
      }
    };

    fetchUserRole();
  }, [currentUser]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseDoc = await getDoc(doc(db, "Courses", id!));
        if (courseDoc.exists()) {
          const courseData = courseDoc.data() as Course;
          setCourse({ ...courseData, id: courseDoc.id });
        } else {
          console.error("Course not found");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading course details...</p>
        </Container>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-content">
        <Container fluid className="text-center mt-5">
          <p>Course not found.</p>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Course Details" title="Courses" />

          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <Card.Body>
                  <h4 className="card-title mb-4">Course Details</h4>
                  <Row className="mb-4">
                    <Col md={6}>
                      <p><strong>Title:</strong> {course.title}</p>
                      <p><strong>Description:</strong> {course.description}</p>
                      <p><strong>Duration:</strong> {course.duration}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Trainer:</strong> {course.trainer}</p>
                      <p><strong>Assignments:</strong> {course.assignments?.length || 0}</p>
                      <p><strong>Trainees Enrolled:</strong> {course.trainees?.length || 0}</p>
                    </Col>
                  </Row>

                  {/* Admin Features */}
                  {userRole === "admin" && (
                    <div>
                      <Button variant="primary" onClick={() => navigate(`/edit-course/${id}`)}>
                        Edit Course
                      </Button>
                      <Button variant="danger" className="ms-2" onClick={() => alert("Delete functionality coming soon!")}>
                        Delete Course
                      </Button>
                      <h5 className="mt-4">Enrolled Trainees</h5>
                      <ul>
                        {course.trainees?.map((trainee, index) => (
                          <li key={index}>{trainee}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Trainer Features */}
                  {userRole === "trainer" && (
                    <div>
                      <Button variant="success" onClick={() => navigate(`/add-assignment/${id}`)}>
                        Post Assignment
                      </Button>
                      <Button variant="info" className="ms-2" onClick={() => alert("View submissions functionality coming soon!")}>
                        View Submissions
                      </Button>
                    </div>
                  )}

                  {/* Trainee Features */}
                  {userRole === "trainee" && (
                    <div>
                      <Button variant="primary" onClick={() => navigate(`/view-assignments/${id}`)}>
                        View Assignments
                      </Button>
                      <Button variant="success" className="ms-2" onClick={() => alert("Submit work functionality coming soon!")}>
                        Submit Work
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CourseDetails;
