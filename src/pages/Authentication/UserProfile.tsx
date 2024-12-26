import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  Alert,
  Button,
  Form,
} from "react-bootstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import withRouter from "../../Common/withRouter";

// import avatar from "../../assets/images/users/avatar-1.jpg";

import { createSelector } from "reselect";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { toast } from "react-toastify";
import { storage } from "../../App"; // Assuming you've set up Firebase storage helper
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface ProfileState {
  user: {
    email: string;
    idx: string;
    userName: string;
  };
  success: boolean;
  error: string | null;
}

const UserProfile: React.FC = () => {
  document.title = "User Profile";

  const firebaseBackend = getFirebaseBackend();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [avatarURL, setAvatarURL] = useState<string>(""); // Initial avatar state

  const loadUserName = async (uid: string) => {
    try {
      const data = await firebaseBackend.getUserDetailsByUid(uid);
      if (data) {
        setCity(data.city);
        setStreet(data.address.street);
        setUsername(data.username);
        setEmail(data.email);
        setPhone(data.phone);
        setAvatarURL(data.picture); // Set avatar URL from Firestore
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  useEffect(() => {
    const authUser: any = sessionStorage.getItem("authUser");
    if (authUser) {
      const obj = JSON.parse(authUser);
      if (obj.uid) loadUserName(obj.uid);
    }
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      city: city || "",
      street: street || "",
      avatar: null,
    },
    validationSchema: Yup.object({
      city: Yup.string().required("Please enter your city"),
      street: Yup.string().required("Please enter your street"),
    }),
    onSubmit: async (values: any) => {
      try {
        console.log("Submitting form with values:", values);

        if (values.avatar) {
          console.log("Uploading avatar image...");
          const avatarFile = values.avatar;
          const storageRef = ref(storage, `avatars/${0}`);

          const uploadTask = uploadBytesResumable(storageRef, avatarFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.error("Error uploading avatar:", error);
              toast.error("Avatar upload failed", { autoClose: 2000 });
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Avatar uploaded successfully:", downloadURL);

              await firebaseBackend.updateUserDetails({
                address: {
                  ...(values.city && { city: values.city }),
                  ...(values.street && { street: values.street }),
                },
                picture: downloadURL, // Save the new avatar URL to Firestore
              });

              setAvatarURL(downloadURL); // Update avatar state after successful upload
              toast.success("Profile updated successfully", {
                autoClose: 2000,
              });
            }
          );
        } else {
          await firebaseBackend.updateUserDetails({
            address: {
              ...(values.city && { city: values.city }),
              ...(values.street && { street: values.street }),
            },
          });
          toast.success("Profile updated successfully", { autoClose: 2000 });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Profile update failed", { autoClose: 2000 });
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
                    <div className=" mb-5" />

                    <Row>
                      <Col lg="12">
                        <Card>
                          <Card.Body>
                            <div className="d-flex">
                              <div className="mx-3">
                                <img
                                  src={avatarURL} // Use updated avatar URL here
                                  alt=""
                                  className="avatar-lg rounded-circle img-thumbnail"
                                />
                              </div>
                              <div className="flex-grow-1 align-self-center">
                                <div className="text-muted">
                                  <h5 className="mb-0">{username}</h5>

                                  <p className="mb-0">{email}</p>
                                  <p className="mb-0">{phone}</p>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <h4 className="card-title mb-4">Edit Profile</h4>

                    <Card>
                      <Card.Body>
                        <Form
                          className="form-horizontal"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <div className="form-group">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              name="city"
                              className="form-control"
                              placeholder="Enter City"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.city || ""}
                              isInvalid={
                                validation.touched.city &&
                                validation.errors.city
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.city}
                            </Form.Control.Feedback>
                          </div>

                          <div className="form-group mt-3">
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                              name="street"
                              className="form-control"
                              placeholder="Enter Street"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.street || ""}
                              isInvalid={
                                validation.touched.street &&
                                validation.errors.street
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.street}
                            </Form.Control.Feedback>
                          </div>

                          <div className="form-group mt-3">
                            <Form.Label>Avatar</Form.Label>
                            <Form.Control
                              name="avatar"
                              className="form-control"
                              type="file"
                              accept="image/png, image/jpeg" // Only allows PNG and JPG files to be selected
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                validation.setFieldValue(
                                  "avatar",
                                  event.currentTarget.files
                                    ? event.currentTarget.files[0]
                                    : null
                                )
                              }
                            />
                          </div>

                          <div className="text-center mt-4">
                            <Button type="submit" variant="danger">
                              Update Profile
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
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

export default withRouter(UserProfile);
