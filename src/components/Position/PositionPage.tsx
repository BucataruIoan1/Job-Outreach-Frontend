import './PositionPage.css';
import { Plus } from 'lucide-react';
import { usePosition } from '../../hooks/usePosition';
import { PositionGrid } from '../PositionGrid/PositionGrid';
import { PositionModal } from '../Modals/PositionModal';
import { DeleteModal } from '../Modals/DeleteModal';
import { ToastNotification } from '../Common/ToastNotification/ToastNotification';

export const PositionPage = () => {
  const {
    paginatedPositions,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    sortColumn,
    sortOrder,
    filters,
    notification,
    isModalOpen,
    modalMode,
    selectedPosition,
    isDeleteModalOpen,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setNotification,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleFilterChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSave,
    handleConfirmDelete,
  } = usePosition();

  return (
    <div className="position-page">
      <div className="position-header">
        <div className="header-content">
          <h1>Poziții</h1>
          <p>Gestionează pozițiile disponibile pentru aplicare</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddClick}>
            <Plus size={16} />
            Adaugă Poziție
          </button>
        </div>
      </div>

      {error ? (
        <div className="empty-state" style={{ color: 'var(--destructive)' }}>{error}</div>
      ) : (
        <div style={{ position: 'relative', minHeight: '400px' }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingTop: '100px',
                    pointerEvents: 'none'
                }}>
                  Loading...
                </div>
            )}
            
            <PositionGrid 
              positions={paginatedPositions}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
        </div>
      )}

      <PositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedPosition}
        mode={modalMode}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmare ștergere"
        message={
          <p>
            Ești sigur că vrei să ștergi această poziție? Acțiunea nu poate fi anulată.
          </p>
        }
      />

      {notification && (
        <ToastNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          position={notification.position}
          size={notification.size}
        />
      )}
    </div>
  );
};
