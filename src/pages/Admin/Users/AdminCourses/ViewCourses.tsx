import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Modal,
  Spinner,
  Container,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../App"; // Adjust the path to your Firebase config
import TableContainer from "../../../../Common/Tabledata/TableContainer";
import NoSearchResult from "../../../../Common/Tabledata/NoSearchResult";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ViewCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "courses"));
      const coursesData = await Promise.all(
        snapshot.docs.map(async (courseDoc) => {
          const courseData = courseDoc.data();
          const trainerRef = doc(db, "users", courseData.trainer_id);
          const trainerDoc = await getDoc(trainerRef);
          const trainerData =
            (trainerDoc.data() as { displayName?: string; email?: string }) || {};
          const trainerName =
            trainerDoc.exists() ? trainerData.displayName || trainerData.email : "N/A";

          const enrolledTrainees = Array.isArray(courseData.students)
            ? courseData.students
            : [];

          return {
            id: courseDoc.id,
            title: courseData.title || "",
            trainerName,
            enrolledTrainees,
            startDate: courseData.startDate || "",
            endDate: courseData.endDate || "",
            status: courseData.status || "",
            location: courseData.location || "N/A",
          };
        })
      );

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
      await deleteDoc(doc(db, "courses", courseId));
      toast.success("Course deleted successfully.");
      loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const handleEditCourse = (course: any) => {
    setCurrentCourse(course);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!currentCourse) return;

    try {
      const courseRef = doc(db, "courses", currentCourse.id);
      await updateDoc(courseRef, {
        title: currentCourse.title,
        startDate: currentCourse.startDate,
        endDate: currentCourse.endDate,
        status: currentCourse.status,
        location: currentCourse.location,
      });
      toast.success("Course updated successfully.");
      setShowEditModal(false);
      loadCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course. Please try again.");
    }
  };

  const columns = [
    {
      Header: "Course Title",
      accessor: "title",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => <>{cell.row.original.title}</>,
    },
    {
      Header: "Trainer",
      accessor: "trainerName",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => <>{cell.row.original.trainerName || "N/A"}</>,
    },
    {
      Header: "Location",
      accessor: "location",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => <>{cell.row.original.location || "N/A"}</>,
    },
    {
      Header: "Enrolled Trainees",
      accessor: "enrolledTrainees",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => <>{cell.row.original.enrolledTrainees.length || 0}</>,
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => <>{cell.row.original.startDate || "N/A"}</>,
    },
    {
      Header: "End Date",
      accessor: "endDate",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => <>{cell.row.original.endDate || "N/A"}</>,
    },
    {
      Header: "Status",
      accessor: "status",
      Filter: false,
      isSortable: true,
      Cell: (cell: any) => (
        <span
          className={`badge ${
            cell.row.original.status === "Active"
              ? "bg-success-subtle text-success"
              : "bg-warning-subtle text-warning"
          }`}
        >
          {cell.row.original.status}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Filter: false,
      isSortable: false,
      Cell: (cell: any) => (
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="info"
            onClick={() => handleEditCourse(cell.row.original)}
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
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">View Courses</h2>
          <Row className="mb-4">
            <Col className="text-end">
              <Button variant="primary" onClick={() => navigate("/AddCourses")}>
                Add New Course
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  {isLoading ? (
                    <div className="text-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : courses.length > 0 ? (
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={courses || []}
                      customPageSize={9}
                      divClassName="table-card table-responsive"
                      tableClass="table-hover table-nowrap align-middle mb-0"
                      isBordered={false}
                      PaginationClass="align-items-center mt-4 gy-3"
                    />
                  ) : (
                    <NoSearchResult
                      title1="No Courses Found"
                      title2="Try adjusting your search or adding a new course."
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </Container>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCourse && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Course Title</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCourse.title}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentCourse.startDate}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentCourse.endDate}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, endDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={currentCourse.status}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCourse.location}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, location: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ViewCourses;
