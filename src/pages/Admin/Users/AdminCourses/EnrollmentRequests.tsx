import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { db } from "../../../../helpers/config";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useAuth } from "../../../../helpers/auth_context";
import { fetchUserNameById } from "../../../../helpers/firebase_helper";
import moment from "moment";

type EnrollmentRequest = {
  id: string;
  traineeId: string;
  courseId: string;
  courseTitle: string;
  status: string;
  traineeName?: string;
};

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, "enrollmentRequests"), where("status", "==", "pending"));
        const snapshot = await getDocs(q);
        const requestData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EnrollmentRequest[];

        // Fetch trainee names for each request
        const updatedRequests = await Promise.all(
          requestData.map(async (request) => {
            const traineeName = await fetchUserNameById(request.traineeId);
            return {
              ...request,
              traineeName,
            };
          })
        );

        setRequests(updatedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (request: EnrollmentRequest) => {
    try {
      const courseRef = doc(db, "courses", request.courseId);
      await updateDoc(courseRef, {
        students: arrayUnion(request.traineeId),
      });

      const requestRef = doc(db, "enrollmentRequests", request.id);
      await updateDoc(requestRef, { status: "accepted" });

      await addDoc(collection(db, "auditLogs"), {
        action: "Accept Enrollment Request",
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        details: {
          courseId: request.courseId,
          courseTitle: request.courseTitle,
          traineeId: request.traineeId,
          traineeName: request.traineeName,
        },
      });

      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async (request: EnrollmentRequest) => {
    try {
      const requestRef = doc(db, "enrollmentRequests", request.id);
      await deleteDoc(requestRef);

      await addDoc(collection(db, "auditLogs"), {
        action: "Reject Enrollment Request",
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        details: {
          courseId: request.courseId,
          courseTitle: request.courseTitle,
          traineeId: request.traineeId,
          traineeName: request.traineeName,
        },
      });

      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };



  return (
    <div className="page-content">
      <Container fluid>
        <h3>Enrollment Requests</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Course</th>
                <th>Trainee</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.courseTitle}</td>
                    <td>{request.traineeName}</td>
                    <td>{request.status}</td>
                    <td>{moment().format("YYYY-MM-DD HH:mm")}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="success"
                        className="ms-2"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleRejectRequest(request)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No Pending Requests
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <p>
                <strong>Course:</strong> {selectedRequest.courseTitle}
              </p>
              <p>
                <strong>Trainee:</strong> {selectedRequest.traineeName}
              </p>
              <p>
                <strong>Status:</strong> {selectedRequest.status}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnrollmentRequests;
