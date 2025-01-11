import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  type CreateWineList,
  type WineList,
  WineListService,
} from "w-list-api"; // Путь к сервису управления списками вин

import { SELECT_LIST } from "@/const/localstorage.ts"; // Импортируем интерфейсы из types

export const useWineListStore = defineStore("wineList", () => {
  const wineLists = ref<WineList[]>([]);
  const wineList = ref<WineList | null>(null);
  const selectedWineListId = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  if (localStorage.getItem(SELECT_LIST)) {
    selectedWineListId.value = Number(localStorage.getItem(SELECT_LIST));
  }

  // Функция для получения всех списков вин
  const fetchWineLists = async () => {
    loading.value = true;
    error.value = null;

    try {
      wineLists.value = await WineListService.getAll();
    } catch (err) {
      error.value = "Ошибка при получении списков вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const setWineListId = (id: number) => {
    selectedWineListId.value = id;
    localStorage.setItem(SELECT_LIST, String(id));
  };

  // Функция для получения списка вин по ID
  const fetchWineListById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      wineList.value = await WineListService.getById(id);
    } catch (err) {
      error.value = "Ошибка при получении списка вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Функция для обновления списка вин
  const updateWineList = async (id: number, wineListData: CreateWineList) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedWineList = await WineListService.update(id, wineListData);
      const index = wineLists.value.findIndex((list) => list.id === id);
      if (index !== -1) {
        wineLists.value[index] = updatedWineList;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении списка вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Функция для удаления списка вин
  const deleteWineList = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await WineListService.delete(id);
      wineLists.value = wineLists.value.filter((list) => list.id !== id);
    } catch (err) {
      error.value = "Ошибка при удалении списка вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Функция для создания нового списка вин
  const createWineList = async (wineListData: Request) => {
    loading.value = true;
    error.value = null;

    try {
      const newWineList = await WineListService.create(wineListData);
      wineLists.value.push(newWineList);
      return newWineList;
    } catch (err) {
      error.value = "Ошибка при создании списка вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Функция для очистки выбранного списка вин
  const clearSelectedWineList = () => {
    wineList.value = null;
  };

  const isSelectedWineList = computed(() => !!selectedWineListId.value);

  return {
    wineLists,
    wineList,
    loading,
    error,
    fetchWineLists,
    fetchWineListById,
    updateWineList,
    deleteWineList,
    createWineList,
    clearSelectedWineList,
    setWineListId,
    selectedWineListId,
    isSelectedWineList,
  };
});
