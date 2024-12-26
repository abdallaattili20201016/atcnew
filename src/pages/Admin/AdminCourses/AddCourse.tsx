import React, { useState } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../App";
import { getAuth } from "firebase/auth"; // Import Firebase Auth for the user info
import BreadCrumb from "../../../Common/BreadCrumb";

const AddCourse = () => {
  document.title = "Add New Course | Admin Dashboard";

  const auth = getAuth(); // Get the authenticated user
  const currentUser = auth.currentUser;

  // Form validation with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    duration: Yup.string().required("Duration is required"),
    trainer: Yup.string().required("Trainer is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      duration: "",
      trainer: "",
    },
    validationSchema,
    onSubmit: async (
      values: { title: string; description: string; duration: string; trainer: string },
      { resetForm }: { resetForm: () => void }
    ) => {
      try {
        await addDoc(collection(db, "Courses"), {
          ...values,
          createdOn: serverTimestamp(),
          createdBy: currentUser
            ? {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || "Unknown User",
              }
            : "Unknown User", // Fallback if no user is logged in
        });
        alert("Course added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding course:", error);
        alert("Failed to add course. Please try again.");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <BreadCrumb pageTitle="Add New Course" title="Courses" />

          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <Card.Body>
                  <h4 className="card-title mb-4">Add New Course</h4>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Course Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            placeholder="Enter course title"
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
                            placeholder="Enter course description"
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
                          <Form.Label>Duration</Form.Label>
                          <Form.Control
                            type="text"
                            name="duration"
                            placeholder="e.g., 4 weeks"
                            value={formik.values.duration}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.duration && !!formik.errors.duration}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.duration}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Trainer</Form.Label>
                          <Form.Control
                            type="text"
                            name="trainer"
                            placeholder="Enter trainer name"
                            value={formik.values.trainer}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.trainer && !!formik.errors.trainer}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.trainer}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button type="submit" variant="primary">
                        Add Course
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

export default AddCourse;