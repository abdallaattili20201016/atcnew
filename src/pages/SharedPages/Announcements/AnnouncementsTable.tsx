import React, { useEffect, useState } from "react";
import { Card, Col, Row, Table, Container, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../App"; // Adjust path to your Firebase setup
import moment from "moment";

const AnnouncementsTable = () => {
  document.title = "Announcements";

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const navigate = useNavigate();

  // Assuming role is stored in sessionStorage for role-based permissions
  const currentUser = JSON.parse(sessionStorage.getItem("user_details") || "{}");
  const isAdmin = currentUser.role === "admin";
  const isTrainer = currentUser.role === "trainer";

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

  const handleDeleteAnnouncement = async (id: string) => {
    if (!isAdmin) return; // Only admin can delete
    try {
      await deleteDoc(doc(db, "Announcements", id));
      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleViewAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
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
              {(isAdmin || isTrainer) && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/admin-announcements/new")}
                >
                  Create New Announcement
                </Button>
              )}
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
                          <th>Created By</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.length > 0 ? (
                          announcements.map((announcement) => (
                            <tr key={announcement.id}>
                              <td>{announcement.title}</td>
                              <td>
                                {announcement.description.length > 30
                                  ? `${announcement.description.slice(0, 30)}...`
                                  : announcement.description}
                              </td>
                              <td>
                                {announcement.createdBy && typeof announcement.createdBy === "object"
                                  ? announcement.createdBy.displayName || announcement.createdBy.email
                                  : "Unknown User"}
                              </td>
                              <td>
                                {announcement.createdOn
                                  ? moment(announcement.createdOn.toDate()).format(
                                      "MMMM Do YYYY, h:mm a"
                                    )
                                  : "N/A"}
                              </td>

                              <td>
                                <ul className="list-inline hstack gap-2 mb-0">
                                  <li
                                    className="list-inline-item view"
                                    onClick={() => handleViewAnnouncement(announcement)}
                                  >
                                    <Link
                                      to="#"
                                      className="btn btn-soft-secondary btn-sm arrow-none d-inline-flex align-items-center"
                                    >
                                      <i className="las la-eye fs-18 align-middle text-muted"></i>
                                    </Link>
                                  </li>
                                  {isAdmin && (
                                    <li
                                      className="list-inline-item delete"
                                      onClick={() =>
                                        handleDeleteAnnouncement(announcement.id)
                                      }
                                    >
                                      <Link
                                        to="#"
                                        className="btn btn-soft-danger btn-sm d-inline-block"
                                        title="Delete Announcement"
                                      >
                                        <i className="las la-trash fs-17 align-middle"></i>
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">
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

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Announcement Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAnnouncement && (
            <>
              <h4>{selectedAnnouncement.title}</h4>
              <p>{selectedAnnouncement.description}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default AnnouncementsTable;
