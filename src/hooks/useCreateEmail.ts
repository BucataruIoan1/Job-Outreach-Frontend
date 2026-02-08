import { useState, useRef, useEffect } from 'react';
import { Country } from '../types/Country';
import { Position } from '../types/Position';
import { UpdateEmailDto } from '../types/Email';
import { positionService } from '../services/positionService';
import { emailService } from '../services/emailService';

export const useCreateEmail = (onNotification: (message: string, type: 'success' | 'error') => void) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<UpdateEmailDto>({
    subject: '',
    content: '',
    attachment: '',
    sentBy: '',
    countryId: undefined,
    positionId: undefined
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    positionService.getAll()
      .then(data => {
        setPositions(data);
      })
      .catch(err => {
        console.error('Failed to load positions', err);
        onNotification('Nu s-au putut încărca pozițiile.', 'error');
      });
  }, [onNotification]);

  useEffect(() => {
    if (selectedCountry) {
      setFormData(prev => ({ ...prev, countryId: selectedCountry.id }));
    } else {
      setFormData(prev => ({ ...prev, countryId: undefined }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedPosition) {
        setFormData(prev => ({ ...prev, positionId: selectedPosition.id }));
    } else {
        setFormData(prev => ({ ...prev, positionId: undefined }));
    }
  }, [selectedPosition]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        onNotification('Doar fișiere PDF sunt acceptate.', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        onNotification('Fișierul este prea mare (max 10MB).', 'error');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        onNotification('Doar fișiere PDF sunt acceptate.', 'error');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSave = async () => {
    if (!selectedCountry) {
        onNotification('Selectează o țară înainte de a salva!', 'error');
        return;
    }
    if (!selectedPosition) {
        onNotification('Selectează o poziție înainte de a salva!', 'error');
        return;
    }

    try {
      setLoading(true);
      const content = editorRef.current?.innerHTML || '';
      
      const data = new FormData();
      data.append('Subject', formData.subject);
      data.append('Content', content);
      data.append('SentBy', formData.sentBy || 'User'); 
      data.append('CountryId', selectedCountry.id.toString());
      data.append('PositionId', selectedPosition.id.toString());

      if (pdfFile) {
        data.append('PdfFile', pdfFile);
      }
      
      await emailService.createWithFile(data);
      
      onNotification('Template-ul a fost salvat cu succes!', 'success');
      
      // Reset form
      setFormData({
        subject: '',
        content: '',
        attachment: '',
        sentBy: '',
        countryId: undefined,
        positionId: undefined
      });
      setPdfFile(null);
      setSelectedCountry(null);
      setSelectedPosition(null);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to save', err);
      onNotification('Eroare la salvare.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData({ ...formData, content: editorRef.current.innerHTML });
    }
    editorRef.current?.focus();
  };

  return {
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    loading,
    pdfFile,
    setPdfFile,
    formData,
    setFormData,
    editorRef,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleSave,
    execCommand
  };
};
