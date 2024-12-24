import React, { useState } from "react";
import { Container } from "react-bootstrap";

const TrainerReports = () => {
  document.title = "TrainerReports";
  const [isShow, setIsShow] = useState(false);

  const hidePaymentModal = () => {
    setIsShow(!isShow);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid></Container>
      </div>
    </React.Fragment>
  );
};

export default TrainerReports;
