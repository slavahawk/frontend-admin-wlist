import type { Country } from "@/types/country.ts";

export interface Region {
  id: number;
  name: string;
  country: Country;
  originalImagePath: string;
  createdAt: string; // ISO 8601 date-time format
  updatedAt: string; // ISO 8601 date-time format
}
