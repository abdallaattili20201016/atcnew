import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../helpers/config'; // Adjust the import path as needed

interface InboxItemProps {
  message: {
    senderId: string;
    content: string;
    timestamp: string;
  };
  onSelect: () => void;
}

const InboxItem: React.FC<InboxItemProps> = ({ message, onSelect }) => {
  const [senderName, setSenderName] = useState<string>('Unknown');

  useEffect(() => {
    const fetchSenderName = async () => {
      if (message.senderId) {
        try {
          const docRef = doc(db, 'users', message.senderId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSenderName(docSnap.data().name || 'Unknown'); // Adjust the field name if necessary
          }
        } catch (error) {
          console.error('Error fetching sender name:', error);
        }
      }
    };
    fetchSenderName();
  }, [message.senderId]);

  return (
    <li className="list-group-item list-group-item-action d-flex align-items-center" onClick={onSelect}>
      <div className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px" }}>
        {senderName?.[0]?.toUpperCase() || "U"}
      </div>
      <div>
        <strong>{senderName}</strong>
        <p className="mb-1">{message.content}</p>
        <small className="text-muted">
          {new Date(message.timestamp).toLocaleString()}
        </small>
      </div>
    </li>
  );
};

export default InboxItem;
