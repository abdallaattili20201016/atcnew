import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Spinner,
  ToastContainer,
} from "react-bootstrap";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import TableContainer from "../../../Common/Tabledata/TableContainer";

const TrainerCoursesDetails = () => {
  document.title = "Trainer Courses Details";

  const navigate = useNavigate();

  const { id } = useParams();

  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const dataList = await firebaseBackend.getTrainerCourses(id);
      setData(dataList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [firebaseBackend]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="mb-2">
            <h1>Trainer Courses Details</h1>
          </div>

          <Col sm={4}>
            <Link to="/product-add" className="btn btn-primary addtax-modal">
              <i className="las la-plus me-1"></i> Add Product
            </Link>
          </Col>

          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body className="table-responsive">
                  {isLoading ? (
                    <Spinner animation="grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : data ? (
                    <div></div>
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

export default TrainerCoursesDetails;

const AssignmentSection = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  const loadData = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const dataList = await firebaseBackend.getCourseAssignments();
      setData(dataList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [firebaseBackend]);

  // search
  const handleSearch = async (ele: any) => {
    const item = ele.value.trim(); // Trim whitespace

    loadData(item);
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
      // {
      //   Header: () => (
      //     <Form>
      //       <Form.Check type="checkbox" />
      //     </Form>
      //   ),
      //   accessor: "id",
      //   key: "id",
      //   Filter: false,
      //   isSortable: false,
      //   width: 50,
      //   Cell: () => (
      //     <Form>
      //       <Form.Check type="checkbox" />
      //     </Form>
      //   ),
      // },
      {
        Header: "COURSE NAME",
        accessor: "productName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const { title } = cell.row.original; // Destructure to get images and title

          return (
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="fs-16 mb-1">{title}</h6>
              </div>
            </div>
          );
        },
      },

      {
        Header: "CATEGORY",
        accessor: "category",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.category}</>,
      },
      // {
      //   Header: "IN STOCK",
      //   accessor: "inStock",
      //   Filter: false,
      //   isSortable: true,
      // },
      {
        Header: "Quantity",
        accessor: "quantity",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.quantity}</>,
      },

      {
        Header: "PRICE",
        accessor: "price",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>${cell.row.original.price}</>,
      },
      {
        Header: "Exp Date",
        accessor: "expiryDate",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.expiryDate}</>,
      },

      {
        Header: "Action",
        accessor: "action",
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => (
          <Link
            to={`/trainer-courses-details/${cell.row.original.id}`}
            className="btn btn-soft-secondary btn-sm arrow-none d-inline-flex align-items-center"
          >
            <i className="las la-eye fs-18 align-middle text-muted"></i>
          </Link>
        ),
      },
    ],
    []
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="pb-4 gy-3">
            <Col sm={4}>
              <Link to="/product-add" className="btn btn-primary addtax-modal">
                <i className="las la-plus me-1"></i> Add Product
              </Link>
            </Col>

            <div className="col-sm-auto ms-auto">
              <div className="d-flex gap-3">
                <div className="search-box">
                  <Form.Control
                    type="text"
                    id="searchMemberList"
                    placeholder="Search for Result"
                    onChange={(e: any) => handleSearch(e.target)}
                  />
                  <i className="las la-search search-icon"></i>
                </div>
                {/* <Dropdown>
              <Dropdown.Toggle
                as="button"
                className="btn btn-soft-info btn-icon fs-14 arrow-none"
              >
                <i className="las la-ellipsis-v fs-18"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>All</Dropdown.Item>
                <Dropdown.Item>Last Week</Dropdown.Item>
                <Dropdown.Item>Last Month</Dropdown.Item>
                <Dropdown.Item>Last Year</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
              </div>
            </div>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body className="table-responsive">
                  {isLoading ? (
                    <Spinner animation="grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : data && data.length > 0 ? (
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
