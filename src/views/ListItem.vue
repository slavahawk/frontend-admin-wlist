<template>
  <div class="card">
    <!--    <FilterSection-->
    <!--      v-if="filterState"-->
    <!--      :initialParams="params"-->
    <!--      :filterState="filterState"-->
    <!--      @toggleMenu="() => (filterState = !filterState)"-->
    <!--      @paramsChange="onParamsChange"-->
    <!--    />-->
    <DataTable
      :value="wineListItems?._embedded?.[roleWineListItem(user.role)]"
      :loading="loading"
      dataKey="id"
      selectionMode="single"
      class="tableItems"
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
            <div style="color: var(--p-primary-400)">
              {{ getCountryNameById(data.wine.countryId) }},
              {{ getRegionNameById(data.wine.regionId) }}
            </div>
          </div>
        </template>
      </Column>
      <Column field="pricePerGlass" class="w-[340px]">
        <template #body="{ data }">
          <WinePrice
            class="grid justify-self-start"
            :price-per-glass="data.pricePerGlass"
            :price-per-bottle="data.pricePerBottle"
            :glass-volume="data?.glassVolume"
            :bottle-volume="data.wine.bottleVolume"
          />
        </template>
      </Column>
      <Column field="isHidden">
        <template #body="{ data }">
          <ToggleButton
            :onLabel="'Скрыто'"
            :offLabel="'Раскрыто'"
            :modelValue="data.isHidden"
            @change="toggleWineVisibility(data)"
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
    <Paginator
      v-if="wineListItems?.page"
      :first="params.page * params.size"
      :rows="params.size"
      :totalRecords="wineListItems.page.totalElements"
      @page="onPageChange"
      :rowsPerPageOptions="[20, 50]"
    />

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
import { reactive, ref } from "vue";
import { useWineListItemStore } from "@/stores/wineListItemStore";
import { storeToRefs } from "pinia";
import AddWineDialog from "@/components/wineList/AddWineDialog.vue";
import { useWineListStore } from "@/stores/wineListStore.ts";
import WineDetailsDialog from "@/components/wineListItem/WineDetailsDialog.vue";
import { roleWineListItem, type WineListItem } from "w-list-api";
import { useConfirm } from "primevue";
import { useToast } from "primevue/usetoast";
import WineEditPrice from "@/components/wineListItem/WineEditPrice.vue";
import { vintage } from "w-list-utils";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { WinePrice } from "w-list-components";
import { AppRoutes } from "@/router";
import { useAuthStore } from "@/stores/authStore.ts";
// import FilterSection from "@/components/FilterSection.vue";

const { user } = storeToRefs(useAuthStore());

const confirm = useConfirm();
const toast = useToast();

const { fetchWineListItems, deleteWineListItem, updateWineListItem } =
  useWineListItemStore();
const { wineListItems, loading } = storeToRefs(useWineListItemStore());
const { activeWineList } = storeToRefs(useWineListStore());
const { getCountryNameById } = useCountryStore();
const { getRegionNameById } = useRegionStore();

const params = reactive({
  page: 0,
  size: 20,
  category: undefined,
  colour: undefined,
  sugarType: undefined,
  countryId: undefined,
  regionId: undefined,
  grapeId: undefined,
  vintage: undefined,
  bottleVolume: undefined,
});

// const filterState = ref(true);
//
// const onParamsChange = (newParams) => {
//   Object.assign(params, newParams);
//   fetchWineListItems(activeWineList.value.id, params);
// };

const toggleWineVisibility = async (wine: WineListItem) => {
  const { id, ...rest } = wine; // Деструктурируем wine на id и остальные свойства
  const updatedWine = { ...rest, isHidden: !rest.isHidden }; // Обновляем состояние isHidden
  await updateWine(id, updatedWine); // Передаем id и обновленные данные без id
};

if (activeWineList.value) fetchWineListItems(activeWineList.value.id, params);

const onPageChange = async ({ page, rows }) => {
  params.page = page;
  params.size = rows;
  await fetchWineListItems(activeWineList.value.id, params);
};

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

const updateWine = async ({
  itemId,
  pricePerBottle,
  pricePerGlass,
  glassVolume,
}: any) => {
  const data = await updateWineListItem({
    itemId,
    prices: { pricePerBottle, pricePerGlass, glassVolume },
    listId: activeWineList.value.id,
  });

  if (data) {
    showEditDialog.value = false;
  }
};
</script>

<style lang="scss">
.tableItems {
  .p-datatable-header-cell {
    padding: 0 !important;
    border: none !important;
  }
}
</style>
