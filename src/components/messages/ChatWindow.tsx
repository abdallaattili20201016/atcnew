import React, { useEffect, useState, useRef } from "react";
import {
  doc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
import { db } from "../../helpers/config";
import { sendMessage } from "../../helpers/firebase_helper";
import MessageItem from "./MessageItem";
import LoadingIcon from "../LoadingIcon"; // <-- Adjust import path if needed

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: FirestoreTimestamp | string | number;
  senderName?: string;
  recipientName?: string;
}

interface ChatWindowProps {
  userId: string;
  recipientId: string;
  senderName: string | null;
  onMessageSent?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  recipientId,
  senderName,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Listen for changes to userId or recipientId, set loading, clear old messages
  useEffect(() => {
    setMessages([]);
    setLoading(true);

    const q = query(
      collection(db, "Messages"),
      where("senderId", "in", [userId, recipientId]),
      where("recipientId", "in", [userId, recipientId]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          recipientId: data.recipientId,
          content: data.content,
          timestamp: data.timestamp,
        } as Message;
      });
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, recipientId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(userId, recipientId, newMessage.trim());
        setNewMessage("");
        if (onMessageSent) {
          onMessageSent();
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  // Show loading screen before messages load
  if (loading) {
    return (
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-grow-1" style={{ height: "calc(100vh - 70px)" }}>
      <div className="chat-header border-bottom p-3 bg-light d-flex align-items-center">
        <div
          className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center"
          style={{ width: "40px", height: "40px" }}
        >
          {senderName?.[0]?.toUpperCase() || "U"}
        </div>
        <h5 className="mb-0">{senderName || "Unknown"}</h5>
      </div>
      <div className="d-flex flex-column p-3 chat-messages overflow-auto flex-grow-1">
        {messages.map((msg) => {
          let convertedTimestamp = "Unknown";
          if (msg.timestamp) {
            if (msg.timestamp instanceof FirestoreTimestamp) {
              convertedTimestamp = msg.timestamp.toDate().toString();
            } else {
              convertedTimestamp = msg.timestamp.toString();
            }
          }
          return (
            <MessageItem
              key={msg.id}
              message={{
                senderId: msg.senderId,
                content: msg.content,
                timestamp: convertedTimestamp,
              }}
              isCurrentUser={msg.senderId === userId}
            />
          );
        })}
      </div>
      <div className="chat-input p-3 border-top bg-white mb-3">
        <textarea
          ref={textAreaRef}
          className="form-control"
          rows={1}
          style={{ resize: "none", overflow: "hidden" }}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
        />
        <button className="btn btn-primary mt-2 w-100" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;