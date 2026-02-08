import { Position, CreatePositionDto, UpdatePositionDto } from '../types/Position';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const positionService = {
  getAll: async (): Promise<Position[]> => {
    const response = await fetch(API_ENDPOINTS.POSITION.GET_ALL);
    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }
    return response.json();
  },

  getByCountryId: async (countryId: number): Promise<Position[]> => {
    const response = await fetch(API_ENDPOINTS.POSITION.GET_BY_COUNTRY(countryId));
    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }
    return response.json();
  },

  create: async (position: CreatePositionDto): Promise<Position> => {
    const response = await fetch(API_ENDPOINTS.POSITION.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(position),
    });
    if (!response.ok) {
      throw new Error('Failed to create position');
    }
    return response.json();
  },

  update: async (id: number, position: UpdatePositionDto): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.POSITION.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(position),
    });
    if (!response.ok) {
      throw new Error('Failed to update position');
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.POSITION.DELETE(id), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete position');
    }
  },
};
