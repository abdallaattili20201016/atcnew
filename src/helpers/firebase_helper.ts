import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getFirestore, doc, getDoc, deleteDoc, collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./config";

class FirebaseAuthBackend {
  firestore: firebase.firestore.Firestore;
  storage: firebase.storage.Storage;
  uuid: String | undefined;
  constructor(firebaseConfig: any) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      this.storage = firebase.storage();
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          console.log("user :>> ", user);
          this.uuid = user.uid;
          sessionStorage.setItem("authUser", JSON.stringify(user));
        } else {
          sessionStorage.removeItem("authUser");
        }
      });
    }
    this.storage = firebase.storage();
    this.firestore = firebase.firestore();
  }

  /**
   * Uploads a file to Firebase Storage and returns the download URL.
   * Allows specifying a custom path for saving the file, defaulting to 'uploads/'.
   */
  uploadFileToStorage = async (
    file: File,
    path: string = "uploads"
  ): Promise<string> => {
    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(`${file.name}`);
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  /**
   * Registers the user with given details
   */
  // Function to register a user with email and password
  registerUser = (email: any, password: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password) // Create a new user with the provided email and password
        .then(
          async (user: any) => {
            // On successful creation, resolve the promise with the current authenticated user
            await logEvent("RegisterUser", { email, userId: this.uuid }, {}, this.uuid || "");
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            // On error, reject the promise with the actual error object
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Registers the user with given details
   */
  editProfileAPI = (email: any, password: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          async (user: any) => {
            await logEvent("EditProfile", { email, userId: this.uuid }, {}, this.uuid || "");
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  // Function to log in a user with email and password
  loginUser = (email: any, password: any) => {
    return new Promise((resolve, reject) => {
      // Use Firebase Authentication service to sign in with email and password
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password) // Attempt to sign in the user with provided email and password
        .then(
          async (user: any) => {
            // On successful login, resolve the promise with the current authenticated user
            await logEvent("LoginUser", { email }, {}, this.uuid || "");
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            // On error, handle the error using a custom error handler and reject the promise
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(async () => {
          await logEvent("ForgetPassword", { email }, {}, this.uuid || "");
          resolve(true);
        })
        .catch((error: any) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(async () => {
          this.uuid = undefined; // Clear the stored user ID
          await logEvent("LogoutUser", {}, {}, this.uuid || "");
          resolve(true);
        })
        .catch((error: any) => {
          reject(this._handleError(error));
        });
    });
  };

  /*
  Returns the fetched user details by UID
*/
  getUserDetailsByUid = async (uid: string) => {
    try {
      const collection = firebase.firestore().collection("users");
      const userDoc = await collection.doc(uid).get();

      if (userDoc.exists) {
        return userDoc.data(); // returns the user's data if found
      } else {
        console.log("No user found with the given UID.");
        return null; // return null if no user found
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null; // return null in case of error
    }
  };

  // Function to update a user in the 'users' collection by UID
  async updateUserDetails(updatedData: any): Promise<void> {
    try {
      // Reference to the specific user's document
      const userRef = this.firestore.collection("users").doc(String(this.uuid));

      // Check if the document exists before attempting to update it
      const docSnapshot = await userRef.get();
      if (!docSnapshot.exists) {
        console.error("User document not found.");
        return; // User document not found, exit the function
      }

      // Update the user's document with the new data
      await userRef.update(updatedData);
      await logEvent("UpdateUserDetails", updatedData, {}, this.uuid || "");
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Function to update a user by ID
  async updateUserById(id: string, updatedData: any) {
    try {
      console.log("Submitting form with values:", updatedData);
      const userRef = this.firestore.collection("users").doc(id);

      // Make sure the document exists
      const docSnapshot = await userRef.get();
      if (!docSnapshot.exists) {
        console.error("Document not found");
        return;
      }

      const originalData = docSnapshot.data();

      await userRef.update({
        username: updatedData.memberName,
        email: updatedData.email,
        phone: updatedData.mobile,
        status: updatedData.status,
        picture: updatedData.memberImage,
      });

      await logEvent("UpdateUser", updatedData, originalData, this.uuid || "");

      console.log("User updated successfully");
    } catch (error: any) {
      if (error.code === "permission-denied") {
        console.error("Permission denied: Check Firestore rules.");
      } else if (error.code === "not-found") {
        console.error("Document not found.");
      } else {
        console.error("Error updating user:", error.message);
      }
      throw error;
    }
  }

  /*
    add New User To Firestore
  */
  addNewUserToFirestore = async (user: any) => {
    const collection = firebase.firestore().collection("users");

    const details = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      picture: "", // You can modify this if you want to upload a user profile picture as well
      status: 0, // 1-admin, 2-warehouse, 3-pharmacy, -1-disabled, 0-pending
      city: user.city,
      role: user.role,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Save the user details to Firestore under the current user ID
    await collection.doc(firebase.auth().currentUser?.uid).set(details);

    await logEvent("AddUser", details, {}, this.uuid || "");

    // Return the user and details object
    return { user, details };
  };

  //fetches the users from the firebase

  async fetchUsers(keyword = "") {
    try {
      // Use firebase.firestore.Query instead of CollectionReference
      let query: firebase.firestore.Query<firebase.firestore.DocumentData> =
        this.firestore.collection("users");

      // If a keyword is provided, filter users by title
      if (keyword) {
        query = query
          // Use a greater-than or equal condition for the beginning of the range
          .where("username", ">=", keyword)
          // Use a less-than or equal condition to include all matching usernames
          .where("username", "<=", keyword + "\uf8ff"); // '\uf8ff' ensures all possible characters after the keyword are included
      }
      // Execute the query and get the snapshot of the result
      const querySnapshot = await query.get();
      // Map the results to an array of user data with user ID
      return querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID
        ...doc.data(), // Include all the fields from the document
      }));
    } catch (error) {
      // Handle errors by logging the error and throwing it for further handling
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  //attili

  

///////////////////////////////////////////
  getAllReports = async (): Promise<any> => {
    try {
      const querySnapshot = await this.firestore.collection("reports").get();
  
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        console.log("No reports found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  };
  ///////////////////////////////////////////
  
  /**
   * Deletes a user from Firestore.
   */
  // Removed duplicate deleteUser function in the class

  //end attili

  getAllCourses = async (searchKey?: string): Promise<any> => {
    try {
      // Get reference to the "courses" collection
      let query;

      // Add search functionality for title or description
      if (searchKey) {
        query = this.firestore
          .collection("courses")
          .where("title", ">=", searchKey)
          .where("title", "<=", searchKey + "\uf8ff");
      } else {
        query = this.firestore.collection("courses");
      }

      // Fetch all matching courses
      const querySnapshot = await query.get();

      if (!querySnapshot.empty) {
        const currentUserId = this.uuid; // Assuming `uuid` is your user ID
        const currentDate = new Date();

        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const isExpired = data?.to && data.to.toDate() < currentDate;

          // Check if the current user ID exists in the "students" array
          const isEnrolled =
            Array.isArray(data.students) &&
            data.students.includes(currentUserId);

          return {
            id: doc.id,
            ...data,
            isExp: isExpired,
            isEnrolled: isEnrolled,
          };
        });
      } else {
        console.log("No courses found matching the criteria.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  };
  async handleEnrollCourse(courseId: string): Promise<void> {
    try {
      const courseRef = this.firestore.collection("courses").doc(courseId);

      // Get the course document
      const courseDoc = await courseRef.get();
      if (!courseDoc.exists) {
        throw new Error("Course not found");
      }

      const courseData = courseDoc.data();
      const students = courseData?.students || [];

      // Check if the user is already enrolled
      const isEnrolled = students.includes(this.uuid);

      // Update the students array: add or remove the user
      const updatedStudents = isEnrolled
        ? students.filter((id: string) => id !== this.uuid) // Remove the user
        : [...students, this.uuid]; // Add the user

      await courseRef.update({ students: updatedStudents });
      await logEvent("EnrollCourse", { courseId }, {}, this.uuid || "");
    } catch (error) {
      console.error("Error handling course enrollment:", error);
      throw error;
    }
  }

  async getTraineeCourses(): Promise<any[]> {
    try {
      const coursesRef = this.firestore.collection("courses");

      // Query courses where `students` array contains `this.uuid`
      const querySnapshot = await coursesRef
        .where("students", "array-contains", this.uuid)
        .get();

      if (querySnapshot.empty) {
        console.log("No courses found for this user.");
        return [];
      }

      // Map the results to an array of course data
      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Courses for user:", courses);
      return courses;
    } catch (error) {
      console.error("Error fetching courses for student:", error);
      throw error;
    }
  }

  getTrainerCourses = async (id?: string, searchKey?: string): Promise<any> => {
    try {
      if (id) {
        // Fetch a specific course by ID
        const courseDocRef = this.firestore.collection("courses").doc(id);
        const courseDoc = await courseDocRef.get();

        if (courseDoc.exists) {
          const data = courseDoc.data();
          const currentDate = new Date();
          const isExpired = data?.to && data.to.toDate() < currentDate;

          return {
            id: courseDoc.id,
            ...data,
            isExp: isExpired,
          };
        } else {
          console.log("No course found with the given ID.");
          return null;
        }
      } else {
        // Fetch all courses for the trainer with optional search key
        let query = this.firestore
          .collection("courses")
          .where("trainer_id", "==", this.uuid);

        if (searchKey) {
          // Add search functionality for title or description
          query = query
            .where("title", ">=", searchKey)
            .where("title", "<=", searchKey + "\uf8ff");
        }

        const querySnapshot = await query.get();
        console.log("querySnapshot.docs :>> ", querySnapshot.docs);
        if (!querySnapshot.empty) {
          const currentDate = new Date();
          return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const isExpired = data?.to && data.to.toDate() < currentDate;

            return {
              id: doc.id,
              ...data,
              isExp: isExpired,
            };
          });
        } else {
          console.log(
            "No courses found for the trainer or matching search key."
          );
          return [];
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  };

  async addEditAssignment(assignment: any, file?: File): Promise<any> {
    try {
      const courseRef = this.firestore
        .collection("courses")
        .doc(assignment.course_id);

      // Check if the course exists
      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }

      let fileUrl;

      // If a new file is provided, upload it and get the file URL
      if (file) {
        fileUrl = await this.uploadFileToStorage(file, "assignments");
      }

      // Prepare the new assignment data
      const newAssignment = {
        title: assignment.title,
        mark: assignment.mark,
        start: assignment.start,
        end: assignment.end,
        submits: assignment.submits,
        ...(fileUrl ? { fileUrl } : {}),
      };

      if (assignment.assignment_id != null) {
        // Edit mode: Update an existing assignment in the array
        const courseData = courseSnapshot.data();
        const assignments = courseData?.assignments || [];

        // Find the assignment by id and update it
        const assignmentIndex = assignments.findIndex(
          (a: any, i: any) => i === assignment.assignment_id
        );
        if (assignmentIndex !== -1) {
          // Update the specific assignment
          assignments[assignmentIndex] = {
            ...assignments[assignmentIndex],
            ...newAssignment,
          };
        } else {
          throw new Error("Assignment not found");
        }

        // Update the course document with the modified assignments array
        await courseRef.update({
          assignments: assignments,
          updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await logEvent("EditAssignment", newAssignment, courseData, this.uuid || "");

        console.log("Assignment updated successfully");
        return newAssignment;
      } else {
        // Add mode: Add a new assignment to the array
        const courseData = courseSnapshot.data();
        const assignments = courseData?.assignments || [];

        // Assign a new ID (could be auto-generated or based on index or another field)
        const newAssignmentData = newAssignment;

        // Add the new assignment to the array
        assignments.push(newAssignmentData);

        // Update the course document with the new assignments array
        await courseRef.update({
          assignments: assignments,
        });

        await logEvent("AddAssignment", newAssignmentData, {}, this.uuid || "");

        console.log("Assignment added successfully");
        return newAssignmentData;
      }
    } catch (error) {
      console.error("Error in addEditAssignment:", error);
      throw error;
    }
  }

  async deleteAssignment(course_id: any, assignment_id: any): Promise<any> {
    try {
      const courseRef = this.firestore.collection("courses").doc(course_id);

      // Check if the course exists
      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }
      if (assignment_id != null) {
        // Edit mode: Update an existing assignment in the array
        const courseData = courseSnapshot.data();
        const assignments = courseData?.assignments || [];

        // Find the assignment by id and remove it
        const assignmentIndex = assignments.findIndex(
          (a: any, i: any) => i === assignment_id
        );
        console.log("assignmentIndex :>> ", assignmentIndex);
        if (assignmentIndex !== -1) {
          // Remove the assignment from the array
          assignments.splice(assignmentIndex, 1);

          // Update the course document with the modified assignments array
          await courseRef.update({
            assignments: assignments,
            updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
          });

          await logEvent("DeleteAssignment", {}, courseData, this.uuid || "");

          console.log("Assignment deleted successfully");
        } else {
          throw new Error("Assignment not found");
        }
      } else {
        throw new Error("Invalid assignment ID");
      }
    } catch (error) {
      console.error("Error in deleteAssignment:", error);
      throw error;
    }
  }

  async addEditDocument(data: any, file?: File): Promise<any> {
    try {
      const courseRef = this.firestore
        .collection("courses")
        .doc(data.course_id);

      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }

      let fileUrl;
      const courseData = courseSnapshot.data();
      const documents = courseData?.documents || [];

      if (file) {
        fileUrl = await this.uploadFileToStorage(file, "documents");
      }

      const newDocument = {
        title: data.title,
        ...(fileUrl ? { fileUrl } : {}),
      };

      if (data.document_id != null) {
        const index = documents.findIndex(
          (a: any, i: any) => i === data.document_id
        );
        if (index !== -1) {
          documents[index] = {
            ...documents[index],
            ...newDocument,
          };
        } else {
          throw new Error("Document not found");
        }

        await courseRef.update({
          documents: documents,
          updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await logEvent("EditDocument", newDocument, courseData, this.uuid || "");

        return newDocument;
      } else {
        documents.push(newDocument);

        await courseRef.update({
          documents: documents,
        });

        await logEvent("AddDocument", newDocument, {}, this.uuid || "");

        return newDocument;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteDocuments(course_id: any, document_id: any): Promise<any> {
    try {
      const courseRef = this.firestore.collection("courses").doc(course_id);

      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }

      if (document_id != null) {
        const courseData = courseSnapshot.data();
        const documents = courseData?.documents || [];

        const index = documents.findIndex(
          (a: any, i: any) => i === document_id
        );

        if (index !== -1) {
          documents.splice(index, 1);

          await courseRef.update({
            documents: documents,
            updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
          });

          await logEvent("DeleteDocument", {}, courseData, this.uuid || "");
        } else {
          throw new Error("document not found");
        }
      } else {
        throw new Error("Invalid document ID");
      }
    } catch (error) {
      throw error;
    }
  }

  async submitAssignment(
    course_id: any,
    assignment_id: any,
    file: File
  ): Promise<any> {
    try {
      const courseRef = this.firestore.collection("courses").doc(course_id);

      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }

      let fileUrl;
      const courseData = courseSnapshot.data();
      const assignments = courseData?.assignments || [];

      if (file) {
        fileUrl = await this.uploadFileToStorage(file, "submitions");
      }

      const newObj = {
        user_id: this.uuid,
        mark: null,
        fileUrl,
      };

      const index = assignments.findIndex(
        (a: any, i: any) => i === assignment_id
      );
      if (index != -1)
        assignments[index].submits = [...assignments[index].submits, newObj];

      await courseRef.update({
        assignments: assignments,
        updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await logEvent("SubmitAssignment", newObj, courseData, this.uuid || "");
    } catch (error) {
      throw error;
    }
  }

  async deleteSubmission(course_id: any, assignment_id: number): Promise<any> {
    try {
      const courseRef = this.firestore.collection("courses").doc(course_id);

      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }

      const courseData = courseSnapshot.data();
      const assignments = courseData?.assignments || [];

      if (assignments[assignment_id]) {
        // Create a copy of the assignments array to modify
        const updatedAssignments = [...assignments];

        // Filter the submits array for the specified assignment
        updatedAssignments[assignment_id].submits = updatedAssignments[
          assignment_id
        ].submits.filter((submission: any) => submission.user_id !== this.uuid);

        // Update the entire assignments array
        await courseRef.update({
          assignments: updatedAssignments,
          updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await logEvent("DeleteSubmission", {}, courseData, this.uuid || "");
      } else {
        throw new Error("Assignment not found");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      throw error;
    }
  }

  async markAssignment(
    course_id: any,
    assignment_id: any,
    user_id: any,
    mark: number
  ): Promise<any> {
    try {
      const courseRef = this.firestore.collection("courses").doc(course_id);

      const courseSnapshot = await courseRef.get();
      if (!courseSnapshot.exists) {
        throw new Error("Course not found");
      }

      const courseData = courseSnapshot.data();
      const assignments = courseData?.assignments || [];

      // Find the assignment
      const assignmentIndex = assignments.findIndex(
        (a: any, i: any) => i === assignment_id
      );
      if (assignmentIndex === -1) {
        throw new Error("Assignment not found");
      }

      const assignment = assignments[assignmentIndex];

      // Find the submission by user_id
      const submissionIndex = assignment.submits.findIndex(
        (submission: any) => submission.user_id === user_id
      );
      if (submissionIndex === -1) {
        throw new Error("Submission not found for the specified user");
      }

      // Update the mark
      assignment.submits[submissionIndex].mark = mark;

      // Update the course document in Firestore
      await courseRef.update({
        assignments: assignments,
        updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await logEvent("MarkAssignment", { mark }, courseData, this.uuid || "");
    } catch (error) {
      throw error;
    }
  }






  //////////////// end 2 attili

  getAuthenticatedUser = () => {
    if (!sessionStorage.getItem("authUser")) return null;
    return JSON.parse(sessionStorage.getItem("authUser") || "");
  };

  _handleError(error: any) {
    return error; // Return the full error object
  }
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  senderName?: string; // Optional
  recipientName?: string; // Optional
  timestamp: Timestamp | string; // Can be a Firestore Timestamp or an ISO string
}

export const fetchMessagesForUser = async (userId: string): Promise<Message[]> => {
  const q = query(
    collection(db, "Messages"),
    where("senderId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);

  // Instead, return messages without senderName and recipientName
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Remove senderName and recipientName
    } as Message;
  });
};

// Remove the hardcoded senderName and use serverTimestamp for consistent timestamp handling
export const sendMessage = async (senderId: string, recipientId: string, content: string) => {
  const newMessage = {
    senderId,
    recipientId,
    content,
    timestamp: serverTimestamp(), // Use Firestore server timestamp
    // Remove senderName here
  };
  await addDoc(collection(db, "Messages"), newMessage);
};

export const fetchRecentChats = async (userId: string): Promise<Message[]> => {
  try {
    const q1 = query(
      collection(db, "Messages"),
      where("senderId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const q2 = query(
      collection(db, "Messages"),
      where("recipientId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    let results = [...snap1.docs, ...snap2.docs].map((doc) => ({
      id: doc.id, ...doc.data(),
    })) as Message[];

    // Deduplicate by the "otherUserId"
    const map = new Map<string, Message>();
    results.forEach(m => {
      const otherUserId = (m.senderId === userId) ? m.recipientId : m.senderId;
      if (!map.has(otherUserId)) map.set(otherUserId, m);
      else {
        // keep the newest
        const existing = map.get(otherUserId)!;
        const existingTime = existing.timestamp instanceof Timestamp
          ? existing.timestamp.toDate().getTime()
          : new Date(existing.timestamp).getTime();
        const currentTime = m.timestamp instanceof Timestamp
          ? m.timestamp.toDate().getTime()
          : new Date(m.timestamp).getTime();
        if (currentTime > existingTime) map.set(otherUserId, m);
      }
    });
    results = Array.from(map.values()).sort((a, b) => {
      const at = a.timestamp instanceof Timestamp ? a.timestamp.toDate() : new Date(a.timestamp);
      const bt = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp);
      return bt.getTime() - at.getTime();
    });

    const allUsers = await fetchAllUsers();
    const userMap = Object.fromEntries(allUsers.map(u => [u.id, u.name || "Unknown"]));
    results.forEach(m => {
      m.senderName = userMap[m.senderId] || "Unknown";
      m.recipientName = (m.recipientId === userId) ? "You" : (userMap[m.recipientId] || "Unknown");
    });
    return results;
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    throw error;
  }
};

export const fetchChatHistory = async (userId: string, recipientId: string): Promise<Message[]> => {
  try {
    const q = query(
      collection(db, 'Messages'),
      where('senderId', 'in', [userId, recipientId]),
      where('recipientId', 'in', [userId, recipientId]),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    console.log("Fetched Chat History:", snapshot.docs.map(doc => doc.data())); // Debugging Log

    // Fetch all users to map IDs to names
    const allUsers = await fetchAllUsers();
    const userMap = Object.fromEntries(allUsers.map(u => [u.id, u.name || "Unknown"]));

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        senderName: userMap[data.senderId] || "Unknown",
        recipientId: data.recipientId,
        content: data.content,
        timestamp: data.timestamp,
      };
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw new Error('Failed to fetch chat history');
  }
};

export const fetchAllUsers = async () => {
  const q = query(collection(db, "users"));
  const snapshot = await getDocs(q);
  console.log("Fetched All Users:", snapshot.docs.map(doc => doc.data()));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.username || "Unknown",
      ...data,
    };
  });
};

export const fetchUserNameById = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.username || "Unknown";
    } else {
      return "Unknown";
    }
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "Unknown";
  }
};

/**
 * Logs an event to the audit logs.
 */
export const logEvent = async (
  action: string,
  updates: any,
  original: any,
  userId: String
) => {
  try {
    const db = firebase.firestore();
    await db.collection("auditLogs").add({
      action,
      details: {
        updates,  // The new values
        original, // The old values
      },
      userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging event:", error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);

    // Fetch the original user data before deletion
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists) {
      console.error("User not found!");
      return;
    }
    const originalData = userSnapshot.data();

    // Delete the user document
    await deleteDoc(userRef);

    // Log the deletion event with original data
    await logEvent("DeleteUser", {}, originalData, userId);

    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

let _fireBaseBackend: any = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config: any) => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
