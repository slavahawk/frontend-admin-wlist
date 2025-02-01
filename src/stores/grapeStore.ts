import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { GrapeService, type Grape } from "w-list-api";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts";

export const useGrapeStore = defineStore("grape", () => {
  const grapes = ref<Grape[]>([]);
  const selectedGrape = ref<Grape | null>(null);
  const loading = ref(false);
  const toast = useToast();

  const grapeOptions = computed(() =>
    grapes.value.map((grape) => ({
      value: grape.id,
      label: grape.name,
    })),
  );

  const getGrapesNameById = (grapeIds: number[]): string[] => {
    return grapeIds
      .map((id) => grapes.value.find((grape) => grape.id === id)?.name ?? null)
      .filter((name): name is string => name !== null); // Используем "type predicate" для явной типизации
  };

  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const fetchGrapes = async () => {
    setLoading(true);

    try {
      grapes.value = await GrapeService.getAll();
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedGrape = () => {
    selectedGrape.value = null;
  };

  return {
    grapes,
    grapeOptions,
    selectedGrape,
    loading,
    fetchGrapes,
    clearSelectedGrape,
    getGrapesNameById,
  };
});
