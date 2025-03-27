<template>
  <Dialog v-model:visible="isVisible" modal header="Создать винную карту">
    <Stepper v-model:value="currentStep" linear>
      <StepList>
        <Step value="1">Выбрать режим создания</Step>
        <Step value="2">Заполнить данные</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <div class="grid grid-cols-2 gap-2 min-h-[50vh]">
            <Fieldset
              legend="Создать новую"
              class="flex justify-center items-center fieldsetCustom"
              @click="clickCreateNew"
            >
              <i class="pi pi-file-plus" style="font-size: 2rem"></i>
            </Fieldset>
            <Fieldset
              legend="Дублировать готовую"
              class="flex justify-center items-center fieldsetCustom"
              @click="clickCopy"
            >
              <i class="pi pi-clone" style="font-size: 2rem"></i>
            </Fieldset>
          </div>
        </StepPanel>
        <StepPanel value="2">
          <div v-if="mode === 0">
            <div>
              <InputText
                v-model="newWineListName"
                placeholder="Название винной карты"
                aria-label="Название винной карты"
                style="width: 100%"
              />
            </div>
            <div class="flex gap-2 justify-between mt-4">
              <Button
                label="Назад"
                icon="pi pi-arrow-left"
                @click="currentStep = '1'"
                class="p-button-text"
              />
              <Button
                label="Сохранить"
                icon="pi pi-check"
                @click="createWineList"
              />
            </div>
          </div>
          <div v-if="mode === 1">
            <Select
              class="mb-6"
              v-model="selectedWineList"
              :options="wineLists"
              optionLabel="name"
              placeholder="Выбрать готовую"
              style="width: 100%"
            />

            <InputText
              v-model="newWineListName"
              placeholder="Название винной карты"
              aria-label="Название винной карты"
              style="width: 100%"
            />

            <div class="flex gap-2 justify-between mt-4">
              <Button
                label="Назад"
                icon="pi pi-arrow-left"
                @click="currentStep = '1'"
                class="p-button-text"
              />
              <Button
                label="Сохранить"
                icon="pi pi-check"
                @click="copyWineList"
              />
            </div>
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { WineList } from "wlist-types";

const currentStep = ref("1");
const newWineListName = ref<string>("");

const props = defineProps<{
  show: boolean;
  wineLists?: WineList[];
}>();

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
  (e: "submit", val: string): void;
  (e: "copy", body: { wineListId: number; name: string }): void;
}>();

watchEffect(() => {
  if (props.show) {
    currentStep.value = "1";
    newWineListName.value = "";
  }
});

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value: boolean) {
    emit("update:show", value);
  },
});

const createWineList = () => {
  emit("submit", newWineListName.value);
};

const mode = ref<0 | 1>(0);
const clickCreateNew = () => {
  mode.value = 0;
  currentStep.value = "2";
};

const selectedWineList = ref();
const clickCopy = () => {
  mode.value = 1;
  currentStep.value = "2";
};

const copyWineList = () => {
  emit("copy", {
    wineListId: selectedWineList.value.id,
    name: newWineListName.value,
  });
};
</script>

<style scoped lang="scss">
.fieldsetCustom {
  cursor: pointer;
  &:hover {
    background-color: var(--surface-hover);
  }
}
</style>
