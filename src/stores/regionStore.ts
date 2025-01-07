// src/stores/regionStore.ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import RegionService from "@/service/RegionService";
import type { Region } from "@/types/region";

export const useRegionStore = defineStore("region", () => {
  const regions = ref<Region[]>([]);
  const selectedRegion = ref<Region | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const regionOptions = computed(() => {
    return regions.value.map((region) => ({
      value: region.id,
      label: region.name,
    }));
  });

  const fetchRegions = async () => {
    loading.value = true;
    error.value = null;

    try {
      regions.value = await RegionService.getAllRegions();
    } catch (err) {
      error.value = "Ошибка при получении регионов. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchRegionById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedRegion.value = await RegionService.getRegionById(id);
    } catch (err) {
      error.value = "Ошибка при получении региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const clearSelectedRegion = () => {
    selectedRegion.value = null;
  };

  return {
    regions,
    regionOptions,
    selectedRegion,
    loading,
    error,
    fetchRegions,
    fetchRegionById,
    clearSelectedRegion,
  };
});
