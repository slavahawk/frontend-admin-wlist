import { api } from "@/api/api"; // Импортируем настроенный экземпляр axios
import type {
  CreateWineList,
  WineListItem,
  WineListItemResponses,
} from "@/types/wineListItem"; // Импортируем интерфейс WineListItem
import type { Request } from "@/types/wineList"; // Импортируем тип Request, если необходимо

const WineListItemService = {
  async getWineListItems(listId: number): Promise<WineListItemResponses> {
    try {
      const response = await api.get<WineListItemResponses>(
        `/wine-lists/${listId}/items`,
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении списка винных позиций:", error);
      throw error;
    }
  },

  async getWineListItemById(
    listId: number,
    itemId: number,
  ): Promise<WineListItem> {
    try {
      const response = await api.get<WineListItem>(
        `/wine-lists/${listId}/items/${itemId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении винной позиции с ID ${id}:`, error);
      throw error;
    }
  },

  async createWineListItem({
    wineListId,
    wineId,
    pricePerBottle,
    pricePerGlass,
  }: CreateWineList): Promise<WineListItem> {
    try {
      const response = await api.post<WineListItem>(
        `/wine-list-items/${wineListId}/items`,
        {},
        { params: { wineId, pricePerBottle, pricePerGlass } },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании винной позиции:", error);
      throw error;
    }
  },

  async updateWineListItem(
    id: number,
    wineListItemData: Request,
  ): Promise<WineListItem> {
    try {
      const response = await api.put<WineListItem>(
        `/wine-list-items/${id}`,
        wineListItemData,
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении винной позиции с ID ${id}:`, error);
      throw error;
    }
  },

  async deleteWineListItem(id: number): Promise<void> {
    try {
      await api.delete(`/wine-list-items/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении винной позиции с ID ${id}:`, error);
      throw error;
    }
  },
};

export default WineListItemService;
