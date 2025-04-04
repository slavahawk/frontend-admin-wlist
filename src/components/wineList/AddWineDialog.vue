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
                    :suggestions="candidates._embedded?.adminWineResponseList"
                    @complete="search"
                    optionLabel="name"
                    :loading="loading"
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
                  :grapes="getGrapesNameById(findWine.grapeData)"
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
import {
  getCategoryLabelByValue,
  getColourLabelByValue,
  getSugarTypeLabelByValue,
} from "w-list-api";
import { type PricesWithGlass, type Wine } from "wlist-types";
import FormSelectPrice from "@/components/form/FormSelectPrice.vue";
import { useWineListItemStore } from "@/stores/wineListItemStore.ts";
import { storeToRefs } from "pinia";
import { vintage } from "w-list-utils";
import { WineCard } from "w-list-components";

import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { useRoute } from "vue-router";

const { getCountryNameById } = useCountryStore();
const { getRegionNameById } = useRegionStore();
const { getGrapesNameById } = useGrapeStore();
const { createWineListItem } = useWineListItemStore();

const props = defineProps<{
  show: boolean;
  listId: number;
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
const currentStep = ref("1");
const { getCandidates } = useWineListItemStore();
const { candidates, loading } = storeToRefs(useWineListItemStore());
const route = useRoute();

const search = (event: { query: string }) => {
  getCandidates(+route.params.id, event.query);
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
    wineListId: props.listId,
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
