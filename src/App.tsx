import React from "react";

import "./App.css";
//import Scss
import "./assets/scss/themes.scss";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// routes
import Route from "./Routes/Index";
import { initializeApp } from "firebase/app";
// Import Firebase Configuration file
import { initFirebaseBackend } from "./helpers/firebase_helper";
import { ToastContainer } from "react-toastify";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

// init firebase backend
initFirebaseBackend(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the database to use it in other files
export { db };
export { storage };

function App() {
  return (
    <React.Fragment>
      <Route />
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
