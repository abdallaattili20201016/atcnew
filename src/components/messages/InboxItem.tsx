import React from 'react';

interface InboxItemProps {
  message: {
    senderName?: string; // Ensure senderName is included
    content: string;
    timestamp: string;
  };
  onSelect: () => void;
}

const InboxItem: React.FC<InboxItemProps> = ({ message, onSelect }) => {
  return (
    <li
      className="list-group-item d-flex align-items-center list-group-item-action" // Added list-group-item-action
      onClick={onSelect}
    >
      <div>
        <strong>{message.senderName || "Unknown"}</strong> {/* Display senderName */}
        <p className="text-muted mb-0">{message.content}</p>
        <small className="text-muted">
          {new Date(message.timestamp).toLocaleString()}
        </small>
      </div>
    </li>
  );
};

export default InboxItem;
