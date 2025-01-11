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
        pricePerGlass: wine?.pricePerBottle,
      }"
      @save="saveWine"
    >
    </FormSelectPrice>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import type { Prices, WineListItem } from "w-list-api";
import FormSelectPrice from "@/components/form/FormSelectPrice.vue";

interface Save extends Prices {
  itemId: number;
}

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
  (e: "save", val: Save): void;
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

const saveWine = async (prices: Prices) => {
  if (props.wine) emit("save", { itemId: props.wine?.id, ...prices });
};
</script>

<style scoped></style>
