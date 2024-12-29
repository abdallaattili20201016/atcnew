import React, { useEffect, useState } from 'react';
import { fetchRecentChats, fetchAllUsers } from '../../helpers/firebase_helper';

interface ChatSidebarProps {
  userId: string;
  onSelectUser: (recipientId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ userId, onSelectUser }) => {
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchChatsAndUsers = async () => {
      try {
        // Fetch recent chats
        const chats = await fetchRecentChats(userId);

        // Fetch all users to map userId to userName
        const users = await fetchAllUsers();
        const userMap: { [key: string]: string } = {};
        users.forEach(user => {
          userMap[user.id] = user.name || "Unknown";
        });

        // Assign senderName using userMap
        const chatsWithNames = chats.map((chat) => {
          const otherUserId = chat.senderId === userId ? chat.recipientId : chat.senderId;
          return {
            ...chat,
            senderName: userMap[otherUserId] || "Unknown",
          };
        });
        setRecentChats(chatsWithNames);

        // Set allUsers excluding the current user
        setAllUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error fetching chats and users:", error);
      }
    };
    fetchChatsAndUsers();
  }, [userId]);

  return (
    <div className="d-flex flex-column p-3 border-end" style={{ width: "300px", height: "calc(100vh - 70px)", overflowY: "auto" }}> {/* Adjusted height */}
      <h5 className="text-primary mb-3">Recent Chats</h5>
      <ul className="list-group list-group-flush">
        {recentChats.map((chat) => (
          <button
            key={chat.id}
            className="list-group-item list-group-item-action d-flex align-items-center btn btn-link text-start"
            onClick={() => onSelectUser(chat.senderId === userId ? chat.recipientId : chat.senderId)}
            type="button"
          >
            <div className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px" }}>
              {chat.senderName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <strong>{chat.senderName || "Unknown"}</strong>
              <p className="text-muted mb-0">{chat.content.slice(0, 25)}...</p>
            </div>
          </button>
        ))}
      </ul>

      <h5 className="text-primary mt-4 mb-3">All Users</h5>
      <ul className="list-group list-group-flush">
        {allUsers.map((user) => (
          <button
            key={user.id}
            className="list-group-item list-group-item-action d-flex align-items-center btn btn-link text-start"
            onClick={() => onSelectUser(user.id)}
            type="button"
          >
            <div className="avatar bg-info text-white rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px" }}>
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <strong>{user.name || "Unknown"}</strong>
            </div>
          </button>
        ))}
      </ul>
      <button
        className="btn btn-primary rounded-circle position-absolute"
        style={{
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => alert('Start a new chat')}
        type="button"
      >
        +
      </button>
    </div>
  );
};

export default ChatSidebar;