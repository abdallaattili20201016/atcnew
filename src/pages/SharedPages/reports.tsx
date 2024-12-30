import React, { useEffect, useState } from "react";
import { Table, Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../App"; // Adjust path to your Firebase setup
import { getAuth } from "firebase/auth"; // Import Firebase Auth for the user info
import moment from "moment";

const ReportsPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<string>("trainers");

  const auth = getAuth();
  const currentUser = JSON.parse(sessionStorage.getItem("user_details") || "{}");




  
  const fetchReports = async (reportType: string) => {
    try {
      setIsLoading(true);
  
      // Restrict trainers from accessing certain reports
      if (currentUser.role === "trainer" && (reportType === "trainers" || reportType === "financial")) {
        alert("You do not have permission to view this report.");
        setIsLoading(false);
        return;
      }
  
      let querySnapshot;
  
      if (reportType === "trainers") {
        const trainersQuery = query(collection(db, "users"), where("role", "==", "trainer"));
        querySnapshot = await getDocs(trainersQuery);
        setReports(
          querySnapshot.docs.map((doc) => ({
            username: doc.data().username || "Unknown",
            createdDtm: doc.data().createdDtm ? moment(doc.data().createdDtm.toDate()).format("MMMM Do YYYY") : "N/A",
            currentCourses: doc.data().currentCourses?.length || 0,
            completedCourses: doc.data().completedCourses?.length || 0,
            rating: doc.data().rating || "N/A",
          }))
        );
      } else if (reportType === "trainees") {
        const traineesQuery = query(collection(db, "users"), where("role", "==", "trainee"));
        querySnapshot = await getDocs(traineesQuery);
        setReports(
          querySnapshot.docs.map((doc) => ({
            username: doc.data().username || "Unknown",
            createdDtm: doc.data().createdDtm ? moment(doc.data().createdDtm.toDate()).format("MMMM Do YYYY") : "N/A",
            enrolledCourses: doc.data().enrolledCourses?.length || 0,
            completedCourses: doc.data().completedCourses?.length || 0,
            averageGrade: doc.data().averageGrade || "N/A",
          }))
        );
      } else if (reportType === "financial") {
        querySnapshot = await getDocs(collection(db, "Transactions"));
        setReports(
          querySnapshot.docs.map((doc) => ({
            transactionId: doc.id,
            type: doc.data().type,
            amount: doc.data().amount,
            date: doc.data().date,
            description: doc.data().description || "N/A",
          }))
        );
      } else if (reportType === "courses") {
        querySnapshot = await getDocs(collection(db, "Courses"));
        setReports(
          querySnapshot.docs.map((doc) => ({
            title: doc.data().title,
            trainer: doc.data().trainerName || "Unknown",
            enrolledTrainees: doc.data().enrolledTrainees?.length || 0,
            status: doc.data().status || "N/A",
            startDate: doc.data().startDate || "N/A",
            endDate: doc.data().endDate || "N/A",
          }))
        );
      }
    } catch (error) {
      console.error(`Error fetching ${reportType} report:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchReports(selectedReport);
  }, [selectedReport]);

  const handleReportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReport(event.target.value);
  };

  const renderTable = () => {
    if (selectedReport === "trainers") {
      return (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Trainer Name</th>
              <th>Date Joined</th>
              <th>Number of Current Courses</th>
              <th>Number of Completed Courses</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.username}</td>
                  <td>{report.createdDtm}</td>
                  <td>{report.currentCourses}</td>
                  <td>{report.completedCourses}</td>
                  <td>{report.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Trainers Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      );
    }

    if (selectedReport === "trainees") {
      return (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Trainee Name</th>
              <th>Date Joined</th>
              <th>Number of Enrolled Courses</th>
              <th>Number of Completed Courses</th>
              <th>Average Grade</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.username}</td>
                  <td>{report.createdDtm}</td>
                  <td>{report.enrolledCourses}</td>
                  <td>{report.completedCourses}</td>
                  <td>{report.averageGrade}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Trainees Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      );
    }

    if (selectedReport === "financial") {
      return (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.transactionId}</td>
                  <td>{report.type}</td>
                  <td>{report.amount}</td>
                  <td>{report.date}</td>
                  <td>{report.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Financial Transactions Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      );
    }

    if (selectedReport === "courses") {
      return (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Trainer Name</th>
              <th>Number of Enrolled Trainees</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.title}</td>
                  <td>{report.trainer}</td>
                  <td>{report.enrolledTrainees}</td>
                  <td>{report.status}</td>
                  <td>{report.startDate}</td>
                  <td>{report.endDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No Courses Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      );
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
                <Form.Label>Select Report Type</Form.Label>
                <Form.Select value={selectedReport} onChange={handleReportChange}>
  {currentUser.role === "admin" && (
    <>
      <option value="trainers">Trainers List</option>
      <option value="financial">Financial Reports</option>
    </>
  )}
  <option value="trainees">Trainees List</option>
  <option value="courses">Courses List</option>
</Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>{isLoading ? <p>Loading...</p> : renderTable()}</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ReportsPage;
