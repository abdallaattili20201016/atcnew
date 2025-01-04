import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { db } from "../../helpers/config";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { fetchUserNameById } from "../../helpers/firebase_helper"; // Add this import

const Dashboard = () => {
  document.title = "Dashboard";

  // State for dashboard data
  const [userStats, setUserStats] = useState({
    admins: 0,
    trainers: 0,
    trainees: 0,
  });
  const [activeCourses, setActiveCourses] = useState(0);
  const [recentActivities, setRecentActivities] = useState<{ description: string }[]>([]);
  const [monthlyCourseData, setMonthlyCourseData] = useState<{ name: string; courses: number }[]>([]);
  const [auditLogs, setAuditLogs] = useState<
    { userId: string; action: string; timestamp: string; changes: string }[]
  >([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({}); // Add this state

  // Pie chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user counts
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userCounts = { admins: 0, trainers: 0, trainees: 0 };
        usersSnapshot.forEach((doc) => {
          const role = doc.data().role;
          if (role === "admin") userCounts.admins += 1;
          else if (role === "trainer") userCounts.trainers += 1;
          else if (role === "trainee") userCounts.trainees += 1;
        });
        setUserStats(userCounts);

        // Fetch active courses
        const coursesSnapshot = await getDocs(
          query(collection(db, "courses"), where("status", "==", "active"))
        );
        setActiveCourses(coursesSnapshot.size);

        // Fetch recent activities
        const activitiesQuery = query(
          collection(db, "auditLogs"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activities = activitiesSnapshot.docs.map((doc) => doc.data() as { description: string });
        setRecentActivities(activities);

        // Fetch monthly course data (for Line Chart)
        const monthlyQuery = query(collection(db, "courses"), orderBy("start"));
        const monthlySnapshot = await getDocs(monthlyQuery);
        const monthlyData = monthlySnapshot.docs.map((doc) => ({
          name: new Date(doc.data().start.seconds * 1000).toLocaleDateString("en-US", {
            month: "short",
          }),
          courses: 1, // Adjust if storing course counts per month
        }));
        setMonthlyCourseData(monthlyData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchAuditLogs = async () => {
      try {
        // Query the auditLogs collection
        const logsQuery = query(
          collection(db, "auditLogs"),
          orderBy("timestamp", "desc"),
          limit(5) // Limit to the 5 most recent logs
        );
        const logsSnapshot = await getDocs(logsQuery);

        // Map over the documents and format data
        const logs = logsSnapshot.docs.map((doc) => {
          const data = doc.data();
          const changes = data.details?.updates
            ? Object.keys(data.details.updates)
                .map((key) => `${key}: ${data.details.updates[key]}`)
                .join(", ")
            : "No details available";

          return {
            userId: data.userId || "Unknown User",
            action: data.action || "Unknown Action",
            timestamp: data.timestamp?.toDate().toLocaleString() || "Unknown Time",
            changes,
          };
        });

        setAuditLogs(logs);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchDashboardData();
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const uniqueUserIds = Array.from(new Set(auditLogs.map((log) => log.userId)));
        const namesMap: { [key: string]: string } = {};
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            const name = await fetchUserNameById(userId);
            namesMap[userId] = name;
          })
        );
        setUserNames(namesMap);
      } catch (error) {
        console.error("Error fetching user names:", error);
      }
    };

    if (auditLogs.length > 0) {
      fetchUserNames();
    } else {
      setUserNames({});
    }
  }, [auditLogs]);

  return (
    <div className="page-content">
      <Container fluid>
        <h2 className="my-4">Dashboard</h2>

        {/* Statistics Section */}
        <Row>
          <Col lg={4}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-user-graduate fs-40 text-primary"></i>
                <h5 className="mt-3">Trainees Enrolled</h5>
                <h2 className="mb-0">{userStats.trainees}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-chalkboard-teacher fs-40 text-success"></i>
                <h5 className="mt-3">Trainers Available</h5>
                <h2 className="mb-0">{userStats.trainers}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="text-center">
              <Card.Body>
                <i className="las la-book fs-40 text-warning"></i>
                <h5 className="mt-3">Active Courses</h5>
                <h2 className="mb-0">{activeCourses}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mt-4">
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h4 className="card-title">User Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie dataKey="value" data={[
                        { name: "Admins", value: userStats.admins },
                        { name: "Trainers", value: userStats.trainers },
                        { name: "Trainees", value: userStats.trainees },
                      ]}
                      cx="50%" cy="50%" outerRadius={100}
                    >
                      {["Admins", "Trainers", "Trainees"].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Monthly Course Data</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyCourseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="courses" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activities Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h4 className="card-title">Recent Activities</h4>
                {auditLogs.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Timestamp</th>
                        <th>Changes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, index) => (
                        <tr key={index}>
                          <td>{userNames[log.userId] || "Loading..."}</td> {/* Update this line */}
                          <td>{log.action}</td>
                          <td>{log.timestamp}</td>
                          <td>{log.changes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No recent activities available.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
