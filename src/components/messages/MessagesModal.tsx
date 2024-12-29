import React, { useState, useEffect } from 'react';
import { fetchMessagesForUser, sendMessage } from '../../helpers/firebase_helper';
import { Timestamp } from 'firebase/firestore';
import InboxItem from './InboxItem';
import ComposeModal from './ComposeModal';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  senderName?: string; // Optional
  recipientName?: string; // Optional
  timestamp: Timestamp | string; // Firestore Timestamp or ISO string
}

interface MessagesModalProps {
  userId: string;
}

const MessagesModal: React.FC<MessagesModalProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const msgs = await fetchMessagesForUser(userId);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleSendMessage = async (recipientId: string, content: string) => {
    try {
      await sendMessage(userId, recipientId, content);
      const updatedMessages = await fetchMessagesForUser(userId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
      <div className="modal fade" id="messagesModal" tabIndex={-1} aria-labelledby="messagesModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="messagesModalLabel">Messages</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body d-flex">
              <div className="w-50 me-3">
                <h6>Inbox</h6>
                <ul className="list-group">
                  {messages.map((msg) => (
                    <InboxItem
                      key={msg.id}
                      message={{
                        senderId: msg.senderId,
                        content: msg.content,
                        timestamp: typeof msg.timestamp === "string" ? msg.timestamp : msg.timestamp.toDate().toISOString(),
                      }}
                      onSelect={() => handleSelectMessage(msg)}
                    />
                  ))}
                </ul>
              </div>
              <div className="w-50">
                {selectedMessage && (
                  <div>
                    <h6>Message Details</h6>
                    <p>
                      <strong>From:</strong> {selectedMessage.senderName || "Unknown"}
                    </p>
                    <p>
                      <strong>Message:</strong> {selectedMessage.content}
                    </p>
                    <p>
                      <strong>Timestamp:</strong>{" "}
                      {new Date(
                        typeof selectedMessage.timestamp === "string"
                          ? selectedMessage.timestamp
                          : selectedMessage.timestamp.toDate()
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <ComposeModal onSend={handleSendMessage} />
    </>
  );
};

export default MessagesModal;
