<template>
  <div class="card">
    <DataTable
      :value="wineListItems?._embedded?.[roleWineListItem(user.role)]"
      :loading="loading"
      dataKey="id"
      selectionMode="single"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <h4>Список вин {{ wineListItems?.page.totalElements }}</h4>
            <Button
              icon="pi pi-plus"
              variant="text"
              @click="showCreateDialog = true"
            />
          </div>
          <div class="flex gap-2 items-center">
            <span>Винная карта: {{ activeWineList?.name }}</span>
            <Button
              icon="pi pi-pencil"
              variant="text"
              @click="$router.push({ name: AppRoutes.LIST })"
            />
          </div>
        </div>
      </template>
      <Column>
        <template #body="{ data }">
          {{ vintage(data.wine.vintage) }}
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <div @click="openDetailDialog(data)">
            <div>{{ data.wine.name }}</div>
            <div style="color: var(--primary-color)">
              {{ getCountryNameById(data.wine.countryId) }},
              {{ getRegionNameById(data.wine.regionId) }}
            </div>
          </div>
        </template>
      </Column>
      <Column field="pricePerGlass" sortable class="w-[320px]">
        <template #body="{ data }">
          <WinePrice
            :price-per-glass="data.pricePerGlass"
            :price-per-bottle="data.pricePerBottle"
            :glass-volume="data.wine?.glassVolume"
            :bottle-volume="data.wine.bottleVolume"
          />
        </template>
      </Column>

      <Column>
        <template #body="{ data }">
          <div class="flex">
            <Button
              icon="pi pi-eye"
              variant="text"
              v-tooltip.bottom="`Посмотреть вино`"
              @click="openDetailDialog(data)"
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

    <div v-if="selectedWine">
      <WineEditPrice
        v-model:show="showEditDialog"
        :wine="selectedWine"
        @save="updateWine"
      />
      <WineDetailsDialog
        v-model:show="showDetailDialog"
        :wine="selectedWine.wine"
        :price-per-bottle="selectedWine.pricePerBottle"
        :price-per-glass="selectedWine.pricePerGlass"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWineListItemStore } from "@/stores/wineListItemStore";
import { storeToRefs } from "pinia";
import AddWineDialog from "@/components/wineList/AddWineDialog.vue";
import { useWineListStore } from "@/stores/wineListStore.ts";
import WineDetailsDialog from "@/components/wineListItem/WineDetailsDialog.vue";
import { type WineListItem, roleWineListItem } from "w-list-api";
import { useConfirm } from "primevue";
import { useToast } from "primevue/usetoast";
import WineEditPrice from "@/components/wineListItem/WineEditPrice.vue";
import { vintage } from "@/utils/vintage.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import WinePrice from "@/components/wineListItem/WinePrice.vue";
import { AppRoutes } from "@/router";
import { useAuthStore } from "@/stores/authStore.ts";
const { user } = storeToRefs(useAuthStore());

const confirm = useConfirm();
const toast = useToast();

const { fetchWineListItems, deleteWineListItem, updateWineListItem } =
  useWineListItemStore();
const { wineListItems, loading } = storeToRefs(useWineListItemStore());
const { activeWineList } = storeToRefs(useWineListStore());
const { getCountryNameById } = useCountryStore();
const { getRegionNameById } = useRegionStore();

if (activeWineList.value) fetchWineListItems(activeWineList.value.id);

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showDetailDialog = ref(false);
const selectedWine = ref<WineListItem>();

const openDetailDialog = (wine: WineListItem) => {
  selectedWine.value = wine;
  showDetailDialog.value = true;
};

const editDialog = (wine: WineListItem) => {
  selectedWine.value = wine;
  showEditDialog.value = true;
};

const deleteWine = (wine: WineListItem) => {
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
      await deleteWineListItem(activeWineList.value.id, wine.id);
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
    listId: activeWineList.value.id,
  });

  if (data) {
    showEditDialog.value = false;
  }
};
</script>

<style scoped></style>
