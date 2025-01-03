import React, { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const AdminAuditLogPage = () => {
  
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("auditLogs")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(data);
      });
  }, []);

  return (
    <Container className="my-4">
      <h2>Audit Logs</h2>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Action</th>
            <th>Details</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{JSON.stringify(log.details)}</td>
              <td>{log.timestamp?.toDate().toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminAuditLogPage;