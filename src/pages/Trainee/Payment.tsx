import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Table } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../App";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Payment = () => {
  document.title = "Payment | Trainee Dashboard";

  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPayments, setShowPayments] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const currentUser = JSON.parse(sessionStorage.getItem("user_details") || "{}");

  // Fetch payment history
  const fetchPayments = async () => {
    if (!currentUser.uid) {
      toast.error("Unable to fetch payments. Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      const paymentsQuery = query(
        collection(db, "Payments"),
        where("traineeId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(paymentsQuery);
      const fetchedPayments = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          price: data.price,
          courseName: data.courseName,
          paymentDate: data.paymentDate,
        };
      });
      setPayments(fetchedPayments);

      // Calculate total amount
      const total = fetchedPayments.reduce((sum, payment) => sum + payment.price, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment history.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xxl={8} xl={10}>
              <Card>
                <Card.Body>
                  <h2 className="card-title text-center mb-4">Payment Instructions</h2>
                  <p>
                    To proceed with your payment for the academic training center, please follow the
                    instructions below. All payments should be made using <strong>CLIQ</strong>.
                  </p>
                  <h4 className="mt-4">Payment Details:</h4>
                  <ul>
                    <li>
                      <strong>Account Name:</strong> ACTPAYMENT
                    </li>
                    <li>
                      <strong>Payment Platform:</strong> CLIQ
                    </li>
                  </ul>
                  <h4 className="mt-4">Important Notes:</h4>
                  <ul>
                    <li>
                      Ensure that the payment details are correct before completing the transaction.
                    </li>
                    <li>
                      After making the payment, please provide proof of payment (e.g., a screenshot or transaction ID) to the training center administration for verification.
                    </li>
                  </ul>
                  <div className="text-center mt-4">
                    <Button variant="secondary" onClick={() => { setShowPayments(!showPayments); fetchPayments(); }}>
                      {showPayments ? "Hide Past Payments" : "View Past Payments"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {showPayments && (
                <Card className="mt-4">
                  <Card.Body>
                    <h3 className="mb-4">Past Payments</h3>
                    {isLoading ? (
                      <p>Loading payment history...</p>
                    ) : payments.length > 0 ? (
                      <Table responsive bordered hover>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Course</th>
                            <th>Price ($)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td>
                                {moment(payment.paymentDate.toDate()).format(
                                  "MMMM Do YYYY, h:mm a"
                                )}
                              </td>
                              <td>{payment.courseName}</td>
                              <td>{payment.price}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={2} className="text-end">
                              <strong>Total</strong>
                            </td>
                            <td>
                              <strong>${totalAmount}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted">No payment history found.</p>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Payment;
