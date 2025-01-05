import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Spinner,
  ToastContainer,
} from "react-bootstrap";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { toast } from "react-toastify";
import { Link, useLocation, useParams } from "react-router-dom";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";

const AssignmentSubmitList = () => {
  document.title = "Assignment Submit List";

  const location = useLocation();

  const course_id = location.state.course_id;
  const assignment_id = location.state.assignment_id;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const dataList = await firebaseBackend.getTrainerCourses(course_id);
      var tempdata = dataList.assignments[assignment_id];
      setData(tempdata);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [firebaseBackend]);

  const loadUser = async (id: any) => {
    const dataList = await firebaseBackend.getUserDetailsByUid(id);
    return dataList.username;
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
        Header: "Trainee Name",
        accessor: "traineeName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const [name, setName] = useState<string>("Loading...");

          useEffect(() => {
            const fetchName = async () => {
              const traineeName = await loadUser(cell.row.original.user_id);
              setName(traineeName);
            };
            fetchName();
          }, [cell.row.original.user_id]);

          return (
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="fs-16 mb-1">{name}</h6>
              </div>
            </div>
          );
        },
      },

      {
        Header: "Mark",
        accessor: "mark",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.mark ?? "Un Marked"}</>,
      },
      {
        Header: "Max Mark",
        accessor: "maxMark",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{data?.mark ?? "N/A"}</>,
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
          const [value, setValue] = useState<number>(cell.row.original.mark);
          const maxMark = data?.mark ?? "N/A";

          const handleInputChange = (e: any) => {
            setValue(e.target.value);
          };
          return (
            <Col lg={3}>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={value}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  aria-label="Mark"
                  aria-describedby="mark"
                />
                <Button
                  variant="outline-primary"
                  id="mark"
                  onClick={async () => {
                    if (value && value >= 0 && value <= maxMark) {
                      try {
                        await firebaseBackend.markAssignment(
                          course_id,
                          assignment_id,
                          cell.row.original.user_id,
                          value
                        );
                        loadData();
                        toast.success(`Marked as ${value}`);
                      } catch (error) {}
                    } else {
                      toast.error(
                        `please enter value min 0 and max ${maxMark}`
                      );
                    }
                  }}
                >
                  Submit
                </Button>
              </InputGroup>
            </Col>
          );
        },
      },
    ],
    [data]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h1>Assignment Submit List</h1>

          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body className="table-responsive">
                  {isLoading ? (
                    <Spinner animation="grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : data.submits && data.submits.length > 0 ? (
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={data.submits || []}
                      customPageSize={8}
                      divClassName="table-card "
                      tableClass="table-hover table-nowrap align-middle mb-0"
                      isBordered={false}
                      PaginationClass="align-items-center mt-4 gy-3"
                    />
                  ) : (
                    <NoSearchResult
                      title1={"No Courses have been added yet."}
                      title2={
                        "No courses found for the trainer or matching search key."
                      }
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AssignmentSubmitList;
