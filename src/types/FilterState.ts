import { FilterType } from '../components/Common/Table/TableFilterInput';

export interface FilterState {
  companyPhoneFilterType: FilterType | undefined;
  companyEmailFilterType: FilterType | undefined;
  companyUrl: string;
  positions: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
}
