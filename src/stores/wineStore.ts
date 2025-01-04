import { ref } from "vue";
import { defineStore } from "pinia";
import WineService from "@/service/WineService";
import type {
  CreateWineRequest,
  Wine,
  WineFilters,
  WineRequest,
  WineRequestSearch,
  WineResponses,
} from "@/types/wine";

export const useWineStore = defineStore("wine", () => {
  const wines = ref<WineResponses>();
  const winesFilter = ref<WineFilters>();
  const winesSearch = ref<WineResponses>();
  const selectedWine = ref<Wine | null>(null);
  const loading = ref(false);
  const loadingSearch = ref(false);
  const error = ref<string | null>(null);
  const errorSearch = ref<string | null>(null);

  const fetchWines = async (requestParams: WineRequest) => {
    loading.value = true;
    error.value = null;

    try {
      wines.value = await WineService.getAllWines(requestParams);
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchWinesSearch = async (params: WineRequestSearch) => {
    loadingSearch.value = true;
    errorSearch.value = null;

    try {
      winesSearch.value = await WineService.getWineSearch(params);
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loadingSearch.value = false;
    }
  };

  const fetchWinesFilter = async () => {
    loading.value = true;
    error.value = null;

    try {
      winesFilter.value = await WineService.getWineFilters();
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchWineById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedWine.value = await WineService.getWineById(id);
    } catch (err) {
      error.value = "Ошибка при получении вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createWine = async (wineData: CreateWineRequest, image: File) => {
    loading.value = true;
    error.value = null;

    try {
      const newWine = await WineService.createWine(wineData, image);
      // wines.value._embedded.rootWineResponseList.push(newWine);
      return newWine;
    } catch (err) {
      error.value = "Ошибка при создании вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateWine = async (id: number, wineData: CreateWineRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedWine = await WineService.updateWine(id, wineData);
      const index = wines.value.findIndex((wine) => wine.id === id);
      if (index !== -1) {
        wines.value[index] = updatedWine;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteWine = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await WineService.deleteWine(id);
      wines.value = wines.value.filter((wine) => wine.id !== id);
    } catch (err) {
      error.value = "Ошибка при удалении вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const clearSelectedWine = () => {
    selectedWine.value = null;
  };

  return {
    wines,
    winesFilter,
    selectedWine,
    loading,
    error,
    fetchWines,
    fetchWinesFilter,
    fetchWineById,
    createWine,
    updateWine,
    deleteWine,
    clearSelectedWine,
    winesSearch,
    fetchWinesSearch,
    loadingSearch,
    errorSearch,
  };
});
