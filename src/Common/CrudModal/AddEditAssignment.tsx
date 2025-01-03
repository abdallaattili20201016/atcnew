import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { Timestamp } from "firebase/firestore"; // Import the Timestamp from Firebase

interface AssignmentProps {
  isShow: boolean;
  handleClose: (reset: boolean) => void;
  edit: any;
}

const AddEditAssignment = ({ isShow, handleClose, edit }: AssignmentProps) => {
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
      title: (edit && edit.title) || "",
      mark: (edit && edit.mark) || "",

      start:
        edit && edit.start
          ? edit.start.toDate().toISOString().slice(0, 16)
          : "", // Convert Timestamp to datetime-local format
      end: edit && edit.end ? edit.end.toDate().toISOString().slice(0, 16) : "", // Convert Timestamp to datetime-local format
      file: (edit && edit.file) || null,
      submits: (edit && edit.submits) || [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      mark: Yup.number().required("Mark is required"),
      start: Yup.date()
        .min(new Date(), "Start date must be in the future")
        .required("Start date is required"),
      end: Yup.date()
        .min(Yup.ref("start"), "End date must be after the start date")
        .required("End date is required"),
      file: Yup.mixed()
        .nullable() // Allows the file to be null
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
        const assignmentData = {
          title: values.title,
          mark: values.mark,
          start: Timestamp.fromDate(new Date(values.start)), // Convert the string back to Timestamp
          end: Timestamp.fromDate(new Date(values.end)), // Convert the string back to Timestamp
          submits: values.submits,
          assignment_id:
            edit?.assignment_id != null ? edit.assignment_id : undefined,
          course_id: edit.course_id,
        };

        // Check if a file was selected
        if (selectedFile) {
          await firebaseBackend.addEditAssignment(assignmentData, selectedFile);
          toast.success(
            `Assignment ${
              edit?.assignment_id != null ? "edited" : "added"
            } successfully!`
          );
        } else {
          // If no file selected, simply add/edit assignment without file
          await firebaseBackend.addEditAssignment(assignmentData);
          toast.success(
            `Assignment ${
              edit?.assignment_id != null ? "edited" : "added"
            } successfully!`
          );
        }
      } catch (error) {
        console.log("error :>> ", error);
        toast.error(
          `Failed to ${
            edit?.assignment_id != null ? "edit" : "add"
          } assignment. Please try again.`
        );
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
          <Modal.Title as="h5">
            {edit?.assignment_id != null ? "Edit" : "Add"} Assignment
          </Modal.Title>
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
              <Form.Label htmlFor="title">Title</Form.Label>
              <Form.Control
                type="text"
                id="title"
                name="title"
                placeholder="Enter assignment title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.title}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="mark">Mark</Form.Label>
              <Form.Control
                type="number"
                id="mark"
                name="mark"
                placeholder="Enter assignment mark"
                value={formik.values.mark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.mark}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.mark}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="start">Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                id="start"
                name="start"
                value={formik.values.start}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.start}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.start}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="end">End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                id="end"
                name="end"
                value={formik.values.end}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.end}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.end}
              </Form.Control.Feedback>
            </div>
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
              {edit?.file && (
                <div>
                  <a href={edit.file} target="_blank" rel="noopener noreferrer">
                    {edit.file.split("/").pop()}
                  </a>
                </div>
              )}
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
                {edit?.assignment_id != null
                  ? isSubmitting
                    ? "Saving..."
                    : "Save"
                  : isSubmitting
                  ? "Adding..."
                  : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default AddEditAssignment;
