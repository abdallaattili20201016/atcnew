import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import "react-toastify/dist/ReactToastify.css";
import { toast, Slide, ToastContainer } from "react-toastify";
import "./AddUserPage.css"; // Custom CSS file for additional styling

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const firebaseBackend = getFirebaseBackend();
  const [loader, setLoader] = useState<boolean>(false);

  const successnotify = () =>
    toast("Your application was successfully sent", {
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: false,
      className: "bg-success text-white",
      transition: Slide,
    });

  const errornotify = (message: string) =>
    toast(`Error! ${message}`, {
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: false,
      className: "bg-danger text-white",
      transition: Slide,
    });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      username: "",
      password: "",
      phone: "",
      city: "",
      role: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Email"),
      username: Yup.string().required("Please Enter Username"),
      password: Yup.string()
        .required("Please Enter Password")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      phone: Yup.string()
        .required("Please Enter Phone Number")
        .matches(/^[0-9]+$/, "Phone number must only contain numbers")
        .min(10, "Phone number must be at least 10 digits"),
      city: Yup.string().required("Please Enter City"),
      role: Yup.string().required("Please select the role Register"),
    }),
    onSubmit: async (values: any) => {
      setLoader(true);
      try {
        const response = await firebaseBackend.registerUser(
          values.email,
          values.password
        );

        if (response) {
          await firebaseBackend.addNewUserToFirestore(values);
          successnotify();
          navigate("/users");
        }
      } catch (error: any) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errornotify("This email is already in use.");
            break;
          case 'auth/invalid-email':
            errornotify("Invalid email address.");
            break;
          case 'auth/weak-password':
            errornotify("The password is too weak.");
            break;
          case 'auth/operation-not-allowed':
            errornotify("Email/password accounts are not enabled.");
            break;
          case 'auth/too-many-requests':
            errornotify("Too many requests. Please try again later.");
            break;
          case 'auth/network-request-failed':
            errornotify("Network error. Please check your connection.");
            break;
          case 'auth/internal-error':
            errornotify("An internal error occurred. Please try again.");
            break;
          default:
            errornotify(error.message); // Display the actual error message
            break;
        }
      } finally {
        setLoader(false);
      }
    },
  });

  return (
    <Container className="d-flex align-items-center justify-content-center add-user-container">
      <Row className="w-100 justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg border-0 add-user-card">
            <Card.Header className="text-center add-user-card-header">
              <h4 className="mb-0">Add User</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={validation.handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter name"
                    value={validation.values.username}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    isInvalid={!!validation.errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={validation.values.email}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    isInvalid={!!validation.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={validation.values.password}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    isInvalid={!!validation.errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={validation.values.phone}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    isInvalid={!!validation.errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="city" className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={validation.values.city}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    isInvalid={!!validation.errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.city}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="role" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={validation.values.role}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    isInvalid={!!validation.errors.role}
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="trainer">Trainer</option>
                    <option value="trainee">Trainee</option>
                    <option value="user">User</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.role}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-end">
                  <Button type="submit" variant="primary" className="submit-btn">
                    {loader && <Spinner size="sm" animation="border" />} Add User
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default AddUserPage;