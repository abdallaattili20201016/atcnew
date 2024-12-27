import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { PatternFormat } from "react-number-format";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { toast } from "react-toastify";

interface usereditProps {
  isShow: boolean;
  handleClose: (reset: boolean) => void;
  edit: any;
}

const EditUsers = ({ isShow, handleClose, edit }: usereditProps) => {
  const firebaseBackend = getFirebaseBackend();
  const [selectedImage, setSelectedImage] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      formik.setFieldValue("memberImage", e.target.result);
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (edit && edit.id) || "",
      memberName: (edit && edit.username) || "",
      memberImage: (edit && edit.picture) || "",
      email: (edit && edit.email) || "",
      mobile: (edit && edit.phone) || "",
      registeredOn: (edit && edit.createdDtm) || "",
      status: (edit && edit.status) || "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Please choose Your status"),
    }),

    onSubmit: async (values: any) => {
      try {
        setIsSubmitting(true);
        console.log("Submitting form with values:", values);
        await firebaseBackend.updateUserById(edit.id, values);
        formik.resetForm();
        toast.success("User Status Updated Successfully", { autoClose: 2000 });
        handleClose(true);
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user status. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    setSelectedImage(edit?.memberImage);
  }, [edit]);
  
  return (
    <Modal centered show={isShow} onHide={() => handleClose(false)} backdrop="static" style={{ zIndex: 1050 }}>
      <div className="modal-content border-0">
        <Modal.Header className="p-4 pb-0">
          <Modal.Title as="h5">Edit User Status</Modal.Title>
          <button
            type="button"
            className="btn-close"
            title="Close"
            onClick={() => {
              formik.resetForm();
              handleClose(false);
            }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form noValidate onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <Form.Label htmlFor="users">Member Name</Form.Label>
              <Form.Control
                type="text"
                id="memberName"
                name="memberName"
                placeholder="Enter member name"
                className="bg-light text-muted"
                disabled
                value={formik.values.memberName || ""}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="Email-input">Email</Form.Label>
              <Form.Control
                type="text"
                id="Email-input"
                name="email"
                className="bg-light text-muted"
                disabled
                placeholder="Enter Your email"
                value={formik.values.email || ""}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="users">Mobile</Form.Label>
              <PatternFormat
                id="mobile"
                name="mobile"
                className="form-control bg-light text-muted"
                placeholder="Enter Your Mobile Number"
                value={formik.values.mobile || ""}
                onBlur={formik.handleBlur}
                format="###-###-####"
                disabled
              />
            </div>
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status<span className="text-danger">*</span>
                  </label>
                  <Form.Select
                    id="paymentType"
                    name="status"
                    value={formik.values.status || ""}
                    onChange={(e) => {
                      // Convert the status to a number if necessary
                      const value =
                        e.target.value === ""
                          ? ""
                          : parseInt(e.target.value, 10);
                      formik.setFieldValue("status", value);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.status}
                  >
                    <option disabled>Select Status</option>
                    <option value="0">Pending</option>
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                    <option value="-1">Rejected</option>
                  </Form.Select>
                  {formik.touched.status && formik.errors.status && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {formik.errors.status}
                    </Form.Control.Feedback>
                  )}
                </div>
              </Col>
            </Row>
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  formik.resetForm();
                  handleClose(false);
                }}
              >
                Close
              </Button>
              <Button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting || !formik.isValid || !formik.dirty}
              >
                {isSubmitting ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default EditUsers;