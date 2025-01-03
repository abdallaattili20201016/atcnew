import React, { useEffect, useState } from 'react';
import { fetchRecentChats, fetchAllUsers } from '../../helpers/firebase_helper';

interface ChatSidebarProps {
  userId: string;
  onSelectUser: (recipientId: string, recipientName?: string) => void;
  refreshFlag: number; // <-- Add this
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ userId, onSelectUser, refreshFlag }) => {
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchChatsAndUsers = async () => {
      try {
        const chats = await fetchRecentChats(userId);
        const users = await fetchAllUsers();

        // Build a set of userIds from recent chats
        const recentUserIds = new Set(
          chats.map(chat => chat.senderId === userId ? chat.recipientId : chat.senderId)
        );

        setRecentChats(chats);
        // Exclude recentUserIds and the current user from allUsers
        setAllUsers(users.filter(u => !recentUserIds.has(u.id) && u.id !== userId));
      } catch (error) {
        console.error("Error fetching chats and users:", error);
      }
    };
    fetchChatsAndUsers();
  }, [userId, refreshFlag]); // <-- Add refreshFlag dependency

  return (
    <div className="d-flex flex-column p-3 border-end" style={{ width: "300px", height: "calc(100vh - 70px)", overflowY: "auto" }}>
      <h5 className="text-primary mb-3">Recent Chats</h5>
      <ul className="list-group list-group-flush">
        {recentChats.map((chat) => {
          const displayName = chat.senderId === userId ? chat.recipientName : chat.senderName;
          return (
            <button
              key={chat.id}
              className="list-group-item list-group-item-action d-flex align-items-center btn btn-link text-start"
              onClick={() =>
                onSelectUser(
                  chat.senderId === userId ? chat.recipientId : chat.senderId,
                  displayName
                )
              }
              type="button"
            >
              <div
                className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px" }}
              >
                {displayName?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <strong>{displayName || "Unknown"}</strong>
                <p className="text-muted mb-0">{chat.content.slice(0, 25)}...</p>
              </div>
            </button>
          );
        })}
      </ul>

      <h5 className="text-primary mt-4 mb-3">All Users</h5>
      <ul className="list-group list-group-flush">
        {allUsers.map((user) => (
          <button
            key={user.id}
            className="list-group-item list-group-item-action d-flex align-items-center btn btn-link text-start"
            onClick={() => onSelectUser(user.id, user.name)}
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
    </div>
  );
};

export default ChatSidebar;