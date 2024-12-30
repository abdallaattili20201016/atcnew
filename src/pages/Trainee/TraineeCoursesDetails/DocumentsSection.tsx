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
import moment from "moment";
import { DeleteModal } from "../../../Common/DeleteModal";

const DocumentsSection = ({
  data,
  course_id,
  loadData,
}: {
  data: { title: string; count: number }[];
  course_id: any;
  loadData: any;
}) => {
  return (
    <React.Fragment>
      <div className="mb-2">
        <h1>Documents</h1>
      </div>

      <Row>
        <Col xl={12} className="d-flex gap-3">
          {data && data.length > 0 ? (
            data.map((course: any, index: any) => (
              <Col key={index} xxl={2} lg={3}>
                <Card className="card-body text-center gap-3">
                  <h4 className="card-title">{course.title}</h4>
                  <Button
                    onClick={() => {
                      window.open(course.fileUrl, "_blank");
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </Button>
                </Card>
              </Col>
            ))
          ) : (
            <NoSearchResult
              title1={"No Documents have been added yet."}
              title2={""}
            />
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default DocumentsSection;
