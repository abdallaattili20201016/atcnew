import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../App"; // Adjust to your firebase config path

import moment from "moment";
import "firebase/storage";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import EditUsers from "../../../Common/CrudModal/EditUsers";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import "react-toastify/dist/ReactToastify.css";

interface userProps {
  isShow: any;
  hideUserModal: any;
}

const UserTable = ({ isShow, hideUserModal }: userProps) => {
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
                  Admin
                </span>
              );
            case 2:
              return (
                <span className="badge bg-info-subtle text-primary p-2">
                  {cell.row.original.role}
                </span>
              );
            default:
              return null; // Return null if the status is not recognized
          }
        },
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
        show={editUser}
        onHide={() => handleCloseEdit(false)}
        backdrop="static"
      >
        <EditUsers
          isShow={editUser}
          handleClose={handleCloseEdit}
          edit={edit}
        />
      </Modal>

      <ToastContainer />
    </React.Fragment>
  );
};

export default UserTable;
