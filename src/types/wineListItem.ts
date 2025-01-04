// src/models/WineListItem.ts
import type { Wine } from "@/types/wine.ts";

export interface WineListItem {
  id: number;
  name: string;
  createdAt: string; // Date as string (ISO format)
  wines: Wine[];
}

export interface CreateWineList {
  wineListId: number;
  wineId: number;
  pricePerBottle: number;
  pricePerGlass?: number;
}
