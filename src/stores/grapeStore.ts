import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { GrapeService } from "w-list-api";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts";
import { type Grape, type GrapeData } from "wlist-types";
import { checkData } from "w-list-utils";

export const useGrapeStore = defineStore("grape", () => {
  const grapes = ref<Grape[]>([]);
  const loading = ref(false);
  const toast = useToast();

  const grapeOptions = computed(() =>
    grapes.value.map((grape) => ({
      value: grape.id,
      label: grape.name,
    })),
  );

  const getGrapesNameById = (grapeData: GrapeData[]): string[] => {
    return grapeData
      .map(
        (grapeD) =>
          grapes.value.find((g: Grape) => g.id === grapeD.grapeId)?.name ??
          null,
      )
      .filter((name) => name !== null);
  };

  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const fetchGrapes = async () => {
    setLoading(true);

    try {
      const data = await GrapeService.getAll();
      checkData(data);
      grapes.value = data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  return {
    grapes,
    grapeOptions,
    loading,
    fetchGrapes,
    getGrapesNameById,
  };
});
