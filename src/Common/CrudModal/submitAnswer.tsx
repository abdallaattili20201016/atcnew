import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { Timestamp } from "firebase/firestore"; // Import the Timestamp from Firebase

interface DocumentsProps {
  isShow: boolean;
  handleClose: (reset: boolean) => void;
  edit: any;
}

const SubmitAnswer = ({ isShow, handleClose, edit }: DocumentsProps) => {
  const firebaseBackend = getFirebaseBackend();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      formik.setFieldValue("file", file);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required()
        .test(
          "fileType",
          "Only PDF or Word documents are allowed",
          (value: { type: string } | null) =>
            !value || // Skip validation if no file is uploaded
            [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(value?.type)
        ),
    }),
    onSubmit: async (values: any) => {
      setIsSubmitting(true);
      try {
        await firebaseBackend.submitAssignment(
          edit.course_id,
          edit.assignment_id,
          selectedFile
        );
        toast.success(`Assignment Submitted Successfully!`);
      } catch (error) {
        toast.error(`Failed to Submitted Assignment. Please try again.`);
      } finally {
        setIsSubmitting(false);
        handleClose(false); // Close the modal after submission
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    setSelectedFile(edit?.file || null);
  }, [edit]);

  return (
    <Modal
      centered
      show={isShow}
      onHide={() => {
        formik.resetForm();
        handleClose(false);
      }}
    >
      <div className="modal-content border-0">
        <Modal.Header className="p-4 pb-0">
          <Modal.Title as="h5">Submit Assignment</Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              formik.resetForm();
              handleClose(false);
            }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form noValidate onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <Form.Label htmlFor="file">Upload File</Form.Label>
              <Form.Control
                type="file"
                id="file"
                name="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.file}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.file}
              </Form.Control.Feedback>
            </div>
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
                className="btn btn-primary"
                disabled={isSubmitting || !formik.isValid || !formik.dirty}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default SubmitAnswer;
