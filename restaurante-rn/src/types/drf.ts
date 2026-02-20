export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export function toArray<T>(data: Paginated<T> | T[] | null | undefined): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && Array.isArray((data as Paginated<T>).results)) return (data as Paginated<T>).results;
  return [];
}