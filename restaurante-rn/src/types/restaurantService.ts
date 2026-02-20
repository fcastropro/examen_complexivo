export type RestaurantService = {
  id: string;
  table_id: number;
  menu_id?: string;
  service_type_id?: string;
  date?: string;
  notes?: string;
  cost?: number;
};
