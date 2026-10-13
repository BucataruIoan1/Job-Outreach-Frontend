import { Position } from './Position';

export interface Company {
  id: number;
  companyName: string;
  companyPhone?: string;
  companyEmail?: string;
  companyUrl?: string;
  isContacted?: boolean;
  countryId?: number | null;
  positions?: Position[];
}

export interface CreateCompanyDto {
  companyName: string;
  companyPhone?: string;
  companyEmail?: string;
  companyUrl?: string;
  countryId: number;
}

export interface UpdateCompanyDto {
  companyName: string;
  companyPhone?: string;
  companyEmail?: string;
  companyUrl?: string;
  countryId?: number;
  isContacted?: boolean;
   positionIds?: number[];
}
