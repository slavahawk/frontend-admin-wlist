<template>
  <Dialog
    header="Добавление нового вина"
    v-model:visible="isVisible"
    style="min-width: 50vw"
    modal
  >
    <div class="card">
      <Stepper v-model:value="currentStep" linear>
        <StepList>
          <Step value="1">Выбрать вино</Step>
          <Step value="2">Заполнить данные</Step>
        </StepList>
        <StepPanels>
          <StepPanel value="1">
            <div>
              <div class="flex justify-between items-start">
                <div class="flex flex-col gap-2">
                  <AutoComplete
                    v-model="findWine"
                    :suggestions="items"
                    @complete="search"
                    optionLabel="name"
                    placeholder="Найти вино"
                  >
                    <template #option="{ option }">
                      <div class="flex gap-2 items-center">
                        <Avatar :image="option.tinyImagePath" shape="circle" />
                        <span class="text-l">{{ option.name }}</span>
                      </div>
                    </template>
                  </AutoComplete>
                  <Message size="small" severity="secondary" variant="simple">
                    Чтобы перейти к следующему шагу, нужно выбрать вино из базы
                    данных</Message
                  >
                </div>
                <Button
                  :disabled="!findWine?.id"
                  label="Следующий шаг"
                  icon="pi pi-arrow-right"
                  @click="nextStep"
                />
              </div>

              <div v-if="findWine?.id" class="mt-4">
                <WineCard
                  :img="findWine.originalImagePath"
                  :name="findWine.name"
                  :alcohol-by-volume="findWine.alcoholByVolume"
                  :interesting-facts="findWine.interestingFacts"
                  :organoleptic="findWine.organoleptic"
                  :grapes="getGrapesNameById(findWine.grapeIds)"
                  :vintage="vintage(findWine.vintage)"
                  :sugar-type="getSugarTypeLabelByValue(findWine.sugarType)"
                  :country="getCountryNameById(findWine.countryId)"
                  :category="getCategoryLabelByValue(findWine.category)"
                  :category-id="findWine.category"
                  :colour="getColourLabelByValue(findWine.colour)"
                  :region="getRegionNameById(findWine.regionId)"
                />
              </div>
            </div>
          </StepPanel>
          <StepPanel value="2">
            <FormSelectPrice @save="saveWine">
              <Button
                label="Назад"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="prevStep"
              />
            </FormSelectPrice>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useWineStore } from "@/stores/wineStore.ts";
import {
  getCategoryLabelByValue,
  getColourLabelByValue,
  getSugarTypeLabelByValue,
} from "w-list-api";
import { type PricesWithGlass, roleWineList, type Wine } from "wlist-types";
import FormSelectPrice from "@/components/form/FormSelectPrice.vue";
import { useWineListItemStore } from "@/stores/wineListItemStore.ts";
import { storeToRefs } from "pinia";
import { useWineListStore } from "@/stores/wineListStore.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { vintage } from "w-list-utils";
import { WineCard } from "w-list-components";

import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

const { getCountryNameById } = useCountryStore();
const { getRegionNameById } = useRegionStore();
const { getGrapesNameById } = useGrapeStore();

const { createWineListItem } = useWineListItemStore();

const { activeWineList } = storeToRefs(useWineListStore());

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});

const findWine = ref<string | Wine>("");
const items = ref([]);
const currentStep = ref("1");
const { fetchWinesSearch } = useWineStore();
const { user } = storeToRefs(useAuthStore());

const search = async (event: { query: string }) => {
  const data = await fetchWinesSearch({ name: event.query, page: 0, size: 20 });
  if (data) {
    items.value = data._embedded?.[roleWineList(user.value?.role)];
  }
};

const nextStep = () => {
  currentStep.value = "2";
};

const prevStep = () => {
  currentStep.value = "1";
};

const saveWine = async ({
  pricePerBottle,
  pricePerGlass,
  glassVolume,
  internalComment,
}: PricesWithGlass) => {
  const data = await createWineListItem({
    pricePerBottle,
    pricePerGlass,
    wineId: findWine.value.id,
    wineListId: activeWineList.value?.id,
    glassVolume,
    internalComment,
  });

  if (data) {
    emit("update:show", false);
    findWine.value = "";
    currentStep.value = "1";
  }
};
</script>

<style scoped>
/* Можете добавить стили для основного компонента здесь */
</style>
