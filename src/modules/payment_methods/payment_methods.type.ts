export interface PaymentMethod {
  id: string;
  name: string;
  is_online: boolean;
  is_active: boolean;
  img_url: string | null;
  created_at: Date;
  deleted_at: Date | null;
}
