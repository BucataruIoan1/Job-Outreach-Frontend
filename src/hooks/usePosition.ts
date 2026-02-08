import { useState, useEffect } from 'react';
import { Position, CreatePositionDto, UpdatePositionDto } from '../types/Position';
import { positionService } from '../services/positionService';
import { PositionFilterState } from '../components/PositionGrid/PositionGrid';

export const usePosition = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sort and Filter state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState<PositionFilterState>({
    positionName: '',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    position?: 'bottom-right' | 'bottom-center';
    size?: 'normal' | 'large';
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>(undefined);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const data = await positionService.getAll();
      setPositions(data);
      applyFiltersAndSort(data);
    } catch (err) {
      setError('Failed to fetch positions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (data: Position[], currentFilters = filters, currentSortCol = sortColumn, currentSortOrd = sortOrder) => {
    let result = [...data];

    if (currentFilters.positionName) {
      result = result.filter(p => 
        p.positionName.toLowerCase().includes(currentFilters.positionName.toLowerCase())
      );
    }

    if (currentSortCol && currentSortOrd) {
      result.sort((a, b) => {
        const aValue = a[currentSortCol as keyof Position];
        const bValue = b[currentSortCol as keyof Position];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return currentSortOrd === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (aValue < bValue) return currentSortOrd === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSortOrd === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredPositions(result);
  };

  const showNotification = (
    type: 'success' | 'error', 
    message: string, 
    options: { position?: 'bottom-right' | 'bottom-center'; size?: 'normal' | 'large' } = {}
  ) => {
    setNotification({ type, message, ...options });
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(positions);
  }, [filters, sortColumn, sortOrder]);

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

  const handleFilterChange = (key: keyof PositionFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setModalMode('create');
    setSelectedPosition(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (position: Position) => {
    setModalMode('edit');
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (position: Position) => {
    setPositionToDelete(position);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: { positionName: string }) => {
    try {
      if (modalMode === 'create') {
        await positionService.create(data as CreatePositionDto);
        showNotification('success', 'Poziția a fost adăugată cu succes!');
      } else if (selectedPosition) {
        await positionService.update(selectedPosition.id, data as UpdatePositionDto);
        showNotification('success', 'Poziția a fost actualizată cu succes!');
      }
      await fetchPositions();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save position:', err);
      showNotification('error', 'A apărut o eroare la salvarea poziției.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!positionToDelete) return;
    try {
      await positionService.delete(positionToDelete.id);
      await fetchPositions();
      setIsDeleteModalOpen(false);
      setPositionToDelete(null);
      showNotification('success', 'Poziția a fost ștearsă cu succes!');
    } catch (err) {
      console.error('Failed to delete position:', err);
      setIsDeleteModalOpen(false);
      showNotification('error', 'Eroare la stergerea poziției', { position: 'bottom-center', size: 'large' });
    }
  };

  const paginatedPositions = filteredPositions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    paginatedPositions,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems: filteredPositions.length,
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
  };
};
