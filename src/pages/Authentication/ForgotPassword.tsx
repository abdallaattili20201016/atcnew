import React from "react";
import logoDark from "../../assets/images/logo-dark.png";
import { Col, Container, Row, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Slide, ToastContainer } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = (props: any) => {
  document.title = "Forgot Password";
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please Enter Your Email"),
    }),
    onSubmit: async (values: any) => {
      const auth = getAuth();
      const { email } = values;

      try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Reset Email Sent Successfully", { autoClose: 2000 });
      } catch (error: any) {
        toast.error(`Failed to send reset email: ${error.message}`);
      }
    },
  });

  document.title = "Forgot Password";

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
                          <img src={logoDark} alt="" height="45" width="180" />
                        </span>
                      </Link>
                    </div>

                    <Card className="my-auto overflow-hidden">
                      <Row className="g-0">
                        <Col lg={12}>
                          <div className="p-lg-5 p-4">
                            <div className="text-center">
                              <h5 className="mb-0">Forgot Password?</h5>
                              <p className="text-muted mt-2">
                                Reset password
                              </p>
                            </div>

                            <div className="text-center my-5">
                              <div
                                className="alert alert-borderless alert-warning text-center mb-2 mx-2"
                                role="alert"
                              >
                                Enter your email and a reset email will be sent
                                to you!
                              </div>
                            </div>

                            <div className="mt-4">
                              <Form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  validation.handleSubmit();
                                  return false;
                                }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Email</Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    className="form-control bg-light border-light password-input"
                                    id="email"
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
                                </Form.Group>

                                <div className="mt-2">
                                  <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                  >
                                    Send Reset Link
                                  </button>
                                </div>

                                <div className="mt-4 text-center">
                                  <p className="mb-0">
                                    Wait, I remember my password...{" "}
                                    <Link
                                      to="/login"
                                      className="fw-medium text-primary text-decoration-underline"
                                    >
                                      Sign in
                                    </Link>
                                  </p>
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
      <ToastContainer transition={Slide} />
    </React.Fragment>
  );
};

export default ForgotPassword;
