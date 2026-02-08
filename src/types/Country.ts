export interface Country {
  id: number;
  countryName: string;
  countryCode: string;
}

export interface CreateCountryDto {
  countryName: string;
  countryCode: string;
}

export interface UpdateCountryDto {
  countryName: string;
  countryCode: string;
}
