export interface Email {
  id: number;
  subject: string;
  content: string;
  attachment?: string;
  sentBy?: string;
  countryId?: number;
  positionId?: number;
}

export interface UpdateEmailDto {
  subject: string;
  content: string;
  attachment?: string;
  sentBy?: string;
  countryId?: number;
  positionId?: number;
}

export interface SendEmailRequestDto {
  companyIds: number[];
  emailTemplateId: number;
}
