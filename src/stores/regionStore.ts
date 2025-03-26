import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { RegionService } from "w-list-api";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";
import { type Region } from "wlist-types";
import { checkData } from "w-list-utils";

export const useRegionStore = defineStore("region", () => {
  const regions = ref<Region[]>([]);
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
      const data = await RegionService.getAll();
      checkData(data);
      regions.value = data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  return {
    regions,
    regionOptions,
    loading,
    fetchRegions,
    getRegionNameById,
  };
});
