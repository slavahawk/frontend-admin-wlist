import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  type CreateWineList,
  type WineList,
  WineListService,
  ActiveWineListService,
} from "w-list-api";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts"; // Пути к сервису управления списками вин

export const useWineListStore = defineStore("wineList", () => {
  const wineLists = ref<WineList[]>([]);
  const wineList = ref<WineList | null>(null);
  const loading = ref(false);
  const toast = useToast();

  // Utility function to handle API calls with loading state
  const executeWithLoading = async (callback: () => Promise<any>) => {
    loading.value = true;
    try {
      return await callback();
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  const setActiveList = async (id: number) => {
    return executeWithLoading(async () => {
      const data = await ActiveWineListService.setActiveList(id);
      const index = wineLists.value.findIndex(
        (w: WineList) => w.id === data.id,
      );
      if (index > -1) {
        wineLists.value[index] = data; // Обновление элемента
      }
      return data;
    });
  };

  // Функция для получения всех списков вин
  const fetchWineLists = () => {
    return executeWithLoading(async () => {
      wineLists.value = await WineListService.getAll();
    });
  };

  const activeWineList = computed(() =>
    wineLists.value.find((w: WineList) => w.isActive),
  );

  // Функция для получения списка вин по ID
  const fetchWineListById = async (id: number) => {
    return executeWithLoading(async () => {
      wineList.value = await WineListService.getById(id);
    });
  };

  // Функция для обновления списка вин
  const updateWineList = async (id: number, wineListData: CreateWineList) => {
    return executeWithLoading(async () => {
      const updatedWineList = await WineListService.update(id, wineListData);
      const index = wineLists.value.findIndex((list) => list.id === id);
      if (index > -1) {
        wineLists.value[index] = updatedWineList; // Обновление элемента
      }
      return updatedWineList;
    });
  };

  // Функция для удаления списка вин
  const deleteWineList = async (id: number) => {
    return executeWithLoading(async () => {
      await WineListService.delete(id);
      wineLists.value = wineLists.value.filter((list) => list.id !== id);
    });
  };

  // Функция для создания нового списка вин
  const createWineList = async (wineListData: CreateWineList) => {
    return executeWithLoading(async () => {
      const newWineList = await WineListService.create(wineListData);
      wineLists.value.push(newWineList);
      return newWineList;
    });
  };

  // Функция для очистки выбранного списка вин
  const clearSelectedWineList = () => {
    wineList.value = null;
  };

  const isSelectedWineList = computed(() => !!activeWineList.value);

  return {
    wineLists,
    wineList,
    loading,
    fetchWineLists,
    fetchWineListById,
    updateWineList,
    deleteWineList,
    createWineList,
    clearSelectedWineList,
    isSelectedWineList,
    setActiveList,
    activeWineList,
  };
});
