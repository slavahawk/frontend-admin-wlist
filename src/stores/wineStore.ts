import { ref } from "vue";
import { defineStore } from "pinia";
import {
  type SearchWineRequest,
  type Wine,
  type WineRequest,
  type WineResponse,
  WineService,
} from "w-list-api";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";

export const useWineStore = defineStore("wine", () => {
  const wines = ref<WineResponse>();
  const winesSearch = ref<WineResponse>();
  const selectedWine = ref<Wine | null>(null);
  const loading = ref(false);
  const loadingSearch = ref(false);
  const toast = useToast();

  const fetchWines = async (requestParams: WineRequest) => {
    loading.value = true;

    try {
      wines.value = await WineService.getAll(requestParams);
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  const fetchWinesSearch = async (params: SearchWineRequest) => {
    loadingSearch.value = true;

    try {
      const data = await WineService.search(params);
      winesSearch.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      loadingSearch.value = false;
    }
  };

  const clearSelectedWine = () => {
    selectedWine.value = null;
  };

  return {
    wines,
    selectedWine,
    loading,
    fetchWines,
    clearSelectedWine,
    winesSearch,
    fetchWinesSearch,
    loadingSearch,
  };
});
