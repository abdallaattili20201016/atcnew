import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Button, Row, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import moment from "moment";

const AnnouncementsTable = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();
  const navigate = useNavigate();

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const fetchedAnnouncements = await firebaseBackend.fetchAnnouncements();
      setAnnouncements(fetchedAnnouncements);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const columns = useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Description", accessor: "description" },
      { Header: "Created On", accessor: "createdOn" },
      { Header: "Status", accessor: "status" },
    ],
    []
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
            onClick={() => navigate("/admin-announcements/new")}
          >
            Create New Announcement
          </Button>
        </Col>
      </Row>
      </Container>
     
      <Row className="mb-4">
        <Col xl={12}>
          <Card>
            <Card.Body>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <Table responsive bordered hover>
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.accessor}>{col.Header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <tr key={announcement.id}>
                          <td>{announcement.title}</td>
                          <td>
                            {announcement.description.slice(0, 50)}...
                          </td>
                          <td>
                            {moment(
                              announcement.createdOn.toDate()
                            ).format("MMMM Do YYYY, h:mm a")}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                announcement.status === "active"
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                              }`}
                            >
                              {announcement.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No Announcements Found
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
      </div>
    </React.Fragment>
  );
};

export default AnnouncementsTable;
