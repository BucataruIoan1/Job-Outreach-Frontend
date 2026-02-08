import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ViewEmail } from './ViewEmail';
import { emailService } from '../../services/emailService';
import { countryService } from '../../services/countryService';
import { Email } from '../../types/Email';
import { Country } from '../../types/Country';
import './EmailPage.css';

export const ViewEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailId = searchParams.get('id');
  
  const [email, setEmail] = useState<Email | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch countries first as they are needed for the view
        const countriesData = await countryService.getAll();
        setCountries(countriesData);

        // If ID is present, fetch the specific email
        if (emailId) {
          const emailData = await emailService.getById(parseInt(emailId));
          setEmail(emailData);
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Nu s-au putut încărca datele.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emailId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleBack = () => {
    navigate('/email');
  };

  if (loading) {
    return <div className="email-page">Se încarcă...</div>;
  }

  if (error) {
    return (
      <div className="email-page">
        <button onClick={handleBack} className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'hsl(var(--muted-foreground))' }}>
          <ArrowLeft size={20} />
          Înapoi la template-uri
        </button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="email-page">
      <div className="email-header">
        <h1>Vizualizare Template</h1>
        <p>Vizualizează detaliile template-ului de email selectat.</p>
        <button 
          onClick={handleBack} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: '1rem', 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer', 
            color: 'hsl(var(--muted-foreground))',
            fontSize: '1rem',
            fontWeight: 500,
            padding: 0
          }}
        >
          <ArrowLeft size={20} />
          Înapoi la template-uri
        </button>
      </div>

      <ViewEmail 
        countries={countries}
        onNotification={showNotification}
        initialCountryId={email?.countryId}
        initialPositionId={email?.positionId}
        initialEmail={email}
      />
    </div>
  );
};
