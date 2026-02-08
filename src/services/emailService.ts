import { Email, UpdateEmailDto, SendEmailRequestDto } from '../types/Email';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const emailService = {
  getAll: async (): Promise<Email[]> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.GET_ALL);
    if (!response.ok) {
      throw new Error('Failed to fetch email templates');
    }
    return response.json();
  },

  getById: async (id: number): Promise<Email> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.GET_BY_ID(id));
    if (!response.ok) {
      throw new Error('Failed to fetch email template');
    }
    return response.json();
  },

  create: async (data: UpdateEmailDto): Promise<Email> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create email template');
    }
    return response.json();
  },

  createWithFile: async (formData: FormData): Promise<Email> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.CREATE, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to create email template');
    }
    return response.json();
  },

  update: async (id: number, data: UpdateEmailDto): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update email template');
    }
  },

  updateWithFile: async (id: number, formData: FormData): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.UPDATE(id), {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to update email template');
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.DELETE(id), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete email template');
    }
  },

  sendEmails: async (request: SendEmailRequestDto): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.SEND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Failed to send emails');
    }
  },

  getAttachmentUrl: (id: number): string => {
    return API_ENDPOINTS.EMAIL.GET_ATTACHMENT(id);
  },

  downloadAttachment: async (id: number, fileName: string = 'attachment.pdf'): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.EMAIL.GET_ATTACHMENT(id));
    if (!response.ok) {
      throw new Error('Failed to download attachment');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  getByCountryId: async (countryId: number, positionId?: number): Promise<Email | null> => {
    let url = API_ENDPOINTS.EMAIL.GET_BY_COUNTRY(countryId);
    if (positionId) {
      url += `?positionId=${positionId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch email template');
    }
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  },
};
