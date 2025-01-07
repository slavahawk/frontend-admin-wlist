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
                <WineDetailCard :wine="findWine" />
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
import { defineProps, defineEmits } from "vue";
import { useWineStore } from "@/stores/wineStore.ts";
import WineDetailCard from "./WineDetailCard.vue"; // Импортируйте ваш новый компонент
import type { Wine } from "@/types/wine.ts";
import FormSelectPrice from "@/components/form/FormSelectPrice.vue";
import type { Prices } from "@/types/wineListItem.ts";
import { useWineListItemStore } from "@/stores/wineListItemStore.ts";
import { storeToRefs } from "pinia";
import { useWineListStore } from "@/stores/wineListStore.ts";

const { createWineListItem } = useWineListItemStore();

const { selectedWineListId } = storeToRefs(useWineListStore());

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

const search = async (event: { query: string }) => {
  const data = await fetchWinesSearch({ name: event.query, page: 0, size: 20 });
  if (data) {
    items.value = data._embedded.rootWineResponseList;
  }
};

const nextStep = () => {
  currentStep.value = "2";
};

const prevStep = () => {
  currentStep.value = "1";
};

const saveWine = async ({ pricePerBottle, pricePerGlass }: Prices) => {
  console.log(selectedWineListId.value, findWine.value, {
    pricePerBottle,
    pricePerGlass,
    wineId: findWine.value.id,
    wineListId: selectedWineListId.value,
  });
  const data = await createWineListItem({
    pricePerBottle,
    pricePerGlass,
    wineId: findWine.value.id,
    wineListId: selectedWineListId.value,
  });

  console.log(data);

  if (data) {
    emit("update:show", false);
  }
};
</script>

<style scoped>
/* Можете добавить стили для основного компонента здесь */
</style>
