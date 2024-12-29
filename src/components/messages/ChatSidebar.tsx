import React, { useEffect, useState } from 'react';
import { fetchRecentChats, fetchAllUsers, fetchUserNameById } from '../../helpers/firebase_helper';

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
        // Fetch all users first to create a mapping of userId to userName
        const users = await fetchAllUsers();
        const userMap: { [key: string]: string } = {};
        users.forEach(user => {
          userMap[user.id] = user.name || "Unknown";
        });

        // Fetch recent chats
        const chats = await fetchRecentChats(userId);
        // Assign senderName using the userMap
        const chatsWithNames = chats.map(chat => ({
          ...chat,
          senderName: userMap[chat.senderId] || "Unknown",
        }));
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
    <div className="d-flex flex-column p-3 border-end mt-4" style={{ width: "300px", height: "100vh", overflowY: "scroll", marginTop: "60px" }}>
      <h5 className="text-primary mb-3">Recent Chats</h5>
      <ul className="list-group list-group-flush">
        {recentChats.map((chat) => (
          <li
            key={chat.id}
            className="list-group-item d-flex align-items-center list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectUser(chat.senderId === userId ? chat.recipientId : chat.senderId)}
          >
            <div
              className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              {chat.senderName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <strong>{chat.senderName || "Unknown"}</strong>
              <p className="text-muted mb-0">{chat.content.slice(0, 25)}...</p>
            </div>
          </li>
        ))}
      </ul>

      <h5 className="text-primary mt-4 mb-3">All Users</h5>
      <ul className="list-group list-group-flush">
        {allUsers.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex align-items-center list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectUser(user.id)}
          >
            <div
              className="avatar bg-info text-white rounded-circle me-3 d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <strong>{user.name || "Unknown"}</strong>
            </div>
          </li>
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
      >
        +
      </button>
    </div>
  );
};

export default ChatSidebar;