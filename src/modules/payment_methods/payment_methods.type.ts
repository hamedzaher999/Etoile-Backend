export interface PaymentMethod {
  id: string;
  name: string;
  is_online: boolean;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}
