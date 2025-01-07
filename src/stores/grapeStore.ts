// src/stores/grapeStore.ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import GrapeService from "@/service/GrapeService";
import type { Grape } from "@/types/grape";

export const useGrapeStore = defineStore("grape", () => {
  const grapes = ref<Grape[]>([]);
  const selectedGrape = ref<Grape | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const grapeOptions = computed(() => {
    return grapes.value.map((grape) => ({
      value: grape.id,
      label: grape.name,
    }));
  });

  const fetchGrapes = async () => {
    loading.value = true;
    error.value = null;

    try {
      grapes.value = await GrapeService.getAllGrapes();
    } catch (err) {
      error.value = "Ошибка при получении винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchGrapeById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedGrape.value = await GrapeService.getGrapeById(id);
    } catch (err) {
      error.value = "Ошибка при получении винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
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
    error,
    fetchGrapes,
    fetchGrapeById,
    clearSelectedGrape,
  };
});
