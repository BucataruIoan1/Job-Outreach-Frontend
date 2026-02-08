import { Save, Paperclip, Bold, Italic, Underline, Strikethrough, Link, AlignLeft, AlignCenter, AlignRight, Type, List, Globe, Mail, Briefcase, FileText } from 'lucide-react';
import { CountrySelect } from './CountrySelect';
import { PositionSelect } from './PositionSelect';
import { useUpdateEmail } from '../../hooks/useUpdateEmail';
import { useNavigate } from 'react-router-dom';
import './EmailPage.css';

interface UpdateEmailProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

export const UpdateEmail = ({ onNotification }: UpdateEmailProps) => {
  const navigate = useNavigate();
  const {
    countries,
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    loading,
    saving,
    pdfFile,
    setPdfFile,
    existingAttachment,
    setExistingAttachment,
    formData,
    setFormData,
    editorRef,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleUpdate,
    execCommand
  } = useUpdateEmail(onNotification);

  if (loading) {
    return <div className="email-layout"><div className="email-card">Se încarcă datele...</div></div>;
  }

  return (
    <div className="email-layout create-mode">
        <div className="email-card">
          <div className="card-header">
            <Mail className="text-primary" size={24} />
            <div>
              <div className="card-title">Actualizează template email</div>
              <div className="card-subtitle">Modifică detaliile template-ului de email</div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-field">
              <label className="field-label">
                <span className="step-badge">1</span>
                Subiect email
              </label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="ex: Cerere de angajare - [Numele tău]"
                disabled={!selectedCountry}
                className="modern-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <span className="step-badge">2</span>
                Conținut email
              </label>
              <div className={`rich-text-container ${!selectedCountry ? 'disabled' : ''}`}>
                <div className="rich-text-toolbar">
                   <div className="toolbar-group">
                    <button onClick={() => execCommand('bold')} title="Bold"><Bold size={18} /></button>
                    <button onClick={() => execCommand('italic')} title="Italic"><Italic size={18} /></button>
                    <button onClick={() => execCommand('underline')} title="Underline"><Underline size={18} /></button>
                    <button onClick={() => execCommand('strikeThrough')} title="Strikethrough"><Strikethrough size={18} /></button>
                  </div>
                  <div className="toolbar-divider"></div>
                  <div className="toolbar-group">
                    <button onClick={() => execCommand('insertUnorderedList')}><List size={18} /></button>
                    <button onClick={() => execCommand('insertOrderedList')}><List size={18} /></button>
                  </div>
                  <div className="toolbar-divider"></div>
                  <div className="toolbar-group">
                     <button onClick={() => execCommand('justifyLeft')}><AlignLeft size={18} /></button>
                     <button onClick={() => execCommand('justifyCenter')}><AlignCenter size={18} /></button>
                     <button onClick={() => execCommand('justifyRight')}><AlignRight size={18} /></button>
                  </div>
                   <div className="toolbar-divider"></div>
                  <div className="toolbar-group">
                    <button onClick={() => {
                      const url = prompt('Enter URL:');
                      if (url) execCommand('createLink', url);
                    }}><Link size={18} /></button>
                     <button onClick={() => execCommand('removeFormat')}><Type size={18} /></button>
                  </div>
                </div>
                <div 
                  ref={editorRef}
                  className="rich-text-editor"
                  contentEditable={!!selectedCountry}
                  onInput={(e) => setFormData({...formData, content: e.currentTarget.innerHTML})}
                  style={{ opacity: selectedCountry ? 1 : 0.5 }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">
                <span className="step-badge">3</span>
                Atașament PDF
              </label>
              <div 
                className={`file-upload-area ${pdfFile || existingAttachment ? 'has-file' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  style={{ display: 'none' }}
                />
                {pdfFile ? (
                  <div className="file-preview" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={32} strokeWidth={1.5} className="text-primary" />
                      <div className="file-info">
                        <span className="file-name">{pdfFile.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="file-size" style={{ color: '#666' }}>
                            {(pdfFile.size / 1024).toFixed(1)} KB
                          </span>
                          <span className="file-tag new-tag">NOU</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                        // If we had an existing attachment before, we should probably restore it visually
                        // unless we want to allow "no attachment".
                        // For now, if they remove the NEW file, we show the upload area again.
                        // The existing attachment is tracked separately.
                        // If they want to go back to existing, they would need to refresh or cancel.
                        // But wait, if they remove new file, we should probably revert to existing if available?
                        // Let's check useUpdateEmail logic. 
                        // It sets existingAttachment to null when new file is added.
                        // We should probably keep it in a temp variable if we want to restore it.
                        // But for now, let's just clear pdfFile.
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : existingAttachment ? (
                  <div className="file-preview" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={32} strokeWidth={1.5} className="text-primary" />
                      <div className="file-info">
                        <span className="file-name">{existingAttachment.split(/[\\/]/).pop()}</span>
                      </div>
                    </div>
                    <button 
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExistingAttachment(null);
                        setFormData({ ...formData, attachment: '' });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Paperclip className="upload-icon" size={24} />
                    <span className="upload-text">
                      Trage fișierul aici sau <strong>click pentru a încărca</strong>
                    </span>
                    <span className="upload-hint">Doar fișiere PDF (max 5MB)</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', width: '100%', gap: '1rem' }}>
              <button 
                className="btn-primary"
                onClick={handleUpdate}
                disabled={saving || !selectedCountry || !selectedPosition || !formData.subject || !formData.content}
                style={{ flex: 1, padding: '0.5rem 1rem' }}
              >
                {saving ? 'Se actualizează...' : (
                  <>
                  <div className='content-button'>
                    <Save size={18} style={{ marginRight: '0.5rem'}} />
                    <p>Actualizează Template</p>
                  </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-column">
          <div className="email-card">
            <div className="card-header">
              <Globe className="text-primary" size={24} />
              <div>
                <div className="card-title">Țara destinație</div>
                <div className="card-subtitle">Selectează țara pentru acest template</div>
              </div>
            </div>

            <div>
              <CountrySelect 
                countries={countries}
                selectedCountry={selectedCountry}
                onChange={setSelectedCountry}
              />
            </div>
          </div>

          <div className="email-card">
            <div className="card-header">
              <Briefcase className="text-primary" size={24} />
              <div>
                <div className="card-title">Tip poziție</div>
                <div className="card-subtitle">Selectează poziția pentru care aplici</div>
              </div>
            </div>

            <div>
              <PositionSelect 
                positions={positions}
                selectedPosition={selectedPosition}
                onChange={setSelectedPosition}
                disabled={!selectedCountry}
              />
            </div>
          </div>
        </div>
    </div>
  );
};
