import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { db } from "../../helpers/config";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../helpers/auth_context";

// Add the Submission type
type Submission = {
  course: string;
  studentName: string;
  assignmentTitle: string;
  timestamp: string;
};

const TrainerDashboard = () => {
  const [courses, setCourses] = useState<{ id: string; title: string; trainees: number }[]>([]);
  const [traineeCount, setTraineeCount] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]); // Update state type

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        if (!currentUser) return;

        // Fetch courses assigned to the trainer
        const coursesQuery = query(
          collection(db, "courses"),
          where("trainer_id", "==", currentUser.uid)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const courseData = coursesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            trainees: data.students ? data.students.length : 0,
          };
        });
        setCourses(courseData);

        // Calculate total trainees
        const totalTrainees = courseData.reduce((sum, course) => sum + course.trainees, 0);
        setTraineeCount(totalTrainees);

        // Fetch recent student submissions
        const submissions: Submission[] = [];
        for (const course of courseData) {
          const courseSubmissionsQuery = query(
            collection(db, `courses/${course.id}/submissions`),
            orderBy("timestamp", "desc"),
            limit(5)
          );
          const submissionsSnapshot = await getDocs(courseSubmissionsQuery);
          submissionsSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            submissions.push({
              course: course.title,
              studentName: data.studentName,
              assignmentTitle: data.assignmentTitle,
              timestamp: data.timestamp?.toDate().toLocaleString() || "Unknown Time",
            });
          });
        }
        setRecentSubmissions(submissions);
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      }
    };

    fetchTrainerData();
  }, [currentUser]);

  return (
    <div className="page-content">
      <Container fluid>
        <h2 className="my-4">Trainer Dashboard</h2>

        {/* Statistics Section */}
        <Row>
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-book fs-40 text-primary"></i>
                <h5 className="mt-3">Courses Assigned</h5>
                <h2 className="mb-0">{courses.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-users fs-40 text-success"></i>
                <h5 className="mt-3">Trainees</h5>
                <h2 className="mb-0">{traineeCount}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Assigned Courses Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Assigned Courses</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Number of Trainees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <tr key={index}>
                          <td>{course.title}</td>
                          <td>{course.trainees}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>No courses assigned</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Submissions Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Recent Submissions</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Student</th>
                      <th>Assignment</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.length > 0 ? (
                      recentSubmissions.map((submission, index) => (
                        <tr key={index}>
                          <td>{submission.course}</td>
                          <td>{submission.studentName}</td>
                          <td>{submission.assignmentTitle}</td>
                          <td>{submission.timestamp}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>No submissions available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TrainerDashboard;
