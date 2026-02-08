import { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/Company';
import { PaginatedResult } from '../types/Pagination';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export interface CompanyQueryParams {
  companyUrl?: string;
  positions?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: string;
  companyName?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export const companyService = {
  getAll: async (params: CompanyQueryParams = {
    companyUrl: undefined,
    positions: undefined
  }): Promise<PaginatedResult<Company>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.sortColumn) queryParams.append('sortColumn', params.sortColumn);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const searchTerms = [];
    if (params.search?.trim()) searchTerms.push(params.search.trim());
    if (params.companyName?.trim()) searchTerms.push(params.companyName.trim());
    if (params.companyPhone?.trim()) searchTerms.push(params.companyPhone.trim());
    if (params.companyEmail?.trim()) searchTerms.push(params.companyEmail.trim());
    if (params.companyUrl?.trim()) searchTerms.push(params.companyUrl.trim());
    if (params.positions?.trim()) searchTerms.push(params.positions.trim());

    if (searchTerms.length > 0) {
      queryParams.append('search', searchTerms.join(' '));
    }

    const response = await fetch(`${API_ENDPOINTS.COMPANY.GET_ALL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return response.json();
  },

  getUncontacted: async (params: CompanyQueryParams = {
    companyUrl: undefined,
    positions: undefined
  }): Promise<PaginatedResult<Company>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.sortColumn) queryParams.append('sortColumn', params.sortColumn);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const searchTerms = [];
    if (params.search?.trim()) searchTerms.push(params.search.trim());
    if (params.companyName?.trim()) searchTerms.push(params.companyName.trim());
    if (params.companyPhone?.trim()) searchTerms.push(params.companyPhone.trim());
    if (params.companyEmail?.trim()) searchTerms.push(params.companyEmail.trim());
    if (params.companyUrl?.trim()) searchTerms.push(params.companyUrl.trim());
    if (params.positions?.trim()) searchTerms.push(params.positions.trim());
    
    if (searchTerms.length > 0) {
      queryParams.append('search', searchTerms.join(' '));
    }

    const response = await fetch(`${API_ENDPOINTS.COMPANY.GET_UNCONTACTED}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch uncontacted companies');
    }
    return response.json();
  },

  getById: async (id: number): Promise<Company> => {
    const response = await fetch(API_ENDPOINTS.COMPANY.GET_BY_ID(id));
    if (!response.ok) {
      throw new Error('Failed to fetch company');
    }
    return response.json();
  },

  create: async (data: CreateCompanyDto): Promise<Company> => {
    const response = await fetch(API_ENDPOINTS.COMPANY.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create company');
    }
    return response.json();
  },

  addPositions: async (companyId: number, positionIds: number[]): Promise<void> => {
    const url = API_ENDPOINTS.COMPANY.ADD_POSITIONS(companyId, positionIds);
    const response = await fetch(url, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to add positions to company');
    }
  },

  update: async (id: number, data: UpdateCompanyDto): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.COMPANY.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update company');
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.COMPANY.DELETE(id), {
      method: 'DELETE',
    });
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Failed to delete company');
      } catch (e) {
        throw new Error(response.statusText || 'Failed to delete company');
      }
    }
  },
};
