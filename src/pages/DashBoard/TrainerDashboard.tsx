import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { db } from "../../helpers/config";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../helpers/auth_context"; // Assuming you have an AuthContext for the current user

const TrainerDashboard = () => {
  const [courses, setCourses] = useState<{ title: string; trainees: number }[]>([]);
  const [traineeCount, setTraineeCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<
    { course: string; action: string; timestamp: string }[]
  >([]);

  const { currentUser } = useAuth(); // Get the current trainer's info

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        if (!currentUser) return;
  
        // Fetch courses assigned to the trainer using `trainer_id`
        const coursesQuery = query(
          collection(db, "courses"),
          where("trainer_id", "==", currentUser.uid) // Updated to match your database structure
        );
        const coursesSnapshot = await getDocs(coursesQuery);
  
        // Map the results to extract relevant data
        const courseData = coursesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.title, // Course title
            trainees: data.students ? data.students.length : 0, // Number of trainees
          };
        });
        setCourses(courseData);
  
        // Calculate total trainees across all courses
        const totalTrainees = courseData.reduce((sum, course) => sum + course.trainees, 0);
        setTraineeCount(totalTrainees);
  
        // Fetch recent activities for the trainer
        const activitiesQuery = query(
          collection(db, "auditLogs"),
          where("details.trainerId", "==", currentUser.uid), // Assuming trainerId is logged in auditLogs
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activities = activitiesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            course: data.details?.courseTitle || "Unknown Course", // Course name associated with the action
            action: data.action || "Unknown Action", // Action performed by the trainer
            timestamp: data.timestamp?.toDate().toLocaleString() || "Unknown Time", // Timestamp of the action
          };
        });
        setRecentActivities(activities);
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

        {/* Recent Activities Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Recent Activities</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Action</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <tr key={index}>
                          <td>{activity.course}</td>
                          <td>{activity.action}</td>
                          <td>{activity.timestamp}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3}>No recent activities</td>
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
