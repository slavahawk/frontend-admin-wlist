// src/stores/wineListItemStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import WineListItemService from "@/service/WineListItemService";
import { type CreateWineList, type WineListItem } from "@/types/wineListItem";

export const useWineListItemStore = defineStore("wineListItems", () => {
  const wineListItems = ref<WineListItem[]>([]);
  const loading = ref(false);
  const selectedWineListItemId = ref<number | null>(null);

  const fetchWineListItems = async () => {
    loading.value = true;
    try {
      wineListItems.value = await WineListItemService.getWineListItems();
    } catch (error) {
      console.error("Error fetching wine list items:", error);
    } finally {
      loading.value = false;
    }
  };

  const fetchWineListItemById = async (id: number) => {
    loading.value = true;
    try {
      const item = await WineListItemService.getWineListItemById(id);
      // handle the item as needed (e.g., set to state, show in dialog)
    } catch (error) {
      console.error("Error fetching wine list item by ID:", error);
    } finally {
      loading.value = false;
    }
  };

  const createWineListItem = async (wineListItem: CreateWineList) => {
    await WineListItemService.createWineListItem(wineListItem);
    await fetchWineListItems(); // Refresh the list after creation
  };

  const deleteWineListItem = async (id: number) => {
    await WineListItemService.deleteWineListItem(id);
    await fetchWineListItems(); // Refresh the list after deletion
  };

  return {
    wineListItems,
    loading,
    selectedWineListItemId,
    fetchWineListItems,
    fetchWineListItemById,
    createWineListItem,
    deleteWineListItem,
  };
});
