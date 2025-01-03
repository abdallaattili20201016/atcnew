// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";

// class FirebaseAuthBackend {
//   // ...existing code...
//   uuid: String | undefined;
//   constructor(firebaseConfig: any) {
//     if (firebaseConfig) {
//       firebase.initializeApp(firebaseConfig);
//       firebase.auth().onAuthStateChanged((user: any) => {
//         if (user) {
//           console.log("user :>> ", user);
//           this.uuid = user.uid;
//           sessionStorage.setItem("authUser", JSON.stringify(user));
//         } else {
//           sessionStorage.removeItem("authUser");
//         }
//       });
//     }
//   }

//   registerUser = (email: any, password: any) => {
//     return new Promise((resolve, reject) => {
//       firebase
//         .auth()
//         .createUserWithEmailAndPassword(email, password)
//         .then(
//           (user: any) => {
//             resolve(firebase.auth().currentUser);
//           },
//           (error: any) => {
//             reject(this._handleError(error));
//           }
//         );
//     });
//   };

//   loginUser = (email: any, password: any) => {
//     return new Promise((resolve, reject) => {
//       firebase
//         .auth()
//         .signInWithEmailAndPassword(email, password)
//         .then(
//           (user: any) => {
//             resolve(firebase.auth().currentUser);
//           },
//           (error: any) => {
//             reject(this._handleError(error));
//           }
//         );
//     });
//   };

//   forgetPassword = (email: any) => {
//     return new Promise((resolve, reject) => {
//       firebase
//         .auth()
//         .sendPasswordResetEmail(email, {
//           url:
//             window.location.protocol + "//" + window.location.host + "/login",
//         })
//         .then(() => {
//           resolve(true);
//         })
//         .catch((error: any) => {
//           reject(this._handleError(error));
//         });
//     });
//   };

//   logout = () => {
//     return new Promise((resolve, reject) => {
//       firebase
//         .auth()
//         .signOut()
//         .then(() => {
//           this.uuid = undefined;
//           resolve(true);
//         })
//         .catch((error: any) => {
//           reject(this._handleError(error));
//         });
//     });
//   };

//   getAuthenticatedUser = () => {
//     if (!sessionStorage.getItem("authUser")) return null;
//     return JSON.parse(sessionStorage.getItem("authUser") || "");
//   };

//   _handleError(error: any) {
//     return error;
//   }
// }

// export { FirebaseAuthBackend };
