import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import AddEditAssignment from "../../../Common/CrudModal/AddEditAssignment";
import moment from "moment";
import { DeleteModal } from "../../../Common/DeleteModal";

const AssignmentSection = ({
  data,
  course_id,
  loadData,
}: {
  data: { title: string; count: number }[];
  course_id: any;
  loadData: any;
}) => {
  const firebaseBackend = getFirebaseBackend();

  // State for modal visibility and edit data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<any>();

  // Handle modal open/close
  const handleModalClose = (reset: boolean) => {
    loadData();
    setIsModalVisible(false);
    if (reset) setEditData(null);
  };

  const handleAddAssignment = () => {
    setEditData({ course_id });
    setIsModalVisible(true);
  };

  const handleEditAssignment = (assignment: any, index: number) => {
    setEditData({ ...assignment, course_id, assignment_id: index });
    setIsModalVisible(true);
  };

  const handleDeleteAssignment = async () => {
    console.log("deletid :>> ", deletid);
    try {
      await firebaseBackend.deleteAssignment(course_id, deletid);

      toast.success("Assignment deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    } finally {
      setDelet(false);
    }
  };

  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => JSX.Element;
  }

  const columns: columnsType[] = useMemo(
    () => [
      {
        Header: "ASSIGNMENT NAME",
        accessor: "assignmentName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h6 className="fs-16 mb-1">{cell.row.original.title}</h6>
            </div>
          </div>
        ),
      },
      {
        Header: "Nmuber Of Submitions",
        accessor: "price",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.submits.length}</>,
      },
      {
        Header: "Start Date",
        accessor: "startDate",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>
            {moment(cell.row.original.start.toDate()).format(
              "DD-MM-YYYY H:MM A"
            )}
          </>
        ),
      },
      {
        Header: "End Date",
        accessor: "endDate",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>
            {moment(cell.row.original.end.toDate()).format("DD-MM-YYYY H:MM A")}
          </>
        ),
      },
      {
        Header: "File",
        accessor: "file",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>
            <Button
              variant="link"
              className="btn btn-soft-primary btn-sm"
              onClick={() => window.open(cell.row.original.fileUrl, "_blank")}
              disabled={!cell.row.original.fileUrl}
            >
              <i className="bi bi-folder-fill fs-18"></i>
            </Button>
          </>
        ),
      },

      {
        Header: "Action",
        accessor: "action",
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => {
          const index = cell.row.index; // Get index of the assignment in the array
          const assignment = cell.row.original;
          const data = {
            assignment_id: index,
            assignment: assignment,
            course_id,
          };

          return (
            <div className="d-flex gap-2">
              <Link
                to={`/assignment-submit-list`}
                state={data}
                className="btn btn-soft-secondary btn-sm arrow-none d-inline-flex align-items-center"
              >
                <i className="las la-eye fs-18 align-middle text-muted"></i>
              </Link>

              <Button
                variant="link"
                className="btn btn-soft-primary btn-sm"
                onClick={() => handleEditAssignment(assignment, index)}
              >
                <i className="las la-edit fs-18"></i>
              </Button>

              <Button
                variant="link"
                className="btn btn-soft-danger btn-sm"
                onClick={() => {
                  setDeletid(index);
                  setDelet(true);
                }}
              >
                <i className="las la-trash fs-18"></i>
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <React.Fragment>
      <div className="d-flex justify-content-between mb-2">
        <h1>Assignments</h1>
        <Button onClick={handleAddAssignment} className="mb-2 btn btn-primary">
          <i className="las la-plus me-1"></i> Add Assignments
        </Button>
      </div>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body className="table-responsive">
              {data && data.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={data || []}
                  customPageSize={8}
                  divClassName="table-card "
                  tableClass="table-hover table-nowrap align-middle mb-0"
                  isBordered={false}
                  PaginationClass="align-items-center mt-4 gy-3"
                />
              ) : (
                <NoSearchResult
                  title1={"No Assignments have been added yet."}
                  title2={""}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Assignment Modal */}
      <AddEditAssignment
        isShow={isModalVisible}
        handleClose={handleModalClose}
        edit={editData}
      />
      <DeleteModal
        show={delet}
        handleClose={() => {
          setDelet(false);
          setDeletid(null);
        }}
        deleteModalFunction={() => {
          handleDeleteAssignment();
        }}
      />
    </React.Fragment>
  );
};
export default AssignmentSection;
