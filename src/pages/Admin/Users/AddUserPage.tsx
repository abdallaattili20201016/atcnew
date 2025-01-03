import React, { useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Form,
  Button,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { toast, Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const AddUserPage: React.FC = () => {
  document.title = "Add User";
  const navigate = useNavigate();
  const firebaseBackend = getFirebaseBackend();
  const [loader, setLoader] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const successnotify = () =>
    toast("User added successfully", {
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
      role: Yup.string().required("Please select a role"),
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
          case "auth/email-already-in-use":
            errornotify("This email is already in use.");
            break;
          case "auth/invalid-email":
            errornotify("Invalid email address.");
            break;
          case "auth/weak-password":
            errornotify("The password is too weak.");
            break;
          default:
            errornotify(error.message);
            break;
        }
      } finally {
        setLoader(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={11}>
              <div className="auth-full-page-content d-flex min-vh-100 py-sm-5 py-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100 py-0 py-xl-4">
                    <Card className="my-auto overflow-hidden">
                      <Row className="g-0">
                        <Col lg={12}>
                          <div className="p-lg-5 p-4">
                            <div className="text-center">
                              <h5 className="mb-0">Add New User</h5>
                            </div>

                            <div className="mt-4">
                              <Form
                                className="needs-validation"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  validation.handleSubmit();
                                  return false;
                                }}
                              >
                                <Form.Group
                                  className="mb-3"
                                  controlId="username"
                                >
                                  <Form.Label>
                                    Name <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="username"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.username || ""}
                                    isInvalid={
                                      validation.touched.username &&
                                      !!validation.errors.username
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {validation.errors.username}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="email"
                                >
                                  <Form.Label>
                                    Email <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.email || ""}
                                    isInvalid={
                                      validation.touched.email &&
                                      !!validation.errors.email
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {validation.errors.email}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label>Password</Form.Label>
                                  <InputGroup className="position-relative auth-pass-inputgroup">
                                    <Form.Control
                                      onPaste={(e) => e.preventDefault()}
                                      placeholder="Enter password"
                                      type={!passwordShow ? "password" : "text"}
                                      name="password"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.password || ""}
                                      isInvalid={
                                        validation.touched.password &&
                                        !!validation.errors.password
                                      }
                                    />
                                    <Button
                                      variant="link"
                                      className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                      onClick={() =>
                                        setPasswordShow(!passwordShow)
                                      }
                                    >
                                      <i className="ri-eye-fill align-middle"></i>
                                    </Button>
                                    <Form.Control.Feedback type="invalid">
                                      {validation.errors.password}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="phone">
                                  <Form.Label>Phone</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.phone || ""}
                                    isInvalid={
                                      validation.touched.phone &&
                                      !!validation.errors.phone
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {validation.errors.phone}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="city">
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter city"
                                    name="city"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.city || ""}
                                    isInvalid={
                                      validation.touched.city &&
                                      !!validation.errors.city
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {validation.errors.city}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="role">
                                  <Form.Label>Role</Form.Label>
                                  <Form.Select
                                    name="role"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.role || ""}
                                    isInvalid={
                                      validation.touched.role &&
                                      !!validation.errors.role
                                    }
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

                                <div className="mt-2">
                                  <Button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                  >
                                    {loader && (
                                      <Spinner size="sm" animation="border" />
                                    )}{" "}
                                    Add User
                                  </Button>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddUserPage;
