<template>
  <div>
    <DataTable
      :value="wineListItems?._embedded?.rootWineListItemResponseList"
      :loading="loading"
      dataKey="id"
      selectionMode="single"
    >
      <template #header>
        <div class="flex gap-2 items-center">
          <h1 class="text-2xl">
            Список вин {{ wineListItems?.page.totalElements }}
          </h1>
          <Button
            icon="pi pi-plus"
            variant="text"
            @click="showCreateDialog = true"
          />
        </div>
      </template>
      <Column header="Вино">
        <template #body="{ data }">
          {{ data.wine.name }}
        </template>
      </Column>
      <Column header="Обложка">
        <template #body="{ data }">
          <Avatar
            :image="data.wine.tinyImagePath"
            alt="Wine Image"
            class="wine-image"
          />
        </template>
      </Column>
      <Column field="pricePerGlass" header="Цена за бокал" sortable> </Column>
      <Column field="pricePerBottle" header="Цена за бутылку" sortable>
      </Column>

      <Column header="Действия">
        <template #body="{ data }">
          <div class="flex">
            <Button
              icon="pi pi-eye"
              variant="text"
              v-tooltip.bottom="`Посмотреть вино`"
              @click="openDetailDialog(data.wine)"
            />
            <Button
              icon="pi pi-pencil"
              variant="text"
              @click="editDialog(data)"
              v-tooltip.bottom="`Редактировать вино`"
            />
            <Button
              icon="pi pi-trash"
              variant="text"
              class="p-button-danger"
              v-tooltip.bottom="`Удалить вино`"
              @click="deleteWine(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <AddWineDialog v-model:show="showCreateDialog" />
    <WineEditPrice
      v-model:show="showEditDialog"
      :wine="selectedWine"
      @save="updateWine"
    />
    <WineDetailsDialog v-model:show="showDetailDialog" :wine="selectedWine" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWineListItemStore } from "@/stores/wineListItemStore";
import { storeToRefs } from "pinia";
import AddWineDialog from "@/components/wineList/AddWineDialog.vue";
import { useWineListStore } from "@/stores/wineListStore.ts";
import Avatar from "primevue/avatar";
import WineDetailsDialog from "@/components/wineListItem/WineDetailsDialog.vue";
import type { Wine } from "w-list-api";
import { useConfirm } from "primevue";
import { useToast } from "primevue/usetoast";
import WineEditPrice from "@/components/wineListItem/WineEditPrice.vue";

const confirm = useConfirm();
const toast = useToast();

const { fetchWineListItems, deleteWineListItem, updateWineListItem } =
  useWineListItemStore();
const { wineListItems, loading } = storeToRefs(useWineListItemStore());
const { selectedWineListId } = storeToRefs(useWineListStore());

if (selectedWineListId.value) fetchWineListItems(selectedWineListId.value);

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showDetailDialog = ref(false);
const selectedWine = ref<Wine | null>(null);

const openDetailDialog = (wine: Wine) => {
  selectedWine.value = wine;
  showDetailDialog.value = true;
};

const editDialog = (wine: Wine) => {
  selectedWine.value = wine;
  showEditDialog.value = true;
};

const deleteWine = (wine: any) => {
  confirm.require({
    message: "Вы уверены, что хотите удалить вино?",
    header: "Удалить вино",
    icon: "pi pi-info-circle",
    rejectLabel: "Отменить",
    rejectProps: {
      label: "Назад",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Удалить",
      severity: "danger",
    },
    accept: async () => {
      await deleteWineListItem(selectedWineListId.value, wine.id);
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};

const updateWine = async ({ itemId, pricePerBottle, pricePerGlass }: any) => {
  const data = await updateWineListItem({
    itemId,
    prices: { pricePerBottle, pricePerGlass },
    listId: selectedWineListId.value,
  });

  if (data) {
    showEditDialog.value = false;
  }
};
</script>

<style scoped></style>
