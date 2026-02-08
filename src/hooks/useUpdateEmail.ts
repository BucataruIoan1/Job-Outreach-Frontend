import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Country } from '../types/Country';
import { Position } from '../types/Position';
import { UpdateEmailDto } from '../types/Email';
import { positionService } from '../services/positionService';
import { countryService } from '../services/countryService';
import { emailService } from '../services/emailService';

export const useUpdateEmail = (onNotification: (message: string, type: 'success' | 'error') => void) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingAttachment, setExistingAttachment] = useState<string | null>(null);
  
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
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [emailData, countriesData, positionsData] = await Promise.all([
          emailService.getById(parseInt(id)),
          countryService.getAll(),
          positionService.getAll()
        ]);

        setCountries(countriesData);
        setPositions(positionsData);

        // Populate form
        setFormData({
          subject: emailData.subject,
          content: emailData.content,
          attachment: emailData.attachment,
          sentBy: emailData.sentBy,
          countryId: emailData.countryId,
          positionId: emailData.positionId
        });

        setExistingAttachment(emailData.attachment || null);

        if (emailData.countryId) {
          const country = countriesData.find(c => c.id === emailData.countryId);
          setSelectedCountry(country || null);
        }

        if (emailData.positionId) {
          const position = positionsData.find(p => p.id === emailData.positionId);
          setSelectedPosition(position || null);
        }

        if (editorRef.current) {
          editorRef.current.innerHTML = emailData.content;
        }

      } catch (err) {
        console.error('Failed to load email data', err);
        onNotification('Nu s-au putut încărca datele template-ului.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, onNotification]);

  // Handle updates to formData when selections change
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
      setExistingAttachment(null); // Clear existing attachment display when new file is selected
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
      setExistingAttachment(null);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    if (!selectedCountry) {
        onNotification('Selectează o țară înainte de a salva!', 'error');
        return;
    }
    if (!selectedPosition) {
        onNotification('Selectează o poziție înainte de a salva!', 'error');
        return;
    }

    try {
      setSaving(true);
      const content = editorRef.current?.innerHTML || '';
      const emailId = parseInt(id);

      const data = new FormData();
      data.append('Subject', formData.subject);
      data.append('Content', content);
      data.append('SentBy', formData.sentBy || 'User'); 
      data.append('CountryId', selectedCountry.id.toString());
      data.append('PositionId', selectedPosition.id.toString());

      // Handle Attachment field for backend validation
      if (pdfFile) {
        data.append('PdfFile', pdfFile);
        // When uploading a file, backend overwrites Attachment anyway, 
        // but we need to pass validation if Attachment is [Required].
        // Send a space ' ' as placeholder.
        data.append('Attachment', existingAttachment || ' ');
      } else {
        // When NOT uploading a file, we MUST send the existing attachment path.
        // If existingAttachment is null/empty, we send empty string or space?
        // If backend validation fails on empty string, we might need to send ' ' 
        // BUT if we send ' ', it might save ' ' as the path if we are not careful.
        // However, if the user cleared the attachment (existingAttachment is null), 
        // and we want to clear it in DB, we should send empty string.
        // If the backend fails on empty string, then the backend DTO logic requires a fix 
        // or we assume it allows empty strings if initialized to string.Empty.
        // Given the error "The Attachment field is required", it likely wants something.
        // But let's try sending the actual existingAttachment or empty string.
        // Crucially, we use updateWithFile (FormData) for ALL requests now.
        data.append('Attachment', existingAttachment || '');
      }

      await emailService.updateWithFile(emailId, data);
      
      onNotification('Template-ul a fost actualizat cu succes!', 'success');
      navigate('/email');
      
    } catch (err) {
      console.error('Failed to update', err);
      onNotification('Eroare la actualizare.', 'error');
    } finally {
      setSaving(false);
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
    countries,
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    loading,
    saving,
    pdfFile,
    setPdfFile,
    existingAttachment,
    setExistingAttachment,
    formData,
    setFormData,
    editorRef,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleUpdate,
    execCommand
  };
};
