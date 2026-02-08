import { ChevronDown, Check } from 'lucide-react';
import { Country } from '../../types/Country';
import { useCountrySelect } from '../../hooks/useCountrySelect';
import './CountrySelect.css';

interface CountrySelectProps {
  countries: Country[];
  selectedCountry: Country | null;
  onChange: (country: Country) => void;
  placeholder?: string;
}

export const CountrySelect = ({ countries, selectedCountry, onChange, placeholder = 'Alege țara...' }: CountrySelectProps) => {
  const { isOpen, ref, toggle, close } = useCountrySelect();

  return (
    <div className="country-select-container" ref={ref}>
      <div 
        className={`country-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={toggle}
      >
        {selectedCountry ? (
           <div className="selected-value">
             <span className="country-badge">{selectedCountry.countryCode}</span>
             <span className="country-name">{selectedCountry.countryName}</span>
           </div>
        ) : (
           <span className="placeholder">{placeholder}</span>
        )}
        <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="country-dropdown">
           {countries.map(country => (
             <div 
               key={country.id} 
               className={`country-option ${selectedCountry?.id === country.id ? 'selected' : ''}`}
               onClick={() => { onChange(country); close(); }}
             >
               <div className="option-check">
                 {selectedCountry?.id === country.id && <Check size={14} />}
               </div>
               <span className="country-badge">{country.countryCode}</span>
               <span className="country-name">{country.countryName}</span>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
