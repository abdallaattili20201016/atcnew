// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";

// class FirebaseStorageBackend {
//   storage: firebase.storage.Storage;

//   constructor(firebaseConfig: any) {
//     if (firebaseConfig) {
//       firebase.initializeApp(firebaseConfig);
//       this.storage = firebase.storage();
//     }
//   }

//   uploadFileToStorage = async (
//     file: File,
//     path: string = "uploads"
//   ): Promise<string> => {
//     try {
//       const storageRef = this.storage.ref();
//       const fileRef = storageRef.child(`${file.name}`);
//       await fileRef.put(file);
//       const downloadURL = await fileRef.getDownloadURL();
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       throw error;
//     }
//   };
// }

// export { FirebaseStorageBackend };
