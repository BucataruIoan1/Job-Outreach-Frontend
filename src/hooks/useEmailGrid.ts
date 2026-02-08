import { useState, useEffect, useCallback } from 'react';
import { EmailSent } from '../types/EmailSent';
import { emailSentService } from '../services/emailSentService';

export const useEmailGrid = () => {
  const [emails, setEmails] = useState<EmailSent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<EmailSent | null>(null);

  const fetchEmails = useCallback(async (page: number, size: number) => {
    try {
      setLoading(true);
      const data = await emailSentService.getAll(page, size);
      setEmails(data.items);
      setTotalItems(data.totalCount);
    } catch (err) {
      console.error('Failed to fetch email history', err);
      setError('A apărut o eroare la încărcarea istoricului de email-uri.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = (email: EmailSent) => {
    setEmailToDelete(email);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!emailToDelete) return;
    try {
      await emailSentService.delete(emailToDelete.id);
      await fetchEmails(currentPage, pageSize);
      setIsDeleteModalOpen(false);
      setEmailToDelete(null);
      setNotification({
        type: 'success',
        message: 'Email-ul a fost șters cu succes din istoric!',
      });
    } catch (err) {
      console.error('Failed to delete email', err);
      setNotification({
        type: 'error',
        message: 'A apărut o eroare la ștergerea email-ului.',
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchEmails(currentPage, pageSize);
  }, [currentPage, pageSize, fetchEmails]);

  return {
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
  };
};
