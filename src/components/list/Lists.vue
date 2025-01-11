<template>
  <div class="wine-list-container">
    <div class="mb-4 flex gap-4 items-center">
      <h2 class="text-2xl">Список винных карт</h2>

      <Button
        class="p-button-primary"
        variant="text"
        icon="pi pi-plus"
        @click="showCreateWineListDialog"
      />
    </div>

    <div v-if="!loading && wineLists.length === 0" class="empty-state">
      <p>Список винных карт пуст. Добавьте новую винную карту.</p>
    </div>

    <div v-if="loading" class="wine-list-grid mt-12">
      <Skeleton
        width="320px"
        height="160px"
        borderRadius="16px"
        v-for="item in items"
      />
    </div>

    <div class="wine-list-grid mt-12" v-else>
      <WineListCard
        class="w-[320px] h-[160px]"
        v-for="w in wineLists"
        :key="w.id"
        :id="w.id"
        :name="w.name"
        :createdAt="w.createdAt"
        :winesCount="w.itemCount"
        :isActive="w.id === selectedWineListId"
        @select="setActiveWineListId"
        @edit="editWineList(w)"
        @delete="deleteWineList"
      />
    </div>
    <div v-if="wineLists.length" class="mt-4">
      <Button
        label="Дальше"
        @click="$router.push({ name: AppRoutes.LIST_ITEM })"
      />
    </div>

    <!-- Create Wine List Dialog -->
    <Dialog v-model:visible="createDialogVisible" header="Создать винную карту">
      <div>
        <InputText
          v-model="newWineListName"
          placeholder="Название винной карты"
          aria-label="Название винной карты"
          style="width: 100%"
        />
      </div>
      <div class="flex gap-2 justify-between mt-4">
        <Button label="Сохранить" icon="pi pi-check" @click="createWineList" />
        <Button
          label="Отмена"
          icon="pi pi-times"
          @click="() => (createDialogVisible = false)"
          class="p-button-text"
        />
      </div>
    </Dialog>

    <!-- Edit Wine List Dialog -->
    <Dialog
      v-model:visible="editDialogVisible"
      header="Редактировать винную карту"
    >
      <div>
        <InputText
          v-model="editWineListName"
          placeholder="Название винной карты"
          aria-label="Название винной карты"
          style="width: 100%"
        />
      </div>
      <div class="flex gap-2 justify-between mt-4">
        <Button label="Сохранить" icon="pi pi-check" @click="updateWineList" />
        <Button
          label="Отмена"
          icon="pi pi-times"
          @click="() => (editDialogVisible = false)"
          class="p-button-text"
        />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useWineListStore } from "@/stores/wineListStore";
import { storeToRefs } from "pinia";
import WineListCard from "@/components/wineList/WineListCard.vue";
import { AppRoutes } from "@/router";

const {
  fetchWineLists,
  createWineList: create,
  updateWineList: update,
  deleteWineList: deleteWineL,
  setWineListId,
} = useWineListStore();

const { wineLists, loading, selectedWineListId } =
  storeToRefs(useWineListStore());

const createDialogVisible = ref<boolean>(false);
const editDialogVisible = ref<boolean>(false);
const newWineListName = ref<string>("");
const editWineListName = ref<string>("");
const currentEditingWineListId = ref<number | null>(null);

// Fetch wine lists on component mount
fetchWineLists();

const showCreateWineListDialog = () => {
  newWineListName.value = ""; // Reset the new list name
  createDialogVisible.value = true;
};

const createWineList = async () => {
  if (newWineListName.value.trim()) {
    await create({ name: newWineListName.value });
    newWineListName.value = "";
    createDialogVisible.value = false;
  }
};

const setActiveWineListId = (id: number) => {
  setWineListId(id);
};

// Show the edit dialog with the current wine list's name
const editWineList = (wineList) => {
  editWineListName.value = wineList.name;
  currentEditingWineListId.value = wineList.id;
  editDialogVisible.value = true;
};

// Update the wine list
const updateWineList = async () => {
  if (
    currentEditingWineListId.value !== null &&
    editWineListName.value.trim()
  ) {
    await update(currentEditingWineListId.value, {
      name: editWineListName.value,
    });
    editWineListName.value = ""; // Reset the name
    editDialogVisible.value = false; // Close the dialog
  }
};

const deleteWineList = async (id: number) => {
  await deleteWineL(id);
};

const items = computed(() => wineLists.value.length ?? 1);
</script>

<style scoped>
.wine-list-container {
  padding: 2rem;
}

.wine-list-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}
</style>
