import React, { useEffect, useState } from "react";
import { Card, Col, Dropdown, Row } from "react-bootstrap";
import CountUp from "react-countup";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

const CourseStatistic = ({ data }: { data: any }) => {
  console.log("data :>> ", data);
  const firebaseBackend = getFirebaseBackend();

  const [statistic, setStatistic] = useState<any>([]);

  const calculateStatistics = () => {
    // Filter submissions for the given student
    const studentSubmissions = data.assignments.flatMap(
      (assignment: { submits: any[] }) =>
        assignment.submits.filter(
          (submit: { user_id: any }) => submit.user_id === firebaseBackend.uuid
        )
    );

    // Calculate statistics
    const totalAssignments = data.assignments.length;
    const completedAssignments = studentSubmissions.length;
    const totalMarks = studentSubmissions.reduce(
      (sum: any, submission: { mark: any }) => sum + (submission.mark || 0),
      0
    );
    const maxMarks = data.assignments.reduce(
      (sum: any, assignment: { mark: any }) => sum + (assignment.mark || 0),
      0
    );

    setStatistic([
      { title: "Total Assignments", count: totalAssignments },
      { title: "Completed Assignments", count: completedAssignments },
      { title: "Total Marks", count: totalMarks },
      { title: "Max Marks", count: maxMarks },
    ]);
  };
  useEffect(() => {
    calculateStatistics();
  }, []);

  if (statistic.length == 0) return null;
  return (
    <React.Fragment>
      <Col>
        <Card>
          <Card.Body>
            <Row>
              {statistic.map((item: any, index: number) => {
                return (
                  <Col lg={2} key={index} className="mini-widget pb-3 pb-lg-0">
                    <div className="d-flex align-items-end">
                      <div className="flex-grow-1">
                        <h2 className="mb-0 fs-24">
                          <CountUp end={item.count}></CountUp>
                        </h2>
                        <h5 className="text-muted fs-16 mt-2 mb-0">
                          {item.title}
                        </h5>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default CourseStatistic;
