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
import CourseStatistic from "./CourseStatistic";
import AssignmentSection from "./AssignmentSection";
import DocumentsSection from "./DocumentsSection";

const TraineeCoursesDetails = () => {
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

  if(isLoading ){
    return(
                <Spinner animation="grow" role="status">
                  <span className="visually-hidden">Loading...</span>
            </Spinner>
    )
    }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="mb-2">
            <h1>Trainee Courses Details</h1>
          </div>

          <CourseStatistic data={data} />

          <hr />

          <DocumentsSection
            data={data.documents}
            course_id={id}
            loadData={loadData}
          />

          <hr />

          <AssignmentSection
            data={data.assignments}
            course_id={id}
            loadData={loadData}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TraineeCoursesDetails;
