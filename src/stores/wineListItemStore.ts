import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import {
  type CreateWineList,
  roleWineListItem,
  type UpdateWineListItem,
  type WineListItem,
  type WineListItemRequest,
  type WineListItemResponses,
  WineListItemService,
} from "w-list-api";
import { useAuthStore } from "@/stores/authStore.ts";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";

export const useWineListItemStore = defineStore("wineListItems", () => {
  const wineListItems = ref<WineListItemResponses>({
    page: {
      number: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
    },
    _embedded: {},
  });
  const candidates = ref<WineListItem[]>([]);
  const loading = ref(false);
  const { user } = storeToRefs(useAuthStore());
  const toast = useToast();

  // Utility function to handle loading state
  const executeWithLoading = async (callback: () => Promise<any>) => {
    loading.value = true;
    try {
      return await callback();
    } catch (error) {
      handleError(error, toast);
    } finally {
      loading.value = false;
    }
  };

  // Fetch all wine list items
  const fetchWineListItems = (listId: number, params: WineListItemRequest) => {
    return executeWithLoading(() =>
      WineListItemService.getAll(listId, params).then((data) => {
        wineListItems.value = data;
      }),
    );
  };

  // Fetch a wine list item by ID
  const fetchWineListItemById = (listId: number, id: number) => {
    return executeWithLoading(() => WineListItemService.getById(listId, id));
  };

  // Create a new wine list item
  const createWineListItem = (wineListItem: CreateWineList) => {
    return executeWithLoading(() =>
      WineListItemService.create(wineListItem).then((data) => {
        if (data) addWineListItem(data);
        return data;
      }),
    );
  };

  // Add new item to the list
  const addWineListItem = (item: any) => {
    if (!wineListItems.value.page.totalPages) {
      wineListItems.value._embedded = {
        [roleWineListItem(user.value.role)]: [item],
      };
    } else {
      wineListItems.value._embedded?.[
        roleWineListItem(user.value.role)
      ].unshift(item);
    }

    wineListItems.value.page.totalElements++;
  };

  // Add new item to the list
  const getCandidates = async (listId: number, name: string) => {
    loading.value = true;
    try {
      const data = await WineListItemService.getCandidates(listId, name);
      candidates.value = data;
      return data;
    } catch (error) {
      handleError(error, toast);
    } finally {
      loading.value = false;
    }
  };

  // Update an existing wine list item
  const updateWineListItem = ({
    listId,
    itemId,
    dataRequest,
  }: {
    listId: number;
    itemId: number;
    dataRequest: UpdateWineListItem;
  }) => {
    return executeWithLoading(async () => {
      const data = await WineListItemService.update(
        listId,
        itemId,
        dataRequest,
      );
      if (data) {
        const items =
          wineListItems.value._embedded[roleWineListItem(user.value?.role)];
        const index = items.findIndex((w) => w.id === itemId);
        if (index > -1) {
          items.splice(index, 1, data);
        }
        return data;
      }
    });
  };

  // Delete a wine list item
  const deleteWineListItem = (listId: number, itemId: number) => {
    return executeWithLoading(async () => {
      await WineListItemService.delete(listId, itemId);
      removeWineListItem(itemId);
    });
  };

  // Remove item from the list
  const removeWineListItem = (itemId: number) => {
    const items =
      wineListItems.value._embedded[roleWineListItem(user.value?.role)];
    const index = items.findIndex((w) => w.id === itemId);
    if (index > -1) {
      wineListItems.value.page.totalElements--;
      items.splice(index, 1);
    }
  };

  return {
    wineListItems,
    loading,
    fetchWineListItems,
    fetchWineListItemById,
    createWineListItem,
    deleteWineListItem,
    updateWineListItem,
    candidates,
    getCandidates,
  };
});
