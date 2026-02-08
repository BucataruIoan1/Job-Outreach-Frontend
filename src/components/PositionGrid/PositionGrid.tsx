import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Position } from '../../types/Position';
import './PositionGrid.css';
import { Pagination } from '../Pagination/Pagination';
import { FilterType } from '../Common/Table/TableFilterInput';

export interface PositionFilterState {
  positionName: string;
}

interface PositionGridProps {
  positions: Position[];
  onEdit: (position: Position) => void;
  onDelete: (position: Position) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
  filters: PositionFilterState;
  onFilterChange: (key: keyof PositionFilterState, value: string | FilterType) => void;
}

export const PositionGrid: React.FC<PositionGridProps> = ({ 
  positions, 
  onEdit, 
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange}) => {

  return (
    <div className="position-grid-container">
      <div className="table-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Acțiuni</th>
              <th>Nume Poziție</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>
                  Nu s-au găsit poziții
                </td>
              </tr>
            ) : (
              positions.map((position) => (
                <tr key={position.id}>
                  <td className="actions-cell">
                    <button 
                      className="action-btn"
                      onClick={() => onEdit(position)}
                      title="Editează"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => onDelete(position)}
                      title="Șterge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                  <td>
                    <div className="position-name-cell">
                      <span>{position.positionName}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
