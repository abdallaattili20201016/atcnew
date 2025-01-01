import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card, Col, Form, Row, Button, Modal, Spinner, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../App"; // Adjust the path to your Firebase config
import TableContainer from "../../../../Common/Tabledata/TableContainer";
import NoSearchResult from "../../../../Common/Tabledata/NoSearchResult";
import "react-toastify/dist/ReactToastify.css";

const ViewCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Courses
  const loadCourses = async (searchTerm?: string) => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "courses"));
      const coursesData = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            trainerName: data.trainerName || "",
            enrolledTrainees: data.enrolledTrainees || [],
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            status: data.status || "",
          };
        })
        .filter((course) =>
          searchTerm
            ? course.title.toLowerCase().includes(searchTerm.toLowerCase())
            : true
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

  // Handle Delete Course
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

  // Handle Search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim();
    loadCourses(searchTerm);
  };

  const columns = useMemo(
    () => [
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
        Header: "Enrolled Trainees",
        accessor: "enrolledTrainees",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.enrolledTrainees?.length || 0}</>,
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
    [navigate]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Announcements</h2>
          <Row className="mb-4">
            <Col className="text-end">
              <Button
                variant="primary"
                onClick={() => navigate("/AddCourses")}
              >
                Add New Course
              </Button>
            </Col>
          </Row>

      <Row>
        <Col className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search by Course Title"
            onChange={handleSearch}
          />
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
    </React.Fragment>
  );
};

export default ViewCourses;
