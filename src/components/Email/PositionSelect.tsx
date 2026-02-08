import { ChevronDown, Check } from 'lucide-react';
import { Position } from '../../types/Position';
import { usePositionSelect } from '../../hooks/usePositionSelect';
import './CountrySelect.css';

interface PositionSelectProps {
  positions: Position[];
  selectedPosition: Position | null;
  onChange: (position: Position) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const PositionSelect = ({ positions, selectedPosition, onChange, placeholder = 'Selectează poziția...', disabled = false }: PositionSelectProps) => {
  const { isOpen, ref, toggle, close } = usePositionSelect(disabled);

  return (
    <div className={`country-select-container ${disabled ? 'disabled' : ''}`} ref={ref}>
      <div 
        className={`country-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggle}
        style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      >
        {selectedPosition ? (
           <div className="selected-value">
             <span className="country-name">{selectedPosition.positionName}</span>
           </div>
        ) : (
           <span className="placeholder">{placeholder}</span>
        )}
        <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="country-dropdown">
           {positions.length === 0 ? (
               <div className="country-option disabled">
                   <span className="country-name">Nu există poziții disponibile</span>
               </div>
           ) : (
               positions.map(position => (
                <div 
                  key={position.id} 
                  className={`country-option ${selectedPosition?.id === position.id ? 'selected' : ''}`}
                  onClick={() => { onChange(position); close(); }}
                >
                  <div className="option-check">
                    {selectedPosition?.id === position.id && <Check size={14} />}
                  </div>
                  <span className="country-name">{position.positionName}</span>
                </div>
              ))
           )}
        </div>
      )}
    </div>
  );
};
