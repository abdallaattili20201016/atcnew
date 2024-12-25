import React, { useState } from "react";
import { Container } from "react-bootstrap";

const TrainerAnnouncements = () => {
  document.title = "TrainerAnnouncements";
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

export default TrainerAnnouncements;
