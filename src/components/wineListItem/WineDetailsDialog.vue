<template>
  <Drawer
    v-model:visible="isVisible"
    header=" "
    position="full"
    class="drawerCustom"
  >
    <WineCard
      class="max-h-full"
      v-if="wine"
      :img="wine.wine.originalImagePath"
      :name="wine.wine.name"
      :alcohol-by-volume="wine.wine.alcoholByVolume"
      :interesting-facts="wine.wine.interestingFacts"
      :organoleptic="wine.wine.organoleptic"
      :vintage="vintage(wine.wine.vintage)"
      :grapes="getGrapesNameById(wine.wine.grapeIds)"
      :sugar-type="getSugarTypeLabelByValue(wine.wine.sugarType)"
      :country="getCountryNameById(wine.wine.countryId)"
      :category="getCategoryLabelByValue(wine.wine.category)"
      :colour="getColourLabelByValue(wine.wine.colour)"
      :region="getRegionNameById(wine.wine.regionId)"
    >
      <p class="mb-4 flex gap-2 items-center">
        <WinePriceGlass
          :price-per-glass="wine.pricePerGlass"
          :glass-volume="wine.glassVolume"
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
  type WineListItem,
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
  wine: WineListItem | null;
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

<style lang="scss">
.drawerCustom {
  .p-drawer-header {
    padding: 0.5rem 1.25rem !important;
    button {
      background: white !important;
    }
  }

  .p-drawer-content {
    overflow: hidden !important;
    padding: 0 0 var(--p-overlay-modal-padding) 0 !important;
  }
}
</style>
