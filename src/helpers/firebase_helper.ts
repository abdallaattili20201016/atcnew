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
          (user: any) => {
            // On successful creation, resolve the promise with the current authenticated user
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
          (user: any) => {
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
          (user: any) => {
            // On successful login, resolve the promise with the current authenticated user
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
        .then(() => {
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
        .then(() => {
          this.uuid = undefined; // Clear the stored user ID
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

      await userRef.update({
        username: updatedData.memberName,
        email: updatedData.email,
        phone: updatedData.mobile,
        status: updatedData.status,
        picture: updatedData.memberImage,
      });

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
  deleteUser = async (userId: string) => {
    try {
      console.log(`Attempting to delete user with ID: ${userId}`);
      const userDoc = this.firestore.collection("users").doc(userId);
      await userDoc.delete();
      console.log(`User with ID: ${userId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  //end attili

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
      return userDoc.data().name || "Unknown"; // Adjust the field name if necessary
    } else {
      console.warn(`No user found with ID: ${userId}`);
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
export const logEvent = async (action: string, details: any) => {
  try {
    const db = firebase.firestore();
    await db.collection("auditLogs").add({
      action,
      details,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging event:", error);
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
