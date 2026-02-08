import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './TableCommon.css';

interface TableSortHeaderProps {
  label: string;
  column: string;
  currentSortColumn: string | null;
  currentSortOrder: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
}

export const TableSortHeader: React.FC<TableSortHeaderProps> = ({
  label,
  column,
  currentSortColumn,
  currentSortOrder,
  onSort,
}) => {
  const isSorted = currentSortColumn === column;

  return (
    <div className="table-sort-header" onClick={() => onSort(column)}>
      <span>{label}</span>
      {isSorted ? (
        currentSortOrder === 'asc' ? (
          <ArrowUp className="sort-icon" />
        ) : (
          <ArrowDown className="sort-icon" />
        )
      ) : (
        <ArrowUpDown className="sort-icon" style={{ opacity: 0.3 }} />
      )}
    </div>
  );
};
