import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { db } from "../../helpers/config";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../helpers/auth_context"; // Assuming you have an AuthContext for the current user

const TraineeDashboard = () => {
  const [courses, setCourses] = useState<{ title: string; start: string; end: string }[]>([]);
  const [announcements, setAnnouncements] = useState<{ title: string; description: string }[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState(0);

  const { currentUser } = useAuth(); // Get the current trainee's info

  useEffect(() => {
    const fetchTraineeData = async () => {
      try {
        if (!currentUser) return;

        // Fetch enrolled courses
        const coursesQuery = query(
          collection(db, "courses"),
          where("students", "array-contains", currentUser.uid)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const courseData = coursesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.title,
            start: data.start.toDate().toLocaleDateString(),
            end: data.end.toDate().toLocaleDateString(),
          };
        });
        setCourses(courseData);

        // Fetch completed assignments (from course documents)
        let totalCompletedAssignments = 0;
        coursesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.submits) {
            const completed = data.submits.filter(
              (submit: { studentId: string; completed: boolean }) =>
                submit.studentId === currentUser.uid && submit.completed
            );
            totalCompletedAssignments += completed.length;
          }
        });
        setCompletedAssignments(totalCompletedAssignments);

        // Fetch recent announcements
        const announcementsQuery = query(
          collection(db, "Announcements"),
          where("status", "==", "active"),
          orderBy("createdOn", "desc"),
          limit(5)
        );
        const announcementsSnapshot = await getDocs(announcementsQuery);
        const announcementsData = announcementsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.title,
            description: data.description,
          };
        });
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Error fetching trainee data:", error);
      }
    };

    fetchTraineeData();
  }, [currentUser]);

  return (
    <div className="page-content">
      <Container fluid>
        <h2 className="my-4">Trainee Dashboard</h2>

        {/* Statistics Section */}
        <Row>
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-book fs-40 text-primary"></i>
                <h5 className="mt-3">Courses Enrolled</h5>
                <h2 className="mb-0">{courses.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-check-circle fs-40 text-success"></i>
                <h5 className="mt-3">Assignments Completed</h5>
                <h2 className="mb-0">{completedAssignments}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Enrolled Courses Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Enrolled Courses</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <tr key={index}>
                          <td>{course.title}</td>
                          <td>{course.start}</td>
                          <td>{course.end}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3}>No courses enrolled</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Announcements Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Recent Announcements</h4>
                <ul className="list-group">
                  {announcements.length > 0 ? (
                    announcements.map((announcement, index) => (
                      <li className="list-group-item" key={index}>
                        <strong>{announcement.title}</strong>: {announcement.description}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No announcements available</li>
                  )}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TraineeDashboard;
