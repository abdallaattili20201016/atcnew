import React, { useEffect, useState } from "react";
import { fetchChatHistory, sendMessage, fetchUserNameById } from "../../helpers/firebase_helper";
import { Timestamp } from "firebase/firestore";
import MessageItem from "./MessageItem";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Timestamp | string | number;
  senderName?: string;
  recipientName?: string;
}

interface ChatWindowProps {
  userId: string;
  recipientId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const history = await fetchChatHistory(userId, recipientId);
        setMessages(history);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    fetchMessages();
  }, [userId, recipientId]);

  useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(userId, recipientId, newMessage.trim());
        setNewMessage("");
        const updatedHistory = await fetchChatHistory(userId, recipientId);
        setMessages(updatedHistory);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const formatTimestamp = (timestamp: Timestamp | string | number): string => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="chat-window d-flex flex-column flex-grow-1 mt-6" style={{ height: "calc(100vh - 120px)", marginTop: "60px" }}>
      <div className="chat-header border-bottom p-3 bg-light d-flex align-items-center">
        <div className="avatar bg-secondary text-white rounded-circle me-3" style={{ width: "40px", height: "40px" }}>
          {recipientId?.[0]?.toUpperCase() || "U"}
        </div>
        <h5 className="mb-0">{messages[0]?.recipientName || "You"}</h5>
        <button className="btn btn-outline-secondary ms-auto">Details</button>
      </div>
      <div className="d-flex flex-column p-3 chat-messages" style={{ backgroundColor: "#f8f9fa", height: "400px", overflowY: "scroll", padding: "20px" }}>
        {messages.map((msg, index) => (
          <MessageItem
            key={index}
            message={{ 
              senderId: msg.senderId,
              senderName: msg.senderName || "Unknown",
              content: msg.content, 
              timestamp: formatTimestamp(msg.timestamp) 
            }}
            isCurrentUser={msg.senderId === userId}
          />
        ))}
      </div>
      <div className="chat-input p-3 border-top bg-white">
        <textarea
          className="form-control"
          rows={2}
          value={newMessage}
          placeholder="Type your message..."
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button className="btn btn-primary mt-2 w-100" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;