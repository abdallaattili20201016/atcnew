import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../App"; // Adjust path to your Firebase setup

type Report = {
  id: string;
  name: string;
  jobTitle: string;
  date: string;
  status: string;
};

const AdminReports = () => {
  document.title = "Admin Reports";

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async (reportType: string) => {
    setLoading(true);
    try {
      const reportsCollection = collection(db, "Reports");
      const reportsQuery = query(reportsCollection, where("type", "==", reportType));
      const querySnapshot = await getDocs(reportsQuery);

      const reports = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];

      setData(reports);
      setSelectedReport(reportType); // Set the selected report type
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (data.length === 0) {
      return <p>No data available for the selected report.</p>;
    }

    return (
      <Table className="table-borderless align-middle table-nowrap mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Job Title</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.jobTitle}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Reports</h2>
          <Row className="mb-4">
            <Col md={3}>
              <Button
                variant="primary"
                onClick={() => fetchReports("trainers")}
                className="w-100"
              >
                Trainers List
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="primary"
                onClick={() => fetchReports("trainees")}
                className="w-100"
              >
                Trainees List
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="primary"
                onClick={() => fetchReports("courses")}
                className="w-100"
              >
                Courses List
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="primary"
                onClick={() => fetchReports("financial")}
                className="w-100"
              >
                Financial Report
              </Button>
            </Col>
          </Row>

          {/* Render the table or show a message */}
          {selectedReport ? (
            <div>
              <h3>{selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report</h3>
              {renderTable()}
            </div>
          ) : (
            <p>Please select a report to view the data.</p>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AdminReports;
