import { api } from "@/api/api";
import type { Grape } from "@/types/grape";

const GrapeService = {
  async getGrapeById(id: number): Promise<Grape> {
    try {
      const response = await api.get<Grape>(`/grapes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении винограда с ID ${id}:`, error);
      throw error;
    }
  },

  async getAllGrapes(): Promise<Grape[]> {
    try {
      const response = await api.get<Grape[]>("/grapes");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении винограда:", error);
      throw error;
    }
  },
};

export default GrapeService;
