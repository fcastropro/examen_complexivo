import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Table = {
  id: number;
  name: string;
  capacity: number;
  is_available: boolean;
  created_at?: string;
};

export async function listTablesApi() {
  const { data } = await http.get<Paginated<Table>>("/api/tables/");
  return data;
}

export async function createTableApi(payload: Omit<Table, "id">) {
  const { data } = await http.post<Table>("/api/tables/", payload);
  return data;
}

export async function updateTableApi(id: number, payload: Partial<Table>) {
  const { data } = await http.put<Table>(`/api/tables/${id}/`, payload);
  return data;
}

export async function deleteTableApi(id: number) {
  await http.delete(`/api/tables/${id}/`);
}
