import React, { useEffect, useState, useMemo } from "react";
import { Table, Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "firebase/storage";
import { db } from "../../../App" // Adjust the import path as needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "Courses"));
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, "Courses", courseId));
      toast.success("Course deleted successfully.");
      loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Trainer", accessor: "trainerName" },
      { Header: "Enrolled Trainees", accessor: "enrolledTrainees" },
      { Header: "Start Date", accessor: "startDate" },
      { Header: "End Date", accessor: "endDate" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Action",
        accessor: "action",
        Cell: (cell: any) => (
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="info"
              onClick={() => navigate(`/edit-course/${cell.row.original.id}`)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteCourse(cell.row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Container fluid>
      <Row className="py-4">
        <Col>
          <h1>View Courses</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => navigate("/add-course")}>
            Add New Course
          </Button>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : courses.length > 0 ? (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.Header}>{col.Header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.title}</td>
                    <td>{course.trainerName}</td>
                    <td>{course.enrolledTrainees?.length || 0}</td>
                    <td>{course.startDate}</td>
                    <td>{course.endDate}</td>
                    <td>{course.status}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => navigate(`/edit-course/${course.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No courses found.</p>
          )}
        </Card.Body>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default ViewCourses;
