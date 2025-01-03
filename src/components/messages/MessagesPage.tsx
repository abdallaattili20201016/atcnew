import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const MessagesPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const handleUserSelect = (userId: string, userName?: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || null);
  };

  const handleRefreshChats = () => {
    setRefreshFlag(prev => prev + 1);
  };

  return (
    <div className="d-flex flex-row" style={{ paddingTop: "70px", height: "100vh" }}>
      <ChatSidebar userId={userId} onSelectUser={handleUserSelect} refreshFlag={refreshFlag} />
      {selectedUserId ? (
        <ChatWindow
          userId={userId}
          recipientId={selectedUserId}
          senderName={selectedUserName}
          onMessageSent={handleRefreshChats}
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <p>Select a user to start chatting.</p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
