import { useState, useEffect } from 'react';
import { Country, CreateCountryDto } from '../types/Country';
import { countryService } from '../services/countryService';

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export const useCountry = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);

  const [formData, setFormData] = useState<CreateCountryDto>({
    countryName: '',
    countryCode: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await countryService.getAll();
      setCountries(data);
    } catch (error) {
      console.error('Failed to fetch countries', error);
      showNotification('error', 'Nu s-au putut încărca țările.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.countryName || !formData.countryCode) {
      showNotification('error', 'Toate câmpurile sunt obligatorii.');
      return;
    }

    try {
      if (editingId) {
        await countryService.update(editingId, formData);
        showNotification('success', 'Țara a fost actualizată cu succes!');
        setCountries(countries.map(c => 
          c.id === editingId ? { ...c, ...formData } : c
        ));
        setEditingId(null);
      } else {
        const newCountry = await countryService.create(formData);
        showNotification('success', 'Țara a fost adăugată cu succes!');
        setCountries([...countries, newCountry]);
      }
      setFormData({ countryName: '', countryCode: '' });
    } catch (error) {
      console.error('Failed to save country', error);
      showNotification('error', editingId ? 'Eroare la actualizare.' : 'Eroare la adăugare.');
    }
  };

  const handleEdit = (country: Country) => {
    setFormData({
      countryName: country.countryName,
      countryCode: country.countryCode
    });
    setEditingId(country.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Sigur dorești să ștergi această țară?')) {
      try {
        await countryService.delete(id);
        showNotification('success', 'Țara a fost ștearsă cu succes!');
        setCountries(countries.filter(c => c.id !== id));
        if (editingId === id) {
          setEditingId(null);
          setFormData({ countryName: '', countryCode: '' });
        }
      } catch (error) {
        console.error('Failed to delete country', error);
        showNotification('error', 'Eroare la ștergere.');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ countryName: '', countryCode: '' });
  };

  const filteredCountries = countries.filter(country => 
    country.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    countries,
    loading,
    searchQuery,
    setSearchQuery,
    formData,
    setFormData,
    editingId,
    notification,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    filteredCountries
  };
};
