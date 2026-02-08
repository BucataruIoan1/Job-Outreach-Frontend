import { API_ENDPOINTS } from '../api/apiEndpoints';
import { EmailSent } from '../types/EmailSent';
import { PaginatedResult } from '../types/Pagination';

export const emailSentService = {
  getAll: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResult<EmailSent>> => {
    const response = await fetch(`${API_ENDPOINTS.EMAIL_SENT.GET_ALL}?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) {
      throw new Error('Failed to fetch email sent history');
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.EMAIL_SENT.DELETE(id), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete email record');
    }
  },
};
