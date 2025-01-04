import React, { useState } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../App";
import { getAuth } from "firebase/auth"; // Import Firebase Auth for the user info
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewAnnouncement = () => {
  document.title = "New Announcement | Admin Dashboard";

  const navigate = useNavigate();
  const auth = getAuth(); // Get the authenticated user
  const currentUser = JSON.parse(sessionStorage.getItem("user_details") || '{}'); // Get the authenticated user

  // Form validation with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
     
    },
    validationSchema,
    onSubmit: async (
      values: { title: string; description: string },
      { resetForm }: { resetForm: () => void }
    ) => {
      try {
        await addDoc(collection(db, "Announcements"), {
          ...values,
          createdOn: serverTimestamp(),
          createdBy: currentUser
            ? {
                email: currentUser.email,
                displayName: currentUser.username || "Unknown User",
              }
            : { email: "unknown", displayName: "Unknown User" },
        });
        toast.success("Announcement created successfully!");
        resetForm();
        navigate("/announcements-table"); // Navigate after successful save
      } catch (error) {
        console.error("Error creating announcement:", error);
        toast.error("Failed to create announcement. Please try again.");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Create New Announcement</h2>
          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <Card.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            placeholder="Enter announcement title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.title && !!formik.errors.title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            rows={5}
                            placeholder="Enter announcement description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.description && !!formik.errors.description}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.description}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button type="submit" variant="primary">
                        Create Announcement
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewAnnouncement;
