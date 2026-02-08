import React from 'react';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Company } from '../../types/Company';
import './CompanyGrid.css';
import { Pagination } from '../Pagination/Pagination';
import { TableSortHeader } from '../Common/Table/TableSortHeader';
import { TableFilterInput, FilterType } from '../Common/Table/TableFilterInput';
import { FilterState } from '../../types/FilterState';

interface CompanyGridProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | FilterType) => void;
}

export const CompanyGrid: React.FC<CompanyGridProps> = ({ 
  companies, 
  onEdit, 
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  sortColumn,
  sortOrder,
  onSort,
  filters,
  onFilterChange
}) => {
  
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="company-grid-container">
      <div className="table-wrapper">
        <table className="companies-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Acțiuni</th>
              <th>
                <TableSortHeader
                  label="Companie"
                  column="companyName"
                  currentSortColumn={sortColumn}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>
              <th>
                <TableSortHeader
                  label="Website"
                  column="companyUrl"
                  currentSortColumn={sortColumn}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>
              <th>
                <TableSortHeader
                  label="Telefon"
                  column="companyPhone"
                  currentSortColumn={sortColumn}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>
              <th>
                <TableSortHeader
                  label="Email"
                  column="companyEmail"
                  currentSortColumn={sortColumn}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>
              <th>
                <TableSortHeader
                  label="Poziții"
                  column="positions"
                  currentSortColumn={sortColumn}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>
              <th>Contactat</th>
            </tr>
            <tr>
              <th></th>
              <th>
                <TableFilterInput
                  value={filters.companyName}
                  onChange={(val) => onFilterChange('companyName', val)}
                />
              </th>
              <th>
                <TableFilterInput
                  value={filters.companyUrl}
                  onChange={(val) => onFilterChange('companyUrl', val)}
                />
              </th>
              <th>
                <TableFilterInput
                  value={filters.companyPhone}
                  onChange={(val) => onFilterChange('companyPhone', val)}
                />
              </th>
              <th>
                <TableFilterInput
                  value={filters.companyEmail}
                  onChange={(val) => onFilterChange('companyEmail', val)}
                />
              </th>
              <th>
                <TableFilterInput
                  value={filters.positions}
                  onChange={(val) => onFilterChange('positions', val)}
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Nu există companii care să corespundă criteriilor.
                  </div>
                </td>
              </tr>
            ) : (
              companies.map((company) => (
              <tr key={company.id}>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="action-btn"
                      onClick={() => onEdit(company)}
                      title="Editează"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => onDelete(company)}
                      title="Șterge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="company-name-cell">
                    <div className="company-avatar">
                      {company.companyName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold">{company.companyName}</span>
                  </div>
                </td>
                <td style={{ color: 'hsl(var(--primary))' }}>
                  {company.companyUrl ? (
                    <a 
                      href={company.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {company.companyUrl}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ color: 'hsl(var(--muted-foreground))' }}>{company.companyPhone || '-'}</td>
                <td style={{ color: 'hsl(var(--muted-foreground))' }}>{company.companyEmail || '-'}</td>
                <td style={{ color: 'hsl(var(--muted-foreground))', maxWidth: '260px' }}>
                  <div className="positions-cell">
                    {company.positions && company.positions.length > 0 ? (
                      company.positions.map(p => p.positionName).join(', ')
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
                <td>
                  {company.isContacted ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--success))' }}>
                      <CheckCircle size={16} />
                      <span>Da</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
                      <XCircle size={16} />
                      <span>Nu</span>
                    </div>
                  )}
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
