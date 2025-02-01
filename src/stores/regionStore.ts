import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { type Region, RegionService } from "w-list-api";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";

export const useRegionStore = defineStore("region", () => {
  const regions = ref<Region[]>([]);
  const selectedRegion = ref<Region | null>(null);
  const loading = ref(false);
  const toast = useToast();

  const regionOptions = computed(() =>
    regions.value.map((region) => ({
      value: region.id,
      label: region.name,
    })),
  );

  const getRegionNameById = (regionId: number): string | null =>
    regions.value.find((region) => region.id === regionId)?.name ?? null;

  const fetchRegions = async () => {
    loading.value = true;

    try {
      regions.value = await RegionService.getAll();
    } catch (err) {
      handleError(err, toast);
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
    fetchRegions,
    clearSelectedRegion,
    getRegionNameById,
  };
});
