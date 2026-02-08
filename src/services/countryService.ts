import { Country, CreateCountryDto, UpdateCountryDto } from '../types/Country';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const countryService = {
  getAll: async (): Promise<Country[]> => {
    const response = await fetch(API_ENDPOINTS.COUNTRY.GET_ALL);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    return response.json();
  },

  getById: async (id: number): Promise<Country> => {
    const response = await fetch(API_ENDPOINTS.COUNTRY.GET_BY_ID(id));
    if (!response.ok) {
      throw new Error('Failed to fetch country');
    }
    return response.json();
  },

  create: async (data: CreateCountryDto): Promise<Country> => {
    const response = await fetch(API_ENDPOINTS.COUNTRY.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create country');
    }
    return response.json();
  },

  update: async (id: number, data: UpdateCountryDto): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.COUNTRY.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update country');
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.COUNTRY.DELETE(id), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete country');
    }
  },
};
