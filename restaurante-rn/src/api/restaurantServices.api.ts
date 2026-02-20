import { http } from "./http";
import type { RestaurantService } from "../types/restaurantService";
import type { Paginated } from "../types/drf";

export type RestaurantServiceCreatePayload = {
  table_id: number;
  service_type_id: string;
  notes?: string;
  cost?: number;
};

export async function listRestaurantServicesApi(): Promise<Paginated<RestaurantService> | RestaurantService[]> {
  const { data } = await http.get<Paginated<RestaurantService> | RestaurantService[]>("/api/restaurant-services/");
  return data;
}

export async function createRestaurantServiceApi(payload: RestaurantServiceCreatePayload): Promise<RestaurantService> {
  const { data } = await http.post<RestaurantService>("/api/restaurant-services/", payload);
  return data;
}

export async function deleteRestaurantServiceApi(id: string): Promise<void> {
  await http.delete(`/api/restaurant-services/${id}/`);
}
