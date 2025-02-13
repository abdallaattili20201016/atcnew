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
import { Link } from "react-router-dom";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import EditProductList from "../../../Common/CrudModal/EditProductList";
import { DeleteModal } from "../../../Common/DeleteModal";
import { db } from "../../../App";

const TrainerCoursesList = () => {
  document.title = "Trainer Courses List";

  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  const loadData = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const dataList = await firebaseBackend.getTrainerCourses(undefined, item);
      setData(dataList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [firebaseBackend]);

  const handleSearch = async (ele: any) => {
    const item = ele.value.trim(); 

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
      {
        Header: "COURSE NAME",
        accessor: "productName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const { title } = cell.row.original; 

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
        Header: "LOCATION",
        accessor: "location",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.location}</>,
      },
      {
        Header: "End Date",
        accessor: "expiryDate",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.endDate}</>,
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
              <h1>Trainer Courses</h1>
            </Col>

            <div className="col-sm-auto ms-auto">
              <div className="search-box">
                <Form.Control
                  type="text"
                  id="searchMemberList"
                  placeholder="Search for Result"
                  onChange={(e: any) => handleSearch(e.target)}
                />
                <i className="las la-search search-icon"></i>
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

export default TrainerCoursesList;
