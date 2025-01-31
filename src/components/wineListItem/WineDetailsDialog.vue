<template>
  <Drawer v-model:visible="isVisible" header=" " position="full">
    <WineCard
      v-if="wine"
      :img="wine.originalImagePath"
      :name="wine.name"
      :alcohol-by-volume="wine.alcoholByVolume"
      :interesting-facts="wine.interestingFacts"
      :organoleptic="wine.organoleptic"
      :vintage="vintage(wine.vintage)"
      :grapes="getGrapesNameById(wine.grapeIds)"
      :sugar-type="getSugarTypeLabelByValue(wine.sugarType)"
      :country="getCountryNameById(wine.countryId)"
      :category="getCategoryLabelByValue(wine.category)"
      :colour="getColourLabelByValue(wine.colour)"
      :region="getRegionNameById(wine.regionId)"
    >
      <p class="mb-4 flex gap-2 items-center">
        <WinePriceGlass
          :price-per-glass="wine.pricePerGlass"
          :glass-volume="wine?.glassVolume"
        />
        <WinePriceBottle
          :price-per-bottle="wine.pricePerBottle"
          :bottle-volume="wine.wine.bottleVolume"
        />
      </p>
    </WineCard>
  </Drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { WineCard, WinePriceBottle, WinePriceGlass } from "w-list-components";
import { vintage } from "w-list-utils";

import {
  getCategoryLabelByValue,
  getColourLabelByValue,
  getSugarTypeLabelByValue,
  type Wine,
} from "w-list-api"; // Импортируйте тип Wine, если это необходимо
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

const { getCountryNameById } = useCountryStore();
const { getRegionNameById } = useRegionStore();
const { getGrapesNameById } = useGrapeStore();

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
}>();

const props = defineProps<{
  show: boolean;
  wine: Wine | null;
  pricePerGlass?: number;
  pricePerBottle: number;
}>();

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});
</script>

<style scoped></style>
