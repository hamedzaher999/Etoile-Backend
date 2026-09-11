export interface Setting {
  id: string;
  branch_id: string;
  is_open: boolean;
  closes_at: Date | null;
  max_classic_orders: number;
  max_vip_orders: number;
  requested_classic_orders: number;
  requested_vip_orders: number;
  restarted_at: Date;
}
