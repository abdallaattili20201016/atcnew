import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import dummy from "../../assets/images/users/user-dummy-img.jpg";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";

interface producteditProps {
  isShow: any;
  handleClose: any;
  edit: any;
}

const EditProductList = ({ isShow, handleClose, edit }: producteditProps) => {
  const firebaseBackend = getFirebaseBackend();

  console.log("edit :>> ", edit);

  // image
  const [selectedImage, setSelectedImage] = useState<any>(
    edit?.images || dummy
  );
  const [categories, setCategories] = useState<any[]>([]); // State for categories

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = await firebaseBackend.fetchCategories();
        setCategories(categoryCollection);
      } catch (error) {
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, [firebaseBackend]);

  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: (edit && edit.id) || "",
      title: (edit && edit.title) || "",
      images: (edit && edit.images) || "",
      category: (edit && edit.category) || "",
      price: (edit && edit.price) || "",
      quantity: (edit && edit.quantity) || "",
      expiryDate: (edit && edit.expiryDate) || "",
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your product name"),
      images: Yup.string().required("Please select an image"),
      category: Yup.string().required("Please Enter Your category"),
      price: Yup.number().required("Please Enter Your Billed amount"),
      quantity: Yup.number().required("Please Enter Quantity"),
      expiryDate: Yup.date().required("Please Enter Expiry Date"),
    }),

    onSubmit: async (values: any) => {
      await firebaseBackend.updateProductById(edit.id, values, newImageFile);
      formik.resetForm();
      toast.success("Product Edited Successfully", { autoClose: 2000 });
      handleClose(true);
    },
  });

  useEffect(() => {
    setSelectedImage(edit?.images || dummy); // Reset to existing image when `edit` changes
  }, [edit]);

  return (
    <React.Fragment>
      <Modal
        centered
        show={isShow}
        onHide={handleClose}
        style={{ display: "block" }}
        tabIndex={-1}
      >
        <div className="modal-content border-0">
          <Modal.Header className="p-4 pb-0">
            <Modal.Title as="h5">Edit Product</Modal.Title>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                formik.resetForm();
                handleClose(false);
              }}
            ></button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form autoComplete="off" onSubmit={formik.handleSubmit}>
              <div className="text-center">
                <div className="position-relative d-inline-block">
                  <div className="position-absolute bottom-0 end-0">
                    <Form.Label
                      htmlFor="product-image-input"
                      className="mb-0"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="Select Image"
                    >
                      <div className="avatar-xs cursor-pointer">
                        <div className="avatar-title bg-light border rounded-circle text-muted">
                          <i className="ri-image-fill"></i>
                        </div>
                      </div>
                    </Form.Label>
                    <Form.Control
                      name="productImage"
                      className="form-control d-none"
                      value=""
                      id="product-image-input"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="avatar-lg p-1">
                    <div className="avatar-title bg-light rounded-circle">
                      <img
                        src={selectedImage}
                        alt="Product"
                        id="product-img"
                        className="avatar-md rounded-circle object-cover"
                      />
                    </div>
                  </div>
                </div>
                {formik.errors.productImage && formik.touched.productImage ? (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {formik.errors.productImage}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="Product-Name-input">
                  Product Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="Product-Name-input"
                  name="title"
                  placeholder="Enter product Name"
                  value={formik.values.title || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.title}
                />
                {formik.errors.title && formik.touched.title ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.title}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="Category-input">
                  Category<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  id="Category-input"
                  name="category"
                  value={formik.values.category || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.category}
                >
                  <option>select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </Form.Select>
                {formik.errors.category && formik.touched.category ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.category}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="expiryDate-input">
                      Expiry Date<span className="text-danger">*</span>
                    </Form.Label>
                    <Flatpickr
                      className="form-control"
                      placeholder="Expiry Date"
                      options={{
                        dateFormat: "d M, Y",
                        minDate: "today", // Restrict selection to today or future dates
                      }}
                      value={
                        formik.values.expiryDate
                          ? new Date(formik.values.expiryDate)
                          : null
                      }
                      onChange={(date: Date[]) => {
                        if (date[0]) {
                          const year = date[0].getFullYear();
                          const month = String(date[0].getMonth() + 1).padStart(
                            2,
                            "0"
                          ); // Months are zero-indexed
                          const day = String(date[0].getDate()).padStart(
                            2,
                            "0"
                          );

                          const formattedDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD
                          formik.setFieldValue("expiryDate", formattedDate); // Store as a string
                        }
                      }}
                    />
                    {formik.errors.expiryDate && formik.touched.expiryDate && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.expiryDate}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="quantity">Product Quantity</Form.Label>
                    <Form.Control
                      id="quantity"
                      name="quantity"
                      placeholder="Enter Quantity"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.quantity}
                      isInvalid={
                        formik.touched.quantity && !!formik.errors.quantity
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.quantity}
                    </Form.Control.Feedback>
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Form.Label htmlFor="Price-input">
                  Price<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="price-input"
                  name="price"
                  placeholder="Enter Your price"
                  value={formik.values.price || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.price}
                />
                {formik.errors.price && formik.touched.price ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price}
                  </Form.Control.Feedback>
                ) : null}
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
                <Button type="submit" className="btn btn-primary">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default EditProductList;
