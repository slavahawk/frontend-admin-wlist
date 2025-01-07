import type { Wine } from "@/types/wine.ts";

export interface WineListItem {
  id: number;
  wineList: WineList; // Виносписок, в котором находится данный элемент
  wine: Wine; // Вино, которое связано с этим элементом
  pricePerBottle: number; // Цена за бутылку
  pricePerGlass: number; // Цена за бокал
  createdAt: string; // Дата создания в формате 'YYYY-MM-DDTHH:mm:ssZ'
  updatedAt: string; // Дата обновления в формате 'YYYY-MM-DDTHH:mm:ssZ'
}

export interface WineList {
  id: number; // ID списка вин
  name: string; // Название списка вин
  shopId: number; // Магазин, которому принадлежит список вин
  itemCount: number; // Элементы списка вин
  isDeleted: boolean; // Флаг удаления
  createdAt: string; // Дата создания в формате 'YYYY-MM-DDTHH:mm:ssZ'
  updatedAt: string; // Дата обновления в формате 'YYYY-MM-DDTHH:mm:ssZ'
}

export interface Request {
  name: string; // Имя списка вин или описываемого ресурса
}
