import { useState, useEffect } from 'react';
import { Company as CompanyType, CreateCompanyDto, UpdateCompanyDto } from '../types/Company';
import { companyService, CompanyQueryParams } from '../services/companyService';
import { FilterState } from '../types/FilterState';

export const useCompany = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    companyName: '',
    companyPhone: '',
    companyPhoneFilterType: 'contains',
    companyEmail: '',
    companyEmailFilterType: 'contains',
    companyUrl: '',
    positions: '',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    position?: 'bottom-right' | 'bottom-center';
    size?: 'normal' | 'large';
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | undefined>(undefined);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyType | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params: CompanyQueryParams = {
        page: currentPage,
        pageSize: pageSize,
        sortColumn: sortColumn || undefined,
        sortOrder: sortOrder || undefined,
        ...filters,
      };

      const data = await companyService.getAll(params);
      setCompanies(data.items);
      setTotalItems(data.totalCount);
    } catch (err) {
      setError('Failed to fetch companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (
    type: 'success' | 'error',
    message: string,
    options: {
      position?: 'bottom-right' | 'bottom-center';
      size?: 'normal' | 'large';
    } = {}
  ) => {
    setNotification({ type, message, ...options });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, pageSize, sortColumn, sortOrder, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setModalMode('create');
    setSelectedCompany(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (company: CompanyType) => {
    setModalMode('edit');
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (company: CompanyType) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (modalMode === 'create') {
        const { positionIds, ...companyData } = data;
        const created = await companyService.create(companyData as CreateCompanyDto);
        if (positionIds && positionIds.length > 0) {
          await companyService.addPositions(created.id, positionIds);
        }
        showNotification('success', 'Compania a fost adăugată cu succes!');
      } else if (selectedCompany) {
        await companyService.update(selectedCompany.id, data as UpdateCompanyDto);
        showNotification('success', 'Compania a fost actualizată cu succes!');
      }
      await fetchCompanies();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save company:', err);
      showNotification('error', 'A apărut o eroare la salvarea companiei.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      await companyService.delete(companyToDelete.id);
      await fetchCompanies();
      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);
      showNotification('success', 'Compania a fost ștearsă cu succes!');
    } catch (err: any) {
      console.error('Failed to delete company:', err);
      setIsDeleteModalOpen(false);

      const userMessage = 'Eroare la stergerea companiei';
      showNotification('error', userMessage, {
        position: 'bottom-center',
        size: 'large',
      });
    }
  };

  return {
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
    fetchCompanies,
  };
};
