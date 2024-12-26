import React, { useEffect, useState } from "react";
import { Table, Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../App"; // Adjust path to your Firebase setup
import { getAuth } from "firebase/auth"; // Import Firebase Auth for the user info
import moment from "moment";

const ReportsPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("all");

  const auth = getAuth();
  const currentUser = JSON.parse(sessionStorage.getItem("user_details") || "{}");

  // Load reports based on user role
  const loadReports = async () => {
    try {
      setIsLoading(true);
      let reportsQuery;

      if (currentUser.role === "admin") {
        reportsQuery = collection(db, "Reports");
      } else if (currentUser.role === "trainer") {
        reportsQuery = query(
          collection(db, "Reports"),
          where("createdBy.uid", "==", currentUser.uid)
        );
      } else {
        throw new Error("Invalid user role");
      }

      const querySnapshot = await getDocs(reportsQuery);
      const fetchedReports = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(fetchedReports);
      setFilteredReports(fetchedReports); // Initially, show all reports
    } catch (error) {
      console.error("Error loading reports:", error);
      alert("Failed to load reports. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Handle filter changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setFilterType(selectedFilter);

    if (selectedFilter === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((report) => report.type === selectedFilter));
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Reports</h2>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Report Type</Form.Label>
                <Form.Select value={filterType} onChange={handleFilterChange}>
                  <option value="all">All Reports</option>
                  <option value="course-performance">Course Performance</option>
                  <option value="trainee-progress">Trainee Progress</option>
                  <option value="trainer-activity">Trainer Activity</option>
                  <option value="assignment-submission">Assignment Submission</option>
                  <option value="feedback">Feedback</option>
                  <option value="enrollment">Enrollment</option>
                  <option value="attendance">Attendance</option>
                  <option value="certification">Certification</option>
                  <option value="financial">Financial</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* <Col className="text-end">
              <Button variant="primary">Add New Report</Button>
            </Col> */}
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <Table responsive bordered hover>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Created On</th>
                          <th>Created By</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.length > 0 ? (
                          filteredReports.map((report) => (
                            <tr key={report.id}>
                              <td>{report.title}</td>
                              <td>{report.type}</td>
                              <td>
                                {report.createdOn
                                  ? moment(report.createdOn.toDate()).format(
                                      "MMMM Do YYYY, h:mm a"
                                    )
                                  : "N/A"}
                              </td>
                              <td>
                                {report.createdBy && typeof report.createdBy === "object"
                                  ? report.createdBy.displayName || report.createdBy.email
                                  : "Unknown User"}
                              </td>
                              <td>
                                {report.description.length > 50
                                  ? `${report.description.slice(0, 50)}...`
                                  : report.description}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">
                              No Reports Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
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

export default ReportsPage;
