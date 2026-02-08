export const API_BASE_URL = '';

export const API_ENDPOINTS = {
  COMPANY: {
    GET_ALL: `${API_BASE_URL}/api/Company`,
    GET_UNCONTACTED: `${API_BASE_URL}/api/Company/uncontacted`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/Company?id=${id}`,
    CREATE: `${API_BASE_URL}/api/Company`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/Company/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/Company/${id}`,
    ADD_POSITIONS: (companyId: number, positionIds: number[]) =>
      `${API_BASE_URL}/api/Company/${companyId}/positions?${positionIds
        .map(id => `positionIds=${id}`)
        .join('&')}`,
  },
  COUNTRY: {
    GET_ALL: `${API_BASE_URL}/api/Country`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/Country?id=${id}`,
    CREATE: `${API_BASE_URL}/api/Country`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/Country/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/Country/${id}`,
  },
  POSITION: {
    GET_ALL: `${API_BASE_URL}/api/Position`,
    GET_BY_COUNTRY: (countryId: number) => `${API_BASE_URL}/api/Position/country/${countryId}`,
    CREATE: `${API_BASE_URL}/api/Position`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/Position/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/Position/${id}`,
  },
  EMAIL: {
    GET_ALL: `${API_BASE_URL}/api/Email`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/Email?id=${id}`,
    GET_BY_COUNTRY: (countryId: number) => `${API_BASE_URL}/api/Email/country/${countryId}`,
    CREATE: `${API_BASE_URL}/api/Email`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/Email/${id}`,
    SEND: `${API_BASE_URL}/api/Email/send`,
    DELETE: (id: number) => `${API_BASE_URL}/api/Email/${id}`,
    GET_ATTACHMENT: (id: number) => `${API_BASE_URL}/api/Email/${id}/attachment`,
  },
  EMAIL_SENT: {
    GET_ALL: `${API_BASE_URL}/api/EmailSent`,
    DELETE: (id: number) => `${API_BASE_URL}/api/EmailSent/${id}`,
  }
};
