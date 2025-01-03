// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";

// export const logEvent = async (action: string, details: any) => {
//   try {
//     const db = firebase.firestore();
//     await db.collection("auditLogs").add({
//       action,
//       details,
//       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//     });
//   } catch (error) {
//     console.error("Error logging event:", error);
//   }
// };
