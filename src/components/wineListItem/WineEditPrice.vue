<template>
  <Dialog
    v-model:visible="isVisible"
    header="Редактировать прайс"
    modal
    style="min-width: 60%"
  >
    <FormSelectPrice
      :prices="{
        pricePerBottle: wine?.pricePerBottle,
        pricePerGlass: wine?.pricePerGlass,
        glassVolume: wine?.wine?.glassVolume,
      }"
      @save="saveWine"
    >
    </FormSelectPrice>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { PricesWithGlass, WineListItem } from "w-list-api";
import FormSelectPrice from "@/components/form/FormSelectPrice.vue";

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
  (e: "save", val: any): void;
}>();

const props = defineProps<{
  show: boolean;
  wine: WineListItem | null; // Определите более точный тип для объекта вина
}>();

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});

const saveWine = async (prices: PricesWithGlass) => {
  if (props.wine)
    emit("save", {
      itemId: props.wine?.id,
      ...prices,
      isHidden: props.wine.isHidden,
    });
};
</script>

<style scoped></style>
