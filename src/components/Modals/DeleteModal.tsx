import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './Modal.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  companyName?: string;
  title?: string;
  message?: React.ReactNode;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  title = "Șterge compania",
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header" style={{ marginBottom: '1rem' }}>
          <div className="modal-title" style={{ color: 'hsl(var(--destructive))' }}>
            <AlertTriangle size={24} />
            {title}
          </div>
        </div>

        <div style={{ color: 'hsl(var(--muted-foreground))', margin: '0 0 1.5rem 0' }}>
          {message ? message : (
            <p>
              Ești sigur că vrei să ștergi compania <strong>{companyName}</strong>? Această acțiune nu poate fi anulată.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Anulează
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onConfirm}
            style={{ backgroundColor: 'hsl(var(--destructive))' }}
          >
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
};
