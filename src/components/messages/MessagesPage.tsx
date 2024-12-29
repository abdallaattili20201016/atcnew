import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const MessagesPage: React.FC<{ userId: string }> = ({ userId }) => {
  console.log("MessagesPage rendered with userId:", userId);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="d-flex flex-column flex-md-row mt-5">
      {/* Sidebar */}
      <ChatSidebar userId={userId} onSelectUser={handleUserSelect} />

      {/* Chat Window */}
      {selectedUserId ? (
        <ChatWindow userId={userId} recipientId={selectedUserId} />
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <p className="text-center mt-5">Select a user to start chatting.</p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
