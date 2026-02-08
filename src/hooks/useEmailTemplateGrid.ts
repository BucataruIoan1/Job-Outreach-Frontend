import { useState, useEffect, useCallback } from "react";
import { Email } from "../types/Email";
import { emailService } from "../services/emailService";
import { countryService } from "../services/countryService";
import { positionService } from "../services/positionService";
import { Country } from "../types/Country";
import { Position } from "../types/Position";

interface NotificationState {
  message: string;
  type: "success" | "error";
}

export const useEmailTemplateGrid = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [emailsData, countriesData, positionsData] = await Promise.all([
        emailService.getAll(),
        countryService.getAll(),
        positionService.getAll()
      ]);
      setEmails(emailsData);
      setCountries(countriesData);
      setPositions(positionsData);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("A apărut o eroare la încărcarea datelor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Notification timer
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleDeleteClick = (email: Email) => {
    setEmailToDelete(email);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!emailToDelete) return;

    try {
      await emailService.delete(emailToDelete.id);
      setEmails((prev) => prev.filter((e) => e.id !== emailToDelete.id));
      setNotification({
        message: "Template-ul de Email a fost șters cu succes.",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to delete email", err);
      setNotification({
        message: "Eroare la ștergerea template-ului.",
        type: "error",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setEmailToDelete(null);
    }
  };

  const getCountryName = (id?: number) => {
    if (!id) return "-";
    return countries.find(c => c.id === id)?.countryName || "-";
  };

  const getPositionName = (id?: number) => {
    if (!id) return "-";
    return positions.find(p => p.id === id)?.positionName || "-";
  };

  const handleDownloadAttachment = async (email: Email) => {
    if (!email.attachment) return;
    
    try {
      const fileName = email.attachment.split(/[\\/]/).pop() || 'attachment.pdf';
      await emailService.downloadAttachment(email.id, fileName);
    } catch (err) {
      console.error("Failed to download attachment", err);
      setNotification({
        message: "Eroare la descărcarea atașamentului.",
        type: "error",
      });
    }
  };

  // Pagination logic
  const totalItems = emails.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedEmails = emails.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    emails: paginatedEmails,
    loading,
    error,
    notification,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteClick,
    handleConfirmDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    emailToDelete,
    getCountryName,
    getPositionName,
    handleDownloadAttachment,
    refreshData: fetchData
  };
};
