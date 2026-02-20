export type OrderStatus = "PENDING" | "IN_PROGRESS" | "SERVED" | "PAID";

export type Order = {
  id: number;
  table: number;
  table_name?: string;
  items_summary: string;
  total: string;
  status: OrderStatus;
  created_at?: string;
};
