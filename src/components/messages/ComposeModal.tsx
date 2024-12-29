import React, { useState } from 'react';

interface ComposeModalProps {
  onSend: (recipientId: string, content: string) => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onSend }) => {
  const [recipientId, setRecipientId] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    onSend(recipientId, content);
    setRecipientId('');
    setContent('');
  };

  return (
    <div className="modal fade" id="composeModal" tabIndex={-1} aria-labelledby="composeModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="composeModalLabel">Compose Message</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="recipientId" className="form-label">Recipient ID</label>
              <input
                type="text"
                className="form-control"
                id="recipientId"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="messageContent" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="messageContent"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSend} data-bs-dismiss="modal">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;
