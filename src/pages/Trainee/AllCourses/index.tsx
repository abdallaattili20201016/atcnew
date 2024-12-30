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
import { Link, useNavigate } from "react-router-dom";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";

const AllCourses = () => {
  document.title = "All Courses";

  const navigate = useNavigate();

  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  const loadData = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const dataList = await firebaseBackend.getAllCourses(item);
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="pb-4 gy-3">
            <Col sm={4}>
              <h1>All Courses</h1>
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
                    <Button
                      // to={`/courses/${course.id}`}
                      onClick={async () => {
                        if (course.isEnrolled) {
                          // window.location.href = "/trainee-courses-list";
                          navigate("/trainee-courses-list");
                        } else {
                          try {
                            await firebaseBackend.handleEnrollCourse(course.id);
                            toast.success("enroll Course successfully");
                          } catch (error) {
                            toast.error(
                              `Error updating course enrollment: ${error}`
                            );
                          } finally {
                            loadData();
                          }
                        }
                      }}
                      className="btn btn-primary"
                    >
                      {course.isEnrolled ? "Go To My Courses" : "Enrolle"}
                    </Button>
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

export default AllCourses;
