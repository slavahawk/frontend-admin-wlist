import { ref } from "vue";
import { defineStore } from "pinia";
import {
  WineService,
  type Wine,
  type WineFilters,
  type WineRequest,
  type SearchWineRequest,
  type WineResponse,
} from "w-list-api";

export const useWineStore = defineStore("wine", () => {
  const wines = ref<WineResponse>();
  const winesFilter = ref<WineFilters>();
  const winesSearch = ref<WineResponse>();
  const selectedWine = ref<Wine | null>(null);
  const loading = ref(false);
  const loadingSearch = ref(false);
  const error = ref<string | null>(null);
  const errorSearch = ref<string | null>(null);

  const fetchWines = async (requestParams: WineRequest) => {
    loading.value = true;
    error.value = null;

    try {
      wines.value = await WineService.getAll(requestParams);
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchWinesSearch = async (params: SearchWineRequest) => {
    loadingSearch.value = true;
    errorSearch.value = null;

    try {
      const data = await WineService.search(params);
      winesSearch.value = data;
      return data;
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
      winesFilter.value = await WineService.getFilter();
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
      selectedWine.value = await WineService.getById(id);
    } catch (err) {
      error.value = "Ошибка при получении вина. Попробуйте еще раз.";
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
    clearSelectedWine,
    winesSearch,
    fetchWinesSearch,
    loadingSearch,
    errorSearch,
  };
});
