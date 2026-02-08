import React from 'react';
import './TableCommon.css';

export type FilterType = 'contains' | 'startsWith' | 'equals';

export interface TableFilterInputProps {
  value: string;
  filterType?: FilterType;
  onChange: (value: string) => void;
  onFilterTypeChange?: (type: FilterType) => void;
  placeholder?: string;
}

export const TableFilterInput: React.FC<TableFilterInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="table-filter-container">
      <input
        type="text"
        className="filter-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
