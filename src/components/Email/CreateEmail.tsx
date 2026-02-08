import { Save, Paperclip, Bold, Italic, Underline, Strikethrough, Link, AlignLeft, AlignCenter, AlignRight, Type, List, Globe, Mail, Briefcase, FileText, TextAlignCenter } from 'lucide-react';
import { Country } from '../../types/Country';
import { CountrySelect } from './CountrySelect';
import { PositionSelect } from './PositionSelect';
import { useCreateEmail } from '../../hooks/useCreateEmail';
import './EmailPage.css';

interface CreateEmailProps {
  countries: Country[];
  onNotification: (message: string, type: 'success' | 'error') => void;
}

export const CreateEmail = ({ countries, onNotification }: CreateEmailProps) => {
  const {
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    loading,
    pdfFile,
    setPdfFile,
    formData,
    setFormData,
    editorRef,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleSave,
    execCommand
  } = useCreateEmail(onNotification);

  return (
    <div className="email-layout create-mode">
        <div className="email-card">
          <div className="card-header">
            <Mail className="text-primary" size={24} />
            <div>
              <div className="card-title">Creează template email</div>
              <div className="card-subtitle">Completează detaliile pentru noul template de email</div>
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
                className={`file-upload-area ${pdfFile ? 'has-file' : ''}`}
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
                        <span className="file-size" style={{ marginLeft: '1rem', color: '#666' }}>
                          {(pdfFile.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    <button 
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
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

            <div style={{ marginTop: '1rem', display: 'flex', width: '100%' }}>
              <button 
                className="btn-primary"
                onClick={handleSave}
                disabled={loading || !selectedCountry || !selectedPosition || !formData.subject || !formData.content}
                style={{ width: '100%', padding: '0.5rem 1rem' }}
              >
                {loading ? 'Se salvează...' : (
                  <>
                  <div className='content-button'>
                    <Save size={18} style={{ marginRight: '0.5rem'}} />
                    <p>Salvează Template</p>
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
