import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../Modals/Modal.css';

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { positionName: string }) => void;
  initialData?: { positionName: string };
  mode: 'create' | 'edit';
}

export const PositionModal: React.FC<PositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const [positionName, setPositionName] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setPositionName(initialData.positionName);
    } else {
      setPositionName('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ positionName });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Adaugă Poziție' : 'Editează Poziție'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nume Poziție</label>
            <input
              type="text"
              className="form-input"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              placeholder="Ex: Frontend Developer"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Anulează
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? 'Adaugă' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
