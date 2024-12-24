import React, { useState } from 'react';
import UserTable from './UserTable';
import { Container } from 'react-bootstrap';

const Users = () => {
  document.title = "User | PULSE";

  const [isShow, setIsShow] = useState(false);

  const hideUserModal = () => {
    setIsShow(!isShow);
  };

  // Add inline CSS here to adjust layout
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      .app-menu { display: none; }
     #page-topbar {
  position: absolute; /* or 'fixed', depending on your need */
  left: 0; /* Set the left position to 0 */
}
      .main-content {
       margin:0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <UserTable isShow={isShow} hideUserModal={hideUserModal} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Users;
