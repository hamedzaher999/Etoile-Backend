export interface Country {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}

export interface City {
  id: string;
  country_id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}

export interface CountryCities {
  country_id: string;
  country_name: string;
  country_code: string;
  city_id: string;
  city_name: string;
  city_code: string;
}
