import React, { useState } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../App";
import { getAuth } from "firebase/auth"; // Import Firebase Auth for the user info
import { toast } from "react-toastify";

const NewAnnouncement = () => {
  document.title = "New Announcement | Admin Dashboard";

  const auth = getAuth(); // Get the authenticated user
  //const currentUser = auth.currentUser;
  
  const currentUser = JSON.parse(sessionStorage.getItem("user_details") || '{}'); // Get the authenticated user

  // Form validation with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Please select a status"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      status: "active",
    },
    validationSchema,
    onSubmit: async (
      values: { title: string; description: string; status: string },
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
          : {  email: "unknown", displayName: "Unknown User" }
        
        });
        toast.success("Announcement created successfully!");
        resetForm();
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


          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <Card.Body>
                  <h4 className="card-title mb-4">Create New Announcement</h4>
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
                            isInvalid={
                              formik.touched.description && !!formik.errors.description
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.description}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.status && !!formik.errors.status}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.status}
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
