import React, { useState } from "react";
import { Container } from "react-bootstrap";

const AboutUs = () => {
  document.title = "AboutUs";
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <div className="mb-2">
            <h1>About Us</h1>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AboutUs;
