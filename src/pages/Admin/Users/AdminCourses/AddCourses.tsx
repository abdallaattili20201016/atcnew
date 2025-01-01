import React, { useState } from "react";
import { Card, Col, Container, Row, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { collection, addDoc } from "firebase/firestore";
import "firebase/storage";
import { db } from "../../../App"
import { toast, ToastContainer } from "react-toastify";

const AddCourses = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useFormik({
    initialValues: {
      title: "",
      description: "",
      trainerName: "",
      startDate: "",
      endDate: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Title"),
      description: Yup.string().required("Please Enter Description"),
      trainerName: Yup.string().required("Please Enter Trainer Name"),
      startDate: Yup.date().required("Please Enter Start Date"),
      endDate: Yup.date().min(
        Yup.ref("startDate"),
        "End date must be after start date"
      ),
    }),
    onSubmit: async (values: { title: string; description: string; trainerName: string; startDate: string; endDate: string; status: string }) => {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, "Courses"), values);
        toast.success("Course added successfully");
        navigate("/view-courses");
      } catch (error) {
        console.error("Error adding course:", error);
        toast.error("Failed to add course.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h1 className="mb-4">Add New Course</h1>
              <Form onSubmit={validation.handleSubmit}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course title"
                    {...validation.getFieldProps("title")}
                    isInvalid={!!validation.errors.title && validation.touched.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter course description"
                    {...validation.getFieldProps("description")}
                    isInvalid={!!validation.errors.description && validation.touched.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="trainerName">
                  <Form.Label>Trainer Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter trainer name"
                    {...validation.getFieldProps("trainerName")}
                    isInvalid={!!validation.errors.trainerName && validation.touched.trainerName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.trainerName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...validation.getFieldProps("startDate")}
                    isInvalid={!!validation.errors.startDate && validation.touched.startDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...validation.getFieldProps("endDate")}
                    isInvalid={!!validation.errors.endDate && validation.touched.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size="sm" animation="border" /> : "Add Course"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddCourses;
