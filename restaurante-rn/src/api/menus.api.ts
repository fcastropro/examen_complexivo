import { http } from "./http";
import type { Menu } from "../types/menu";
import type { Paginated } from "../types/drf";

export async function listMenusApi(): Promise<Paginated<Menu> | Menu[]> {
  const { data } = await http.get<Paginated<Menu> | Menu[]>("/api/menus/");
  return data;
}
