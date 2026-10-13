import { useState, useEffect } from 'react';
import { CreateCompanyDto, UpdateCompanyDto, Company } from '../types/Company';
import { Position } from '../types/Position';
import { Country } from '../types/Country';
import { positionService } from '../services/positionService';
import { countryService } from '../services/countryService';

interface UseCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCompanyDto | UpdateCompanyDto) => Promise<void>;
  initialData?: Company;
  mode: 'create' | 'edit';
}

type CompanyFormData = Omit<CreateCompanyDto, 'countryId'>;

export const useCompanyModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: UseCompanyModalProps) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyUrl: '',
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionIds, setSelectedPositionIds] = useState<number[]>([]);

  const [countries, setCountries] = useState<Country[]>([]);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [countryError, setCountryError] = useState(false);

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
      setCountryId(initialData.countryId ?? null);
    } else {
      setFormData({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyUrl: '',
      });
      setSelectedPositionIds([]);
      setCountryId(null);
    }
    setCountryError(false);
  }, [initialData, mode, isOpen]);

  useEffect(() => {
    positionService
      .getAll()
      .then((data) => setPositions(data))
      .catch((err) => {
        console.error('Failed to load positions', err);
      });

    countryService
      .getAll()
      .then((data) => setCountries(data))
      .catch((err) => {
        console.error('Failed to load countries', err);
      });
  }, []);

  const selectedCountry = countries.find((c) => c.id === countryId) ?? null;

  const handleTogglePosition = (id: number) => {
    setSelectedPositionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (country: Country) => {
    setCountryId(country.id);
    setCountryError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tara e obligatorie; dropdown-ul custom nu are validare HTML nativa
    if (countryId === null) {
      setCountryError(true);
      return;
    }

    await onSave({ ...formData, countryId, positionIds: selectedPositionIds } as any);
    onClose();
  };

  return {
    formData,
    positions,
    selectedPositionIds,
    countries,
    selectedCountry,
    countryError,
    handleTogglePosition,
    handleChange,
    handleCountryChange,
    handleSubmit,
  };
};
