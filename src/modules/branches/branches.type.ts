export interface Branch {
  id: string;
  country_id: string;
  city_id: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}
