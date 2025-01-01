import React, { useState } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../App"; // Adjust path to your Firebase setup
import { toast } from "react-toastify";

const AddCourses = () => {
  document.title = "Add New Course | Admin Dashboard";

  // Form validation with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
    trainerName: Yup.string().required("Trainer name is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required("End date is required"),
    status: Yup.string().required("Please select a status"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      trainerName: "",
      startDate: "",
      endDate: "",
      status: "Active",
    },
    validationSchema,
    onSubmit: async (values: { title: string; description: string; trainerName: string; startDate: string; endDate: string; status: string }, { resetForm }: { resetForm: () => void }) => {
      try {
        await addDoc(collection(db, "courses"), {
          ...values,
          students: [],
          assignments: [],
          documents: [],
          createdOn: serverTimestamp(),
        });
        toast.success("Course added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding course:", error);
        toast.error("Failed to add course. Please try again.");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2 className="my-4">Create New Course</h2>
          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <Card.Body>
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
                          <Form.Label>Trainer Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="trainerName"
                            placeholder="Enter trainer name"
                            value={formik.values.trainerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.trainerName && !!formik.errors.trainerName
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.trainerName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.startDate && !!formik.errors.startDate
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.startDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.endDate && !!formik.errors.endDate}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.endDate}
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
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.status}
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

export default AddCourses;
