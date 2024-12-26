import React, { useState } from 'react';
import UserTable from './UserTable';
import { Container } from 'react-bootstrap';

const Users = () => {
  document.title = "User | Academic Training Center";

  const [isShow, setIsShow] = useState(false);

  const hideUserModal = () => {
    setIsShow(!isShow);
  };


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
