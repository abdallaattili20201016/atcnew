import React, { useEffect, useState } from "react";
import { Container, Spinner, Table, Button, Card } from "react-bootstrap";
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
import { toast } from "react-toastify";

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
        toast.error("Failed to fetch enrollment requests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (request: EnrollmentRequest) => {
    if (!window.confirm(`Are you sure you want to accept ${request.traineeName}'s request?`)) {
      return;
    }

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
      toast.success("Request accepted successfully!");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept the request.");
    }
  };

  const handleRejectRequest = async (request: EnrollmentRequest) => {
    if (!window.confirm(`Are you sure you want to reject ${request.traineeName}'s request?`)) {
      return;
    }

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
      toast.success("Request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject the request.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white text-center">
            <h2>Enrollment Requests</h2>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : requests.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead className="table-primary">
                  <tr>
                    <th>Course</th>
                    <th>Trainee</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.courseTitle}</td>
                      <td>{request.traineeName}</td>
                      <td>
                        <span className="badge bg-warning text-dark">{request.status}</span>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAcceptRequest(request)}
                          className="me-2"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectRequest(request)}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center my-5">
                <p className="text-muted">No pending enrollment requests.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EnrollmentRequests;
