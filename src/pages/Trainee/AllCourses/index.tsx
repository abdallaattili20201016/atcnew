import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { db } from "../../../helpers/config";
import { useAuth } from "../../../helpers/auth_context";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";

// Define the Course type
type Course = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  students?: string[]; // Array of trainee UIDs
  isEnrolled?: boolean;
  isPendingRequest?: boolean;
};

const AllCourses = () => {
  document.title = "All Courses";

  const { currentUser } = useAuth();
  const [data, setData] = useState<Course[]>([]); // Update state type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]); // Can define a type if needed

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
    
        // Fetch all courses
        const coursesQuery = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData: Course[] = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
    
        // Fetch pending enrollment requests for the current trainee
        const requestsQuery = query(
          collection(db, "enrollmentRequests"),
          where("traineeId", "==", currentUser.uid),
          where("status", "==", "pending")
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestsData = requestsSnapshot.docs.map((doc) => doc.data());
    
        // Mark courses where the trainee is already enrolled
        const updatedCourses = coursesData.map((course) => {
          const isEnrolled = course.students?.includes(currentUser.uid) || false;
          const isPendingRequest = requestsData.some(
            (request) => request.courseId === course.id
          );
          return {
            ...course,
            isEnrolled,
            isPendingRequest,
          };
        });
    
        setData(updatedCourses);
      } catch (error) {
        console.error("Error fetching courses or requests:", error);
        toast.error("Error loading data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    

    loadData();
  }, [currentUser]);

  const handleRequestEnroll = async (course: any) => {
    try {
      await addDoc(collection(db, "enrollmentRequests"), {
        courseId: course.id,
        traineeId: currentUser.uid,
        traineeName: currentUser.displayName || "Unknown",
        courseTitle: course.title,
        status: "pending",
        requestedOn: serverTimestamp(),
      });

      // Add audit log for enrollment request
      await addDoc(collection(db, "auditLogs"), {
        action: "Request Enrollment",
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        details: {
          courseId: course.id,
          courseTitle: course.title,
        },
      });

      toast.success(`Enrollment request sent for "${course.title}"`);
      setPendingRequests((prev) => [
        ...prev,
        { courseId: course.id, status: "pending" },
      ]);

      // Update course status in UI
      setData((prevData) =>
        prevData.map((item) =>
          item.id === course.id ? { ...item, isPendingRequest: true } : item
        )
      );
    } catch (error) {
      console.error("Error requesting enrollment:", error);
      toast.error("Failed to send enrollment request. Please try again.");
    }
  };

  // Search functionality
  const handleSearch = async (e: any) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (!searchTerm) {
      setData((prev) => prev); // Reset to original data
      return;
    }

    const filteredData = data.filter((course: any) =>
      course.title.toLowerCase().includes(searchTerm)
    );
    setData(filteredData);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Fetch all courses
      const coursesQuery = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData: Course[] = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];

      // Fetch pending enrollment requests for the current trainee
      const requestsQuery = query(
        collection(db, "enrollmentRequests"),
        where("traineeId", "==", currentUser.uid),
        where("status", "==", "pending")
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsData = requestsSnapshot.docs.map((doc) => doc.data());

      // Mark courses where the trainee is already enrolled
      const updatedCourses = coursesData.map((course) => {
        const isEnrolled = course.students?.includes(currentUser.uid) || false;
        const isPendingRequest = requestsData.some(
          (request) => request.courseId === course.id
        );
        return {
          ...course,
          isEnrolled,
          isPendingRequest,
        };
      });

      setData(updatedCourses);
    } catch (error) {
      console.error("Error fetching courses or requests:", error);
      toast.error("Error loading data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="pb-4 gy-3">
            <Col sm={4}>
              <h1>All Courses</h1>
            </Col>
            <Col sm={8} className="ms-auto">
              <Form.Control
                type="text"
                placeholder="Search for courses"
                onChange={handleSearch}
              />
            </Col>
          </Row>

          {isLoading ? (
            <Spinner animation="grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : data.length > 0 ? (
            <Row>
              {data.map((course: Course) => ( // Update map parameter type
                <Col key={course.id} xxl={3} lg={4} sm={6}>
                  <Card className="card-body text-center">
                    <div className="avatar-sm mx-auto mb-3">
                      <div className="avatar-title bg-primary-subtle text-primary fs-base rounded">
                        <i className="ri-book-line"></i>
                      </div>
                    </div>
                    <h4 className="card-title">{course.title}</h4>
                    <p className="card-text text-muted">{course.description}</p>
                    <p>
                      <strong>Location:</strong> {course.location || "N/A"}
                    </p>
                    <Button
                      onClick={async () => {
                        if (course.isEnrolled) {
                          toast.info("You are already enrolled in this course.");
                        } else if (course.isPendingRequest) {
                          toast.info("You have already requested to enroll in this course.");
                        } else {
                          try {
                            await addDoc(collection(db, "enrollmentRequests"), {
                              courseId: course.id,
                              traineeId: currentUser.uid,
                              traineeName: currentUser.displayName || "Unknown",
                              courseTitle: course.title,
                              status: "pending",
                              requestedOn: serverTimestamp(),
                            });
                            toast.success("Enrollment request sent!");
                            loadData(); // Refresh data
                          } catch (error) {
                            console.error("Error requesting enrollment:", error);
                            toast.error("Failed to send enrollment request. Please try again.");
                          }
                        }
                      }}
                      className="btn btn-primary"
                      disabled={course.isEnrolled || course.isPendingRequest}
                    >
                      {course.isEnrolled
                        ? "Enrolled"
                        : course.isPendingRequest
                        ? "Request Sent"
                        : "Request Enroll"}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <NoSearchResult
              title1="No courses found."
              title2="Try searching with a different keyword."
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllCourses;
