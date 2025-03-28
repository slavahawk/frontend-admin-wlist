import { ref } from "vue";
import { defineStore } from "pinia";
import { ActiveWineListService, WineListService } from "w-list-api";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts"; // Пути к сервису управления списками вин
import { type CreateWineList, type WineList } from "wlist-types";
import { checkData } from "w-list-utils";

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
    loading.value = true;
    try {
      const data = await ActiveWineListService.setActiveList(id);
      checkData(data);
      const index = wineLists.value.findIndex(
        (w: WineList) => w.id === data.id,
      );
      if (index > -1) {
        wineLists.value.forEach((wineList, i) => {
          if (i !== index) {
            wineList.isActive = false; // Делаем неактивными все остальные списки
          }
        });
        wineLists.value[index] = data; // Обновление элемента
      }

      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  // Функция для получения всех списков вин
  const fetchWineLists = () => {
    return executeWithLoading(async () => {
      wineLists.value = await WineListService.getAll();
    });
  };

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
      checkData(updatedWineList);
      const index = wineLists.value.findIndex((list) => list.id === id);
      if (index > -1) {
        wineLists.value[index] = updatedWineList; // Обновление элемента
      }
      return updatedWineList;
    });
  };

  // Функция для удаления списка вин
  const deleteWineList = async (id: number) => {
    loading.value = true;
    try {
      await WineListService.delete(id);
      const updatedWineLists = wineLists.value.find((list) => list.id === id);

      if (updatedWineLists) {
        updatedWineLists.isDeleted = true;
      }
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  // Функция для удаления списка вин
  const cloneWineList = async (body: { wineListId: number; name: string }) => {
    loading.value = true;
    try {
      const data = await WineListService.clone(body);
      checkData(data);
      wineLists.value.unshift(data);
      toast.add({ severity: "success", summary: "Создан дубликат карты" });
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  // Функция для создания нового списка вин
  const createWineList = async (wineListData: CreateWineList) => {
    loading.value = true;
    try {
      const data = await WineListService.create(wineListData);
      checkData(data);
      wineLists.value.unshift(data);
      toast.add({ severity: "success", summary: "Создана новая карта" });
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  const saveImage = async (id: number, image: File) => {
    loading.value = true;
    try {
      const data = await WineListService.uploadImage(id, image);
      checkData(data);
      const index = wineLists.value.findIndex((list) => list.id === id);
      if (index > -1) {
        wineLists.value[index] = data; // Обновление элемента

        toast.add({ severity: "success", summary: "Титульный лист обновлен" });
        return data;
      }
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  // Функция для очистки выбранного списка вин
  const clearSelectedWineList = () => {
    wineList.value = null;
  };

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
    setActiveList,
    saveImage,
    cloneWineList,
  };
});
