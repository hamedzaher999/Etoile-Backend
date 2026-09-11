export interface OrderForm {
  payment_method_id: string;
  package_id: string;
  branch_id: string;
  delivery_location: string;
  contact?: string;
}

export interface OrderData {
  client_id: string;
  payment_method_id: string;
  package_id: string;
  branch_id: string;
  price: number;
  delivery_location: string;
  contact?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  client_id?: string;
  branch_id?: string;
  package_id?: string;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "payed"
  | "delivered"
  | "canceled";
