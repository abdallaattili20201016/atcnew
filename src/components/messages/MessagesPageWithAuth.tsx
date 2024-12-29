import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import MessagesPage from "./MessagesPage";

const MessagesPageWithAuth: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" />;
  }

  return <MessagesPage userId={currentUser.uid} />;
};

export default MessagesPageWithAuth;
