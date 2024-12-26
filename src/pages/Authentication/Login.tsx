import React, { useState, useEffect } from "react";
import withRouter from "../../Common/withRouter";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import logoDark from "../../assets/images/logo-dark.png";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Slide, ToastContainer } from "react-toastify";
import { getFirebaseBackend } from "../../helpers/firebase_helper";

const Login = () => {
  document.title = "Login";

  const [loading, setLoading] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const firebaseBackend = getFirebaseBackend();
  const navigate = useNavigate();

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values: any) => {
      try {
        const result = await firebaseBackend.loginUser(
          values.email,
          values.password
        );
        if (result) {
          const user = await firebaseBackend.getUserDetailsByUid(
            firebaseBackend.uuid
          );
          sessionStorage.setItem("user_details", JSON.stringify(user));

          if (user.status === 0) {
            toast.warning("Please wait until admin approves your account");
            await firebaseBackend.logout();
            return;
          }
          if (user.role === "trainer" || user.role === "trainee" || user.role === "admin") {
            navigate("/dashboard");
            return;
          }

          toast.success("Login Successfully");
        }
      } catch (error) {
        toast.error("Incorrect Email or Password.");
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
                    <div className="text-center mb-5">
                      <Link to="/">
                        <span className="logo-lg">
                          <img src={logoDark} alt="" height="300" width="543" />
                        </span>
                      </Link>
                    </div>

                    <Card className="my-auto overflow-hidden">
                      <Row className="g-0">
                        <Col lg={12}>
                          <Card.Body className="p-lg-5 p-4">
                            <div className="text-center">
                              <h5 className="mb-0">Welcome Back!</h5>
                              <p className="text-muted mt-2">
                                Sign in to continue to Academic Training Center.
                              </p>
                            </div>

                            <div className="mt-4">
                              <Form
                                action="#"
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
                                  <Form.Label>Email</Form.Label>
                                  <div className="position-relative">
                                    <Form.Control
                                      type="email"
                                      name="email"
                                      id="email"
                                      className="form-control bg-light border-light password-input"
                                      placeholder="Enter email"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.email || ""}
                                      isInvalid={
                                        validation.touched.email &&
                                        validation.errors.email
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.email &&
                                    validation.errors.email ? (
                                      <Form.Control.Feedback type="invalid">
                                        {validation.errors.email}
                                      </Form.Control.Feedback>
                                    ) : null}
                                  </div>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="password-input"
                                >
                                  <div className="float-end">
                                    <Link
                                      to="/forgot-password"
                                      className="text-muted"
                                    >
                                      Forgot password?
                                    </Link>
                                  </div>
                                  <Form.Label>
                                    Password{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="position-relative auth-pass-inputgroup mb-3">
                                    <Form.Control
                                      type={passwordShow ? "text" : "password"}
                                      name="password"
                                      className="form-control bg-light border-light pe-5 password-input"
                                      placeholder="Enter password"
                                      value={validation.values.password || ""}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      isInvalid={
                                        validation.touched.password &&
                                        validation.errors.password
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.password &&
                                    validation.errors.password ? (
                                      <Form.Control.Feedback type="invalid">
                                        {validation.errors.password}
                                      </Form.Control.Feedback>
                                    ) : null}
                                    <button
                                      className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                      type="button"
                                      id="password-addon"
                                      title="Show/Hide Password"
                                      onClick={() =>
                                        setPasswordShow(!passwordShow)
                                      }
                                    >
                                      <i className="ri-eye-fill align-middle"></i>
                                    </button>
                                  </div>
                                </Form.Group>

                                <div className="mt-2">
                                  <Button
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                                    type="submit"
                                    disabled={loading}
                                  >
                                    {loading && (
                                      <Spinner
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        className="me-2"
                                      />
                                    )}
                                    Sign In
                                  </Button>
                                </div>

                                <div className="mt-4 text-center">
                                  <div className="signin-other-title">
                                    <h5 className="fs-15 mb-3 title">Sign in with</h5>
                                  </div>
                                </div>

                                <div className="mt-4 text-center">
                                  <p className="mb-0">
                                    Don't have an account ?{" "}
                                    <Link
                                      to="/register"
                                      className="fw-medium text-primary text-decoration-underline"
                                    >
                                      {" "}
                                      Signup now{" "}
                                    </Link>{" "}
                                  </p>
                                </div>
                              </Form>
                            </div>
                          </Card.Body>
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
    </React.Fragment>
  );
};

export default withRouter(Login);