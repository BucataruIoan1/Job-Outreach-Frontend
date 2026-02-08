import React from 'react';
import { X, Building2, Mail, Phone, Save, Plus, Link as LinkIcon, Briefcase } from 'lucide-react';
import { CreateCompanyDto, UpdateCompanyDto, Company } from '../../types/Company';
import { useCompanyModal } from '../../hooks/useCompanyModal';
import './Modal.css';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCompanyDto | UpdateCompanyDto) => Promise<void>;
  initialData?: Company;
  mode: 'create' | 'edit';
}

export const CompanyModal: React.FC<CompanyModalProps> = (props) => {
  const { isOpen, onClose, mode } = props;
  
  const {
    formData,
    positions,
    selectedPositionIds,
    handleTogglePosition,
    handleChange,
    handleSubmit,
  } = useCompanyModal(props);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <div className="logo-icon" style={{ width: '2rem', height: '2rem' }}>
              <Building2 size={16} />
            </div>
            {mode === 'create' ? 'Adaugă companie' : 'Editează compania'}
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Building2 size={16} className="text-muted-foreground" />
              Numele companiei
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: TechCorp SRL"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} className="text-muted-foreground" />
              Adresa de email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="contact@company.ro"
              value={formData.companyEmail}
              onChange={(e) => handleChange('companyEmail', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={16} className="text-muted-foreground" />
              Telefon (opțional)
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="+40 700 000 000"
              value={formData.companyPhone}
              onChange={(e) => handleChange('companyPhone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <LinkIcon size={16} className="text-muted-foreground" />
              Website (opțional)
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://www.company.ro"
              value={formData.companyUrl}
              onChange={(e) => handleChange('companyUrl', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Briefcase size={16} className="text-muted-foreground" />
              Poziții disponibile
            </label>
            <div className="checkbox-group">
              {positions.map(position => (
                <label key={position.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedPositionIds.includes(position.id)}
                    onChange={() => handleTogglePosition(position.id)}
                  />
                  <span>{position.positionName}</span>
                </label>
              ))}
              {positions.length === 0 && (
                <div className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                  Nu există poziții configurate.
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Anulează
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? <Plus size={16} /> : <Save size={16} />}
              {mode === 'create' ? 'Adaugă' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
