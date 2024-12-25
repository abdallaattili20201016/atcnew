import React, { useEffect, useState } from "react";
import { Card, Col, Button, Row, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../App"; // Adjust path to your Firebase setup
import moment from "moment";

const AnnouncementsTable = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "Announcements"));
      const fetchedAnnouncements = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(fetchedAnnouncements);
    } catch (error) {
      console.error("Error loading announcements:", error);
      alert("Failed to load announcements. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

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
                          <th>Description</th>
                          <th>Created On</th>
                          <th>Status</th>
                          <th>Created By</th> {/* New column */}
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.length > 0 ? (
                          announcements.map((announcement) => (
                            <tr key={announcement.id}>
                              <td>{announcement.title}</td>
                              <td>
                                {announcement.description.length > 50
                                  ? `${announcement.description.slice(0, 50)}...`
                                  : announcement.description}
                              </td>
                              <td>
                                {announcement.createdOn
                                  ? moment(announcement.createdOn.toDate()).format(
                                      "MMMM Do YYYY, h:mm a"
                                    )
                                  : "N/A"}
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
                              <td>
  {announcement.createdBy && typeof announcement.createdBy === "object"
    ? announcement.createdBy.displayName || announcement.createdBy.email
    : "Unknown User"}
</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AnnouncementsTable;
