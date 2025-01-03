// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";

// class FirebaseFirestoreBackend {
//   firestore: firebase.firestore.Firestore;

//   constructor(firebaseConfig: any) {
//     if (firebaseConfig) {
//       firebase.initializeApp(firebaseConfig);
//       this.firestore = firebase.firestore();
//     }
//   }

//   getUserDetailsByUid = async (uid: string) => {
//     try {
//       const collection = firebase.firestore().collection("users");
//       const userDoc = await collection.doc(uid).get();

//       if (userDoc.exists) {
//         return userDoc.data();
//       } else {
//         console.log("No user found with the given UID.");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       return null;
//     }
//   };

//   async updateUserDetails(updatedData: any): Promise<void> {
//     try {
//       const userRef = this.firestore.collection("users").doc(String(this.uuid));
//       const docSnapshot = await userRef.get();
//       if (!docSnapshot.exists) {
//         console.error("User document not found.");
//         return;
//       }
//       await userRef.update(updatedData);
//       console.log("User updated successfully");
//     } catch (error) {
//       console.error("Error updating user:", error);
//       throw error;
//     }
//   }

//   async updateUserById(id: string, updatedData: any) {
//     try {
//       console.log("Submitting form with values:", updatedData);
//       const userRef = this.firestore.collection("users").doc(id);
//       const docSnapshot = await userRef.get();
//       if (!docSnapshot.exists) {
//         console.error("Document not found");
//         return;
//       }
//       await userRef.update({
//         username: updatedData.memberName,
//         email: updatedData.email,
//         phone: updatedData.mobile,
//         status: updatedData.status,
//         picture: updatedData.memberImage,
//       });
//       console.log("User updated successfully");
//     } catch (error: any) {
//       if (error.code === "permission-denied") {
//         console.error("Permission denied: Check Firestore rules.");
//       } else if (error.code === "not-found") {
//         console.error("Document not found.");
//       } else {
//         console.error("Error updating user:", error.message);
//       }
//       throw error;
//     }
//   }

//   addNewUserToFirestore = async (user: any) => {
//     const collection = firebase.firestore().collection("users");
//     const details = {
//       username: user.username,
//       email: user.email,
//       phone: user.phone,
//       picture: "",
//       status: 0,
//       city: user.city,
//       role: user.role,
//       createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
//       lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
//     };
//     await collection.doc(firebase.auth().currentUser?.uid).set(details);
//     return { user, details };
//   };

//   async fetchUsers(keyword = "") {
//     try {
//       let query: firebase.firestore.Query<firebase.firestore.DocumentData> =
//         this.firestore.collection("users");
//       if (keyword) {
//         query = query
//           .where("username", ">=", keyword)
//           .where("username", "<=", keyword + "\uf8ff");
//       }
//       const querySnapshot = await query.get();
//       return querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     }
//   }

//   getTrainerCourses = async (id?: string, searchKey?: string): Promise<any> => {
//     try {
//       if (id) {
//         const courseDocRef = this.firestore.collection("courses").doc(id);
//         const courseDoc = await courseDocRef.get();
//         if (courseDoc.exists) {
//           const data = courseDoc.data();
//           const currentDate = new Date();
//           const isExpired = data?.to && data.to.toDate() < currentDate;
//           return {
//             id: courseDoc.id,
//             ...data,
//             isExp: isExpired,
//           };
//         } else {
//           console.log("No course found with the given ID.");
//           return null;
//         }
//       } else {
//         let query = this.firestore
//           .collection("courses")
//           .where("trainer_id", "==", this.uuid);
//         if (searchKey) {
//           query = query
//             .where("title", ">=", searchKey)
//             .where("title", "<=", searchKey + "\uf8ff");
//         }
//         const querySnapshot = await query.get();
//         console.log("querySnapshot.docs :>> ", querySnapshot.docs);
//         if (!querySnapshot.empty) {
//           const currentDate = new Date();
//           return querySnapshot.docs.map((doc) => {
//             const data = doc.data();
//             const isExpired = data?.to && data.to.toDate() < currentDate;
//             return {
//               id: doc.id,
//               ...data,
//               isExp: isExpired,
//             };
//           });
//         } else {
//           console.log(
//             "No courses found for the trainer or matching search key."
//           );
//           return [];
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       throw error;
//     }
//   };

//   getAllReports = async (): Promise<any> => {
//     try {
//       const querySnapshot = await this.firestore.collection("reports").get();
//       if (!querySnapshot.empty) {
//         return querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//       } else {
//         console.log("No reports found.");
//         return [];
//       }
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       throw error;
//     }
//   };

//   deleteUser = async (userId: string) => {
//     try {
//       console.log(`Attempting to delete user with ID: ${userId}`);
//       const userDoc = this.firestore.collection("users").doc(userId);
//       await userDoc.delete();
//       console.log(`User with ID: ${userId} deleted successfully`);
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       throw error;
//     }
//   };
// }

// export { FirebaseFirestoreBackend };
