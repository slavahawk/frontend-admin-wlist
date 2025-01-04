import { api } from "@/api/api";
import type { Request, WineList } from "@/types/wineList";

const WineListService = {
  async getWineListById(id: number): Promise<WineList> {
    try {
      const response = await api.get<WineList>(`/wine-lists/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении списка вин с ID ${id}:`, error);
      throw error;
    }
  },

  async updateWineList(id: number, wineListData: Request): Promise<WineList> {
    try {
      const response = await api.put<WineList>(
        `/wine-lists/${id}`,
        wineListData,
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении списка вин с ID ${id}:`, error);
      throw error;
    }
  },

  async deleteWineList(id: number): Promise<void> {
    try {
      await api.delete(`/wine-lists/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении списка вин с ID ${id}:`, error);
      throw error;
    }
  },

  async createWineList(wineListData: Request): Promise<WineList> {
    try {
      const response = await api.post<WineList>("/wine-lists", wineListData);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании списка вин:", error);
      throw error;
    }
  },

  async getAllWineLists(): Promise<WineList[]> {
    try {
      const response = await api.get<WineList[]>("/wine-lists");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении списков вин:", error);
      throw error;
    }
  },
};

export default WineListService;
