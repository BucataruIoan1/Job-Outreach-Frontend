import { Grid, LayoutGrid } from 'lucide-react';
import { EmailGrid } from './EmailGrid';
import { EmailTemplateGrid } from './EmailTemplateGrid';
import { useEmailPage } from '../../hooks/useEmailPage';
import './EmailPage.css';

export const EmailPage = () => {
  const {
    activeTab,
    setActiveTab
  } = useEmailPage();

  return (
    <div className="email-page">
      <div className="email-header">
        {activeTab === 'template-grid' ? (
          <>
            <h1>Email Template</h1>
            <p>Gestionează template-urile de email pentru diverse țări și poziții.</p>
          </>
        ) : (
          <>
            <h1>Istoric Email-uri Trimise</h1>
            <p>Vizualizează istoricul email-urilor trimise către companii.</p>
          </>
        )}
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          <button 
            className={`tab-trigger ${activeTab === 'template-grid' ? 'active' : ''}`}
            onClick={() => setActiveTab('template-grid')}
          >
            <LayoutGrid size={16} />
            Email Template Grid
          </button>
          <button 
            className={`tab-trigger ${activeTab === 'grid' ? 'active' : ''}`}
            onClick={() => setActiveTab('grid')}
          >
            <Grid size={16} />
            Email Grid
          </button>
        </div>
      </div>

      {activeTab === 'grid' && (
        <EmailGrid />
      )}

      {activeTab === 'template-grid' && (
        <EmailTemplateGrid />
      )}
    </div>
  );
};
