import { Mail, Trash2, Pencil, Eye, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../Pagination/Pagination';
import { ToastNotification } from '../Common/ToastNotification/ToastNotification';
import { DeleteModal } from '../Modals/DeleteModal';
import { useEmailTemplateGrid } from '../../hooks/useEmailTemplateGrid';
import './EmailGrid.css'; // Reusing styles

export const EmailTemplateGrid = () => {
  const navigate = useNavigate();
  const {
    emails,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    notification,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteClick,
    handleConfirmDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    emailToDelete,
    getCountryName,
    getPositionName,
    handleDownloadAttachment
  } = useEmailTemplateGrid();

  if (loading && emails.length === 0) {
    return (
      <div className="email-grid-card">
        <div className="card-header">
          <Mail className="text-primary" size={24} />
          <div>
            <div className="card-title">Email Template Grid</div>
            <div className="card-subtitle">
              Lista template-urilor de email configurate.
            </div>
          </div>
        </div>
        <div className="email-grid-empty">Se încarcă...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="email-grid-card">
        <div className="card-header">
          <Mail className="text-primary" size={24} />
          <div>
            <div className="card-title">Email Template Grid</div>
            <div className="card-subtitle">
              Lista template-urilor de email configurate.
            </div>
          </div>
        </div>
        <div className="email-grid-empty" style={{ color: 'var(--destructive)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="email-grid-card">
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Mail className="text-primary" size={24} />
          <div>
            <div className="card-title">Email Template Grid</div>
            <div className="card-subtitle">
              Lista template-urilor de email configurate.
            </div>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/email-create')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            backgroundColor: 'hsl(var(--primary))',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius)',
            fontWeight: 500
          }}
        >
          <Plus size={16} />
          Adaugă
        </button>
      </div>

      <div className="email-table-wrapper">
        <table className="email-grid-table">
          <thead>
            <tr>
              <th style={{ width: '140px', textAlign: 'center' }}>Acțiuni</th>
              <th>Subiect</th>
              <th>Pozitie</th>
              <th>Country</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="email-grid-empty">
                    Nu există template-uri de email.
                  </div>
                </td>
              </tr>
            ) : (
              emails.map((email) => (
                <tr key={email.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="action-btn"
                        title="Vizualizare"
                        onClick={() => navigate(`/email-view?id=${email.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn"
                        title="Editare"
                        onClick={() => navigate(`/email-edit/${email.id}`)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(email)}
                        title="Șterge"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                  <td>{email.subject}</td>
                  <td>{getPositionName(email.positionId)}</td>
                  <td>{getCountryName(email.countryId)}</td>
                  <td>
                    {email.attachment ? (
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          color: 'hsl(var(--muted-foreground))', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleDownloadAttachment(email)}
                        title="Descarcă PDF"
                      >
                        <FileText size={16} />
                        <span style={{ fontSize: '0.875rem' }}>PDF</span>
                      </div>
                    ) : (
                      <span style={{ color: 'hsl(var(--muted-foreground))' }}>-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Șterge template email"
        message={
          <p>
            Ești sigur că vrei să ștergi template-ul <strong>{emailToDelete?.subject}</strong>? 
            Această acțiune nu poate fi anulată.
          </p>
        }
      />

      {notification && (
        <ToastNotification
          type={notification.type}
          message={notification.message}
          onClose={() => {}} // Notification auto-closes in hook
        />
      )}
    </div>
  );
};
