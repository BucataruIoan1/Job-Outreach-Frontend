import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './ToastNotification.css';

interface ToastNotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
  position?: 'bottom-right' | 'bottom-center';
  size?: 'normal' | 'large';
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  message,
  onClose,
  duration = 3000,
  position = 'bottom-center',
  size = 'normal',
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconSize = size === 'large' ? 24 : 18;

  return (
    <div
      className={`toast-notification ${type} ${position} ${size}`}
      style={{
        backgroundColor:
          type === 'success' ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
      }}
    >
      {type === 'success' ? (
        <CheckCircle size={iconSize} />
      ) : (
        <AlertCircle size={iconSize} />
      )}
      <span>{message}</span>
    </div>
  );
};
