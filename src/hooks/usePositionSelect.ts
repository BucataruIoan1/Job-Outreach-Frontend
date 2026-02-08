import { useState, useRef, useEffect } from 'react';

export const usePositionSelect = (disabled: boolean) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => {
    if (!disabled) {
        setIsOpen(!isOpen);
    }
  };

  const close = () => setIsOpen(false);

  return {
    isOpen,
    ref,
    toggle,
    close
  };
};
