import { Position } from './Position';

export interface Company {
  id: number;
  companyName: string;
  companyPhone?: string;
  companyEmail?: string;
  companyUrl?: string;
  isContacted?: boolean;
  positions?: Position[];
}

export interface CreateCompanyDto {
  companyName: string;
  companyPhone?: string;
  companyEmail?: string;
  companyUrl?: string;
}

export interface UpdateCompanyDto {
  companyName: string;
  companyPhone?: string;
  companyEmail?: string;
  companyUrl?: string;
  isContacted?: boolean;
   positionIds?: number[];
}
