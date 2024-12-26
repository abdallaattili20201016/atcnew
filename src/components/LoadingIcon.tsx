import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingIcon: React.FC = () => (
  <div className="loading-icon">
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingIcon;