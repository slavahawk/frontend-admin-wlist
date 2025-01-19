<template>
  <div class="wine-detail" v-if="wine">
    <img :src="wine.originalImagePath" alt="Wine Image" class="wine-image" />
    <div class="wine-info">
      <h3 class="text-xl mb-4">{{ wine.name }}</h3>
      <p class="mb-4" style="color: var(--primary-color)">
        {{ getCountryNameById(wine.countryId) }},
        {{ getRegionNameById(wine.regionId) }}
      </p>
      <p class="mb-4">{{ wine.interestingFacts }}</p>

      <slot />
      <p class="mb-4">
        <strong>Год урожая:</strong> {{ vintage(wine.vintage) }}
      </p>

      <p class="mb-4">
        <strong>Категория:</strong>
        {{ getCategoryLabelByValue(wine.category) }}
      </p>
      <p class="mb-4">
        <strong>Цвет:</strong> {{ getColourLabelByValue(wine.colour) }}
      </p>
      <p class="mb-4">
        <strong>Алкогольное содержание:</strong>
        {{ wine.alcoholByVolume }} %
      </p>
      <p class="mb-4">
        <strong>Уровень сахара:</strong>
        {{ getSugarTypeLabelByValue(wine.sugarType) }}
      </p>
      <p>
        <strong>Органолептические характеристики:</strong>
        {{ wine.organoleptic }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getCategoryLabelByValue,
  getColourLabelByValue,
  getSugarTypeLabelByValue,
  type Wine,
} from "w-list-api"; // Импортируйте тип Wine, если это необходимо
import { vintage } from "@/utils/vintage.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";

const { getCountryNameById } = useCountryStore();
const { getRegionNameById } = useRegionStore();

defineProps<{
  wine: Wine;
}>();
</script>

<style scoped>
.wine-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  position: relative;
}

.wine-image {
  position: sticky;
  top: 0;
  margin: 0 auto;
  max-height: calc(100vh - 200px);
}
</style>
