import "./Company.css";
import { Plus } from "lucide-react";
import { useCompany } from "../../hooks/useCompany";
import { CompanyGrid } from "../CompanyGrid/CompanyGrid";
import { CompanyModal } from "../Modals/CompanyModal";
import { DeleteModal } from "../Modals/DeleteModal";
import { ToastNotification } from "../Common/ToastNotification/ToastNotification";

export const Company = () => {
  const {
    companies,
    currentPage,
    pageSize,
    totalItems,
    loading,
    error,
    sortColumn,
    sortOrder,
    filters,
    notification,
    isModalOpen,
    modalMode,
    selectedCompany,
    isDeleteModalOpen,
    companyToDelete,
    setIsModalOpen,
    setNotification,
    setIsDeleteModalOpen,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleFilterChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSave,
    handleConfirmDelete,
  } = useCompany();

  return (
    <div className="company-page">
      <div className="company-header">
        <div className="header-content">
          <h1>Lista de companii</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddClick}>
            <Plus size={16} />
            Adaugă companie
          </button>
        </div>
      </div>

      {error ? (
        <div className="empty-state" style={{ color: "var(--destructive)" }}>
          {error}
        </div>
      ) : (
        <div style={{ position: "relative", minHeight: "400px" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0)",
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: "100px",
                pointerEvents: "none",
              }}
            ></div>
          )}
          <CompanyGrid
            companies={companies}
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

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedCompany}
        mode={modalMode}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        companyName={companyToDelete?.companyName || ""}
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
