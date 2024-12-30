import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
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

const TraineeCoursesList = () => {
  document.title = "Trainer Courses List";

  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const dataList = await firebaseBackend.getTraineeCourses();
      setData(dataList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="pb-4 gy-3">
            <h1>Trainee Courses</h1>
          </div>

          {isLoading ? (
            <Spinner animation="grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : data && data.length > 0 ? (
            <Row>
              {data.map((course: any, index: any) => (
                <Col key={index} xxl={2} lg={3}>
                  <Card className="card-body text-center">
                    <div className="avatar-sm mx-auto mb-3">
                      <div className="avatar-title bg-primary-subtle text-primary fs-base rounded">
                        <i className="ri-book-line"></i>
                      </div>
                    </div>
                    <h4 className="card-title">{course.title}</h4>
                    <p className="card-text text-muted">{course.description}</p>
                    <Link
                      to={`/trainee-courses-details/${course.id}`}
                      className="btn btn-primary"
                    >
                      View Detials
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <NoSearchResult
              title1={"No Courses have been added yet."}
              title2={
                "No courses found for the trainer or matching search key."
              }
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TraineeCoursesList;
