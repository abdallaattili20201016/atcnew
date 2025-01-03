import React, { useEffect, useState } from "react";
import { Form, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCourses = () => {
  document.title = "Add New Course";

  const [trainers, setTrainers] = useState<any[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState<boolean>(true);

  // Fetch trainers from Firestore
  const fetchTrainers = async () => {
    try {
      setLoadingTrainers(true);
      const snapshot = await getDocs(collection(db, "users")); // Assuming trainers are in the 'users' collection
      const trainersList = snapshot.docs
        .map((doc) => {
          const data = doc.data() as { id: string; role: string; displayName?: string; email: string };
          const { id, ...rest } = data;
          return { id: doc.id, ...rest };
        })
        .filter((user) => user.role === "trainer"); // Filter users with role 'trainer'
      setTrainers(trainersList);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast.error("Failed to load trainers. Please try again.");
    } finally {
      setLoadingTrainers(false);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Form validation with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
    trainer_id: Yup.string().required("Trainer is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required("End date is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a positive number"),
    location: Yup.string().required("Location is required"),
    status: Yup.string().required("Please select a status"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      trainer_id: "",
      startDate: "",
      endDate: "",
      price: "",
      location: "",
      status: "Active",
    },
    validationSchema,
    onSubmit: async (
      values: {
        title: string;
        description: string;
        trainer_id: string;
        startDate: string;
        endDate: string;
        price: number;
        location: string;
        status: string;
      },
      { resetForm }: { resetForm: () => void }
    ) => {
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
        navigate("/ViewCourses");
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
                            isInvalid={formik.touched.description && !!formik.errors.description}
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
                          {loadingTrainers ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <Form.Select
                              name="trainer_id"
                              value={formik.values.trainer_id}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={formik.touched.trainer_id && !!formik.errors.trainer_id}
                            >
                              <option value="">Select Trainer</option>
                              {trainers.map((trainer) => (
                                <option key={trainer.id} value={trainer.id}>
                                  {trainer.displayName || trainer.email}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.trainer_id}
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
                            isInvalid={formik.touched.startDate && !!formik.errors.startDate}
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
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            placeholder="Enter course price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.price && !!formik.errors.price}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.price}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            placeholder="Enter course location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.location && !!formik.errors.location}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.location}
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
