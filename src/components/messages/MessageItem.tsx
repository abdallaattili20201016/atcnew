import React from 'react';

interface MessageItemProps {
  message: {
    senderId: string;
    senderName?: string;
    content: string;
    timestamp: string;
  };
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={`d-flex mb-2 ${
        isCurrentUser ? 'justify-content-end' : 'justify-content-start'
      }`}
    >
      <div
        className={`p-2 rounded ${
          isCurrentUser ? 'bg-primary text-white' : 'bg-light'
        }`}
        style={{ maxWidth: '70%' }}
      >
        <p className="mb-1">{message.content}</p>
        <small className="text-muted">
          {new Date(message.timestamp).toLocaleString()}
        </small>
      </div>
    </div>
  );
};

export default MessageItem;
