import { Mail, Trash2 } from 'lucide-react';
import { Pagination } from '../Pagination/Pagination';
import { DeleteModal } from '../Modals/DeleteModal';
import { ToastNotification } from '../Common/ToastNotification/ToastNotification';
import { useEmailGrid } from '../../hooks/useEmailGrid';
import './EmailGrid.css';

export const EmailGrid = () => {
  const {
    emails,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    notification,
    setNotification,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    emailToDelete,
    handleDeleteClick,
    handleConfirmDelete,
    handlePageChange,
    handlePageSizeChange,
  } = useEmailGrid();

  if (loading && emails.length === 0) {
    return (
      <div className="email-grid-card">
        <div className="card-header">
          <Mail className="text-primary" size={24} />
          <div>
            <div className="card-title">Email Grid</div>
            <div className="card-subtitle">
              Istoric cu email-urile trimise către companii.
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
            <div className="card-title">Email Grid</div>
            <div className="card-subtitle">
              Istoric cu email-urile trimise către companii.
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
      <div className="card-header">
        <Mail className="text-primary" size={24} />
        <div>
          <div className="card-title">Email Grid</div>
          <div className="card-subtitle">
            Istoric cu email-urile trimise către companii.
          </div>
        </div>
      </div>

      <div className="email-table-wrapper">
        <table className="email-grid-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Acțiuni</th>
              <th>Subiect</th>
              <th>Pozitie</th>
              <th>Numele Companiei</th>
              <th>Data/Ora</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="email-grid-empty">
                    Nu există email-uri trimise încă.
                  </div>
                </td>
              </tr>
            ) : (
              emails.map((email) => (
                <tr key={email.id}>
                  <td>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(email)}
                      title="Șterge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                  <td>{email.subject}</td>
                  <td>{email.positionName}</td>
                  <td>{email.companyName}</td>
                  <td style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {new Date(email.sentAt.endsWith('Z') ? email.sentAt : `${email.sentAt}Z`).toLocaleString('ro-RO')}
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
        title="Șterge email"
        message={
          <p>
            Ești sigur că vrei să ștergi email-ul trimis către <strong>{emailToDelete?.companyName}</strong>? 
            Această acțiune nu poate fi anulată.
          </p>
        }
      />

      {notification && (
        <ToastNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};
