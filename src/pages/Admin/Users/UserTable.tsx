import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../App"; 

import moment from "moment";
import "firebase/storage";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PatternFormat } from "react-number-format";

interface userProps {
  isShow: any;
  hideUserModal: any;
}

const UserTable = ({ isShow, hideUserModal }: userProps) => {
  document.title = "Users";
  const navigate = useNavigate();
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const firebaseBackend = getFirebaseBackend();

  const handleShowAddUser = async () => {
    setShowAddUser(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log(`Deleting user with ID: ${userId}`);
      await firebaseBackend.deleteUser(userId);
      toast.success("User deleted successfully.");
      loadUsers(); // Re-fetch users after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const loadUsers = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const usersList = await firebaseBackend.fetchUsers(item);
      setUsers(usersList);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
    };
    fetchUsers();
  }, [firebaseBackend]);

  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<any>();

  const handleDeleteModal = useCallback(
    (id: any) => {
      setDelet(!delet);
      setDeletid(id);
      handleDeleteUser(id); // Call handleDeleteUser directly for testing
    },
    [delet]
  );

  const handleSearch = async (ele: any) => {
    const item = ele.value.trim(); // Trim whitespace
    loadUsers(item);
  };

  const [editUser, setEditUser] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();

  const handleCloseEdit = (reset: boolean) => {
    if (reset) loadUsers();
    setEditUser(false);
  };

  const handleEditUser = (item: any) => {
    setEditUser(true);
    setEdit(item);
  };

  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => any;
  }

  const columns: columnsType[] = useMemo(
    () => [
      {
        Header: "MEMBER NAME",
        accessor: "memberName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.username}</>,
      },
      {
        Header: "EMAIL",
        accessor: "email",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.email}</>,
      },
      {
        Header: "MOBILE",
        accessor: "mobile",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.phone}</>,
      },
      {
        Header: "REQUEST SENT ON",
        accessor: "registeredOn",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>
            {moment(cell.row.original.createdDtm.toDate()).format(
              "MMMM Do YYYY"
            )}
          </>
        ),
      },
      {
        Header: "STATUS",
        accessor: "status",
        Filter: false,
        isSortable: true,
        Cell: (cell) => {
          switch (cell.row.original.status) {
            case -1:
              return (
                <span className="badge bg-danger-subtle text-danger p-2">
                  Rejected
                </span>
              );
            case 0:
              return (
                <span className="badge bg-warning-subtle text-warning p-2">
                  Pending
                </span>
              );
            case 1:
              return (
                <span className="badge bg-success-subtle text-success p-2">
                  Active
                </span>
              );
            default:
              return null; // Return null if the status is not recognized
          }
        },
      },
      {
        Header: "ROLE",
        accessor: "role",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.role}</>,
      },
      {
        Header: "ACTION",
        accessor: "action",
        Filter: false,
        style: { width: "12%" },
        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEditUser(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                <i className="las la-pen fs-17 align-middle"></i>
              </Link>
            </li>
            <li
              className="list-inline-item"
              onClick={() => {
                const item = cell.row.original;
                handleDeleteModal(item.id);
              }}
            >
              <Link
                to="#"
                className="btn btn-soft-danger btn-sm d-inline-block"
                title="Delete User"
              >
                <i className="las la-trash fs-17 align-middle"></i>
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    [handleDeleteModal]
  );

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
      memberName: Yup.string().required("Member name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      mobile: Yup.string().required("Mobile number is required"),
      status: Yup.string().required("Please choose Your status"),
    }),

    onSubmit: async (values: any) => {
      try {
        setIsSubmitting(true);
        console.log("Submitting form with values:", values);
        await firebaseBackend.updateUserById(edit.id, values);
        formik.resetForm();
        toast.success("User Details Updated Successfully", { autoClose: 2000 });
        handleCloseEdit(true);
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user details. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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

  useEffect(() => {
    setSelectedImage(edit?.memberImage);
  }, [edit]);

  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <div className="col-sm-auto ms-auto">
          <div className="d-flex gap-3">
            <div className="search-box">
              <Form.Control
                type="text"
                id="searchMemberList"
                placeholder="Search by Member Name"
                onChange={(e: any) => handleSearch(e.target)}
              />
              <i className="las la-search search-icon"></i>
            </div>
          </div>
        </div>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              {users && users.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={users || []}
                  customPageSize={9}
                  divClassName="table-card table-responsive"
                  tableClass="table-hover table-nowrap align-middle mb-0"
                  isBordered={false}
                  PaginationClass="align-items-center mt-4 gy-3"
                />
              ) : (
                <NoSearchResult />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="primary" onClick={() => navigate("/add-user")}>
        Add New User
      </Button>

      <Modal
        centered
        show={editUser}
        onHide={() => handleCloseEdit(false)}
        backdrop="static"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-content border-0">
          <Modal.Header className="p-4 pb-0">
            <Modal.Title as="h5">Edit User Details</Modal.Title>
            <button
              type="button"
              className="btn-close"
              title="Close"
              onClick={() => {
                formik.resetForm();
                handleCloseEdit(false);
              }}
            />
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <Form.Label htmlFor="memberName">Member Name</Form.Label>
                <Form.Control
                  type="text"
                  id="memberName"
                  name="memberName"
                  placeholder="Enter member name"
                  value={formik.values.memberName || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.memberName}
                />
                {formik.touched.memberName && formik.errors.memberName && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.memberName}
                  </Form.Control.Feedback>
                )}
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={formik.values.email || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                )}
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="mobile">Mobile</Form.Label>
                <PatternFormat
                  id="mobile"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter mobile number"
                  value={formik.values.mobile || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  format="###-###-####"
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.mobile}
                  </Form.Control.Feedback>
                )}
              </div>
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status<span className="text-danger">*</span>
                    </label>
                    <Form.Select
                      id="status"
                      name="status"
                      value={formik.values.status !== undefined ? formik.values.status.toString() : ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                        formik.setFieldValue("status", value);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.status}
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Active</option>
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
                    handleCloseEdit(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting || !formik.isValid || !formik.dirty}
                >
                  {isSubmitting ? "Updating..." : "Update Details"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </div>
      </Modal>

      <ToastContainer />
    </React.Fragment>
  );
};

export default UserTable;
