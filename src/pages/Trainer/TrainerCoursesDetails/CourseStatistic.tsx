import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import CountUp from "react-countup";

const CourseStatistic = ({ data }: { data: any }) => {
  const [statistic, setStatistic] = useState<any>([]);

  const calculateStatistics = () => {
    if (!data || !data.students || !data.assignments) {
      console.error("Invalid or undefined data passed to CourseStatistic");
      return;
    }

    // Total students in the course
    const totalStudents = data.students.length;

    // Total assignments in the course
    const totalAssignments = data.assignments.length;

    // Total submissions
    const totalSubmissions = data.assignments.reduce(
      (sum: number, assignment: { submits: any[] }) =>
        sum + (assignment.submits?.length || 0),
      0
    );

    // Average marks for all submissions
    const totalMarksAwarded = data.assignments.reduce(
      (sum: number, assignment: { submits: any[] }) =>
        sum +
        (assignment.submits || []).reduce(
          (subSum: number, submit: { mark: number }) =>
            subSum + (submit.mark || 0),
          0
        ),
      0
    );

    const totalSubmits = totalSubmissions;
    const averageMarks =
      totalSubmits > 0 ? (totalMarksAwarded / totalSubmits).toFixed(2) : 0;

    setStatistic([
      { title: "Total Students", count: totalStudents },
      { title: "Total Assignments", count: totalAssignments },
      { title: "Total Submissions", count: totalSubmissions },
      { title: "Average Marks", count: averageMarks },
    ]);
  };

  useEffect(() => {
    calculateStatistics();
  }, [data]); // Recalculate when data changes

  if (statistic.length === 0) return null;

  return (
    <React.Fragment>
      <Col>
        <Card>
          <Card.Body>
            <Row>
              {statistic.map((item: any, index: number) => (
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
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default CourseStatistic;
