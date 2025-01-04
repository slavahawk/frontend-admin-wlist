<template>
  <div>
    <h1>Список вин</h1>
    <Button label="Добавить вино" icon="pi pi-plus" @click="showModal = true" />

    <DataTable
      :value="wineListItems"
      :loading="loading"
      dataKey="id"
      selectionMode="single"
    >
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Название" sortable />
      <Column field="year" header="Год" sortable />
      <Column body="actionTemplate" header="Действия">
        <template #body="{ data }">
          <Button
            label="Удалить"
            icon="pi pi-trash"
            @click="deleteWineListItem(data.id)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      header="Добавление нового вина"
      v-model:visible="showModal"
      @hide="showModal = false"
      modal
    >
      <form @submit.prevent="addWine">
        <div class="p-field">
          <label for="name">Название:</label>
          <InputText id="name" v-model="newWine.name" required />
        </div>
        <div class="p-field">
          <label for="year">Год:</label>
          <InputText id="year" v-model="newWine.year" type="number" required />
        </div>
        <div class="p-dialog-footer">
          <Button label="Добавить" icon="pi pi-check" type="submit" />
          <Button
            label="Отмена"
            icon="pi pi-times"
            @click="showModal = false"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWineListItemStore } from "@/stores/wineListItemStore";
import { storeToRefs } from "pinia";

const {
  createWineListItem,
  deleteWineListItem: deleteList,
  fetchWineListItems,
} = useWineListItemStore();
const { wineListItems, loading } = storeToRefs(useWineListItemStore());
const showModal = ref(false);
const newWine = ref({ name: "", year: 2021 });

const addWine = async () => {
  await createWineListItem({ wineListId: 0, wineId: 1, pricePerBottle: 100 });
  newWine.value = { name: "", year: 2021 }; // Сбросить поля после добавления
  showModal.value = false;
  await fetchWineListItems(); // Обновить список
};

const deleteWineListItem = async (id: number) => {
  await deleteList(id);
  await fetchWineListItems(); // Обновить список после удаления
};

fetchWineListItems();
</script>

<style scoped>
.p-dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
