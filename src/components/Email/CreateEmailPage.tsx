import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCountry } from '../../hooks/useCountry';
import { CreateEmail } from './CreateEmail';
import './EmailPage.css';

export const CreateEmailPage = () => {
  const { countries } = useCountry();
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const navigate = useNavigate();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBack = () => {
    navigate('/email');
  };

  return (
    <div className="email-page">
      <div className="email-header">
        <h1>Creare Email</h1>
        <p>Creează un nou template de email pentru companiile tale.</p>
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

      <CreateEmail 
        countries={countries}
        onNotification={showNotification}
      />

      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};
