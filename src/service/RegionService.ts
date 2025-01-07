import { api } from "@/api/api";
import type { Region } from "@/types/region";

const RegionService = {
  async getRegionById(id: number): Promise<Region> {
    try {
      const response = await api.get<Region>(`/regions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении региона с ID ${id}:`, error);
      throw error;
    }
  },

  async getAllRegions(): Promise<Region[]> {
    try {
      const response = await api.get<Region[]>("/regions");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении регионов:", error);
      throw error;
    }
  },
};

export default RegionService;
