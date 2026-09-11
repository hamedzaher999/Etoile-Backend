export interface OrderPayment {
  id: string;
  order_id: string;
  payment_method_id: string;
  provider: string;
  provider_intent_id: string | null;
  transaction_reference: string | null;
  status: "pending" | "success" | "failed";
  amount: number;
  metadata: any;
  paid_at: Date | null;
  created_at: Date;
}
