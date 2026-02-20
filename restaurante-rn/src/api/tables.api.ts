import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Table } from "../types/table";

export async function listTablesApi(): Promise<Paginated<Table> | Table[]> {
  const { data } = await http.get<Paginated<Table> | Table[]>("/api/tables/");
  return data;
}
