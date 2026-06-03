export interface OrderForm {
  payment_method_id: string;
  package_id: string;
  country_id: string;
  city_id: string;
  delivery_location: string;
  receiver_phone: string;
  receiver_name: string;
}

export interface OrderData {
  payment_method_id: string;
  payment_method_name: string;
  package_id: string;
  package_name: string;
  country_id: string;
  country_name: string;
  city_id: string;
  city_name: string;
  price: number;
  delivery_location: string;
  receiver_phone: string;
  receiver_name: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  client_id?: string;
  country_id?: string;
  city_id?: string;
  package_id?: string;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "shipping"
  | "delivered"
  | "canceled";
