import { api } from "@/api/api";
import type {
  Wine,
  WineFilters,
  WineRequest,
  WineRequestSearch,
  WineResponses,
} from "@/types/wine";

const WineService = {
  async getAllWines(requestParams: WineRequest): Promise<WineResponses> {
    try {
      const response = await api.get<WineResponses>("/wines", {
        params: requestParams,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении вин:", error);
      throw error;
    }
  },

  async getWineFilters(): Promise<WineFilters> {
    try {
      const response = await api.get<WineFilters>("/wines/filters");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении фильтров:", error);
      throw error;
    }
  },

  async getWineSearch(params: WineRequestSearch): Promise<WineResponses> {
    try {
      const response = await api.get<WineResponses>("/wines/search", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при поиске вин:", error);
      throw error;
    }
  },

  async getWineById(id: number): Promise<Wine> {
    try {
      const response = await api.get<Wine>(`/wines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении вина с ID ${id}:`, error);
      throw error;
    }
  },
};

export default WineService;
