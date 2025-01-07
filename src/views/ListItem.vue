<template>
  <div>
    <DataTable
      :value="wineListItems?._embedded?.rootWineResponseList"
      :loading="loading"
      dataKey="id"
      selectionMode="single"
    >
      <template #header>
        <div class="flex gap-2 items-center">
          <h1 class="text-2xl">Список вин</h1>
          <Button icon="pi pi-plus" variant="text" @click="showModal = true" />
        </div>
      </template>
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Название" sortable />
      <Column field="year" header="Год" sortable />
      <Column body="actionTemplate" header="Действия">
        <template #body="{ data }">
          <!-- Здесь ваши кнопки действий -->
        </template>
      </Column>
    </DataTable>

    <AddWineDialog v-model:show="showModal" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWineListItemStore } from "@/stores/wineListItemStore";
import { storeToRefs } from "pinia";
import AddWineDialog from "@/components/wineList/AddWineDialog.vue";
import { useWineListStore } from "@/stores/wineListStore.ts";

const { fetchWineListItems } = useWineListItemStore();
const { wineListItems, loading } = storeToRefs(useWineListItemStore());
const { selectedWineListId } = storeToRefs(useWineListStore());
const showModal = ref(false);

if (selectedWineListId.value) fetchWineListItems(selectedWineListId.value);
</script>

<style scoped></style>
