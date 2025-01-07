import { api } from "@/api/api";
import type { Country } from "@/types/country";

const CountryService = {
  async getCountryById(id: number): Promise<Country> {
    try {
      const response = await api.get<Country>(`/countries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении страны с ID ${id}:`, error);
      throw error;
    }
  },

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await api.get<Country[]>("/countries");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении стран:", error);
      throw error;
    }
  },
};

export default CountryService;
