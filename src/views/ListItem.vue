<template>
  <div id="qrcode"></div>
  <div class="filter-container">
    <FilterSection
      v-if="filterState"
      :initialParams="params"
      :filterState="filterState"
      @toggleMenu="() => (filterState = !filterState)"
      @paramsChange="onParamsChange"
    />
    <div class="flex-1">
      <DataTable
        :value="wineListItems?._embedded?.[roleWineListItem(user.role)]"
        :loading="loading"
        dataKey="id"
        selectionMode="single"
        class="tableItems"
        tableStyle="min-width: 70rem"
      >
        <template #empty>Нет созданных вин</template>
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center">
              <h4>Список вин {{ wineListItems?.page.totalElements }}</h4>
              <Button
                :icon="`pi ${filterState ? 'pi-filter-slash' : 'pi-filter'}`"
                variant="text"
                @click="filterState = !filterState"
                v-tooltip.bottom="
                  `${filterState ? 'Скрыть' : 'Раскрыть'} фильтры`
                "
              />
              <Button
                icon="pi pi-plus"
                variant="text"
                @click="showCreateDialog = true"
                v-tooltip.bottom="`Добавить вино`"
              />
            </div>
            <div class="flex gap-2 items-center">
              <Button
                v-if="wineListItems?.page.totalElements > 0"
                as="a"
                link
                :href="`https://customer.w-list.ru/${activeWineList.shopId}`"
                target="_blank"
                >Ссылка на винную карту</Button
              >
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

        <Column
          field="pricePerGlass"
          header="Цена за бокал"
          sortable
          class="w-[200px]"
        >
          <template #body="{ data }">
            <WinePriceGlass
              :price-per-glass="data.pricePerGlass"
              :glass-volume="data?.glassVolume"
              @click="openDetailDialog(data)"
            />
          </template>
        </Column>
        <Column
          field="pricePerBottle"
          header="Цена за бутылку"
          sortable
          class="w-[200px]"
        >
          <template #body="{ data }">
            <WinePriceBottle
              :price-per-bottle="data.pricePerBottle"
              :bottle-volume="data.wine.bottleVolume"
              @click="openDetailDialog(data)"
            />
          </template>
        </Column>
        <Column
          field="internalComment"
          header="Комментарий"
          class="w-[200px]"
        />
        <Column>
          <template #body="{ data }">
            <div class="flex">
              <div>
                <Button
                  v-if="data.isHidden"
                  icon="pi pi-eye-slash"
                  variant="text"
                  v-tooltip.bottom="`Скрыто`"
                  @click="toggleWineVisibility(data)"
                />
                <Button
                  v-else
                  icon="pi pi-eye"
                  variant="text"
                  v-tooltip.bottom="`Раскрыто`"
                  @click="toggleWineVisibility(data)"
                />
              </div>
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
          :wine="selectedWine"
        />
      </div>
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
import { WinePriceBottle, WinePriceGlass } from "w-list-components";
import { useAuthStore } from "@/stores/authStore.ts";
import FilterSection from "@/components/FilterSection.vue";

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

const filterState = ref(false);

const onParamsChange = (newParams) => {
  Object.assign(params, newParams);
  fetchWineListItems(activeWineList.value.id, params);
};

const toggleWineVisibility = async (wine: WineListItem) => {
  await updateWineListItem({
    itemId: wine.id,
    dataRequest: {
      pricePerBottle: wine.pricePerBottle,
      pricePerGlass: wine.pricePerGlass,
      glassVolume: wine.glassVolume,
      isHidden: !wine.isHidden,
    },
    listId: activeWineList.value.id,
  });
};

console.log(activeWineList.value);

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
  isHidden,
  internalComment,
}: any) => {
  const data = await updateWineListItem({
    itemId,
    dataRequest: {
      pricePerBottle,
      pricePerGlass,
      glassVolume,
      isHidden,
      internalComment,
    },
    listId: activeWineList.value.id,
  });

  if (data) {
    showEditDialog.value = false;
  }
};
</script>

<style lang="scss"></style>
