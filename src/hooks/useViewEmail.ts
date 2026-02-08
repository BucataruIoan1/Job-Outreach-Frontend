import { useState, useEffect } from 'react';
import { Country } from '../types/Country';
import { Position } from '../types/Position';
import { Email } from '../types/Email';
import { positionService } from '../services/positionService';
import { emailService } from '../services/emailService';

export const useViewEmail = (
  onNotification: (message: string, type: 'success' | 'error') => void,
  initialCountryId?: number,
  initialPositionId?: number,
  allCountries: Country[] = [],
  initialEmail?: Email | null
) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<Email | null>(initialEmail || null);

  // Initialize from props
  useEffect(() => {
    if (initialCountryId && allCountries.length > 0) {
      const country = allCountries.find(c => c.id === initialCountryId);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [initialCountryId, allCountries]);

  // Load positions and set initial position
  useEffect(() => {
    if (selectedCountry) {
        positionService.getByCountryId(selectedCountry.id)
            .then(data => {
                setPositions(data);
                // Set initial position if matches and provided
                if (initialPositionId) {
                  const position = data.find(p => p.id === initialPositionId);
                  if (position) {
                    setSelectedPosition(position);
                  } else {
                    setSelectedPosition(null);
                  }
                } else {
                  setSelectedPosition(null);
                }
            })
            .catch(err => {
                console.error('Failed to load positions', err);
                onNotification('Nu s-au putut încărca pozițiile.', 'error');
            });
    } else {
        setPositions([]);
        setSelectedPosition(null);
    }
  }, [selectedCountry, initialPositionId, onNotification]);

  useEffect(() => {
    const fetchTemplate = async () => {
      // If we already have the email template (e.g. passed from props) 
      // and the selected country/position match it, we don't need to fetch
      if (initialEmail && 
          selectedCountry?.id === initialEmail.countryId && 
          selectedPosition?.id === initialEmail.positionId) {
        setEmailTemplate(initialEmail);
        return;
      }

      if (!selectedCountry || !selectedPosition) {
        // If we are waiting for the initial position to be loaded, don't clear the template yet
        if (initialPositionId && !selectedPosition) {
          return;
        }
        setEmailTemplate(null);
        return;
      }

      try {
        const data = await emailService.getByCountryId(selectedCountry.id, selectedPosition.id);
        setEmailTemplate(data);
      } catch (err) {
        console.error('Failed to fetch email template', err);
        onNotification('Eroare la încărcarea template-ului.', 'error');
      }
    };

    fetchTemplate();
  }, [selectedCountry, selectedPosition, onNotification, initialEmail]);

  return {
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    emailTemplate
  };
};
