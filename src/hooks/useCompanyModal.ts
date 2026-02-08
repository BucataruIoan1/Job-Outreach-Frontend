import { useState, useEffect } from 'react';
import { CreateCompanyDto, UpdateCompanyDto, Company } from '../types/Company';
import { Position } from '../types/Position';
import { positionService } from '../services/positionService';

interface UseCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCompanyDto | UpdateCompanyDto) => Promise<void>;
  initialData?: Company;
  mode: 'create' | 'edit';
}

export const useCompanyModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: UseCompanyModalProps) => {
  const [formData, setFormData] = useState<CreateCompanyDto>({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyUrl: '',
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionIds, setSelectedPositionIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        companyName: initialData.companyName,
        companyEmail: initialData.companyEmail || '',
        companyPhone: initialData.companyPhone || '',
        companyUrl: initialData.companyUrl || '',
      });
      const initialPositions = initialData.positions || [];
      setSelectedPositionIds(initialPositions.map((p) => p.id));
    } else {
      setFormData({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyUrl: '',
      });
      setSelectedPositionIds([]);
    }
  }, [initialData, mode, isOpen]);

  useEffect(() => {
    positionService
      .getAll()
      .then((data) => setPositions(data))
      .catch((err) => {
        console.error('Failed to load positions', err);
      });
  }, []);

  const handleTogglePosition = (id: number) => {
    setSelectedPositionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleChange = (field: keyof CreateCompanyDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ ...formData, positionIds: selectedPositionIds } as any);
    onClose();
  };

  return {
    formData,
    positions,
    selectedPositionIds,
    handleTogglePosition,
    handleChange,
    handleSubmit,
  };
};
