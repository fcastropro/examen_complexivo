import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Order } from "../types/order";

export async function listOrdersApi(): Promise<Paginated<Order> | Order[]> {
  const { data } = await http.get<Paginated<Order> | Order[]>("/api/orders/");
  return data;
}

export async function createOrderApi(payload: {
  table: number;
  items_summary: string;
  total: string;
  status: string;
}): Promise<Order> {
  const { data } = await http.post<Order>("/api/orders/", payload);
  return data;
}

export async function updateOrderApi(id: number, payload: Partial<{ items_summary: string; total: string; status: string }>): Promise<Order> {
  const { data } = await http.patch<Order>(`/api/orders/${id}/`, payload);
  return data;
}
