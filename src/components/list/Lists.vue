<template>
  <DataTable
    v-model:selection="selectList"
    :value="wineLists"
    :loading="loading"
    dataKey="id"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <h4>Список винных карт {{ wineLists.length }}</h4>
        <Button
          class="p-button-primary"
          variant="text"
          icon="pi pi-plus"
          @click="showCreateWineListDialog"
        />
      </div>
    </template>
    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
    <Column field="name" header="Название" />
    <Column field="itemCount" header="Количество вин" />
    <Column header="Ссылка на винную карту">
      <template #body="{ data }">
        <Button
          as="a"
          link
          :href="`https://customer.w-list.ru/${data.shopId}`"
          target="_blank"
          >Ссылка</Button
        >
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <div v-if="!data.isDeleted">
          <Button
            icon="pi pi-pencil"
            variant="text"
            @click="editWineList(data)"
            class="p-button-warning"
          />
          <Button
            icon="pi pi-trash"
            variant="text"
            @click="deleteWineList(data.id)"
            class="p-button-danger"
          />
        </div>
        <div v-else>Удалено</div>
      </template>
    </Column>
  </DataTable>
  <!-- Create Wine List Dialog -->
  <Dialog
    v-model:visible="createDialogVisible"
    modal
    header="Создать винную карту"
  >
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
    modal
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
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useWineListStore } from "@/stores/wineListStore";
import { storeToRefs } from "pinia";

const {
  createWineList: create,
  updateWineList: update,
  deleteWineList: deleteWineL,
  setActiveList,
} = useWineListStore();

const { wineLists, loading, activeWineList } = storeToRefs(useWineListStore());

const createDialogVisible = ref<boolean>(false);
const editDialogVisible = ref<boolean>(false);
const newWineListName = ref<string>("");
const editWineListName = ref<string>("");
const currentEditingWineListId = ref<number | null>(null);
const selectList = ref();

if (activeWineList.value?.id) {
  selectList.value = activeWineList.value;
}

watch(selectList, (newList) => {
  setActiveList(newList.id);
});

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
</script>

<style scoped></style>
