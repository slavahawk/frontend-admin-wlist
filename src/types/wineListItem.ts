// src/models/WineListItem.ts
import type { Wine, WineRoot } from "@/types/wine.ts";

export interface WineListItem {
  id: number;
  name: string;
  createdAt: string; // Date as string (ISO format)
  wines: Wine[];
}

export interface Prices {
  pricePerBottle: number;
  pricePerGlass?: number;
}

export interface CreateWineList extends Prices {
  wineListId: number;
  wineId: number;
}

export interface WineListItemResponses {
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _embedded: {
    adminWineResponseList: Wine[];
    rootWineResponseList: WineRoot[];
  };
}
