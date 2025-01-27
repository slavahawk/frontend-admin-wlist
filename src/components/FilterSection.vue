<template>
  <div class="filter">
    <div class="flex items-center justify-between mb-4">
      <div class="text-2xl">Фильтры</div>
      <Button
        :icon="`pi ${filterState ? 'pi-filter-slash' : 'pi-filter'}`"
        variant="text"
        @click="$emit('toggleMenu')"
        v-tooltip.bottom="`${filterState ? 'Скрыть' : 'Раскрыть'} фильтры`"
      />
      <Button
        label="Сбросить фильтры"
        icon="pi pi-times"
        size="small"
        variant="text"
        @click="resetFilters"
      />
    </div>
    <div>
      <FilterSelect
        label="Категории"
        v-model="localParams.category"
        :options="categoryOptions"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Цвет"
        v-model="localParams.colour"
        :options="colourOptions"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Уровень сахара"
        v-model="localParams.sugarType"
        :options="sugarTypesOptions"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Страна"
        v-model="localParams.countryId"
        :options="countriesOptions"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Регион"
        v-model="localParams.regionId"
        :options="regionOptions"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Виноград"
        v-model="localParams.grapeId"
        :options="grapeOptions"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Год урожая"
        v-model="localParams.vintage"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Объем бутылки"
        v-model="localParams.bottleVolume"
        :options="bottleVolumeOptions"
        @change="emitParamsChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import FilterSelect from "./FilterSelect.vue";
import type {
  categoryOptions,
  colourOptions,
  bottleVolumeOptions,
  sugarTypesOptions,
} from "w-list-api";
import { storeToRefs } from "pinia";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";

const { grapeOptions } = storeToRefs(useGrapeStore());
const { countriesOptions } = storeToRefs(useCountryStore());
const { regionOptions } = storeToRefs(useRegionStore());

const props = defineProps<{
  initialParams: object;
  filterState: boolean;
}>();

const emit = defineEmits(["reset", "paramsChange", "toggleMenu"]);

// Создаем локальный параметр на основе начального параметра
const localParams = reactive({ ...props.initialParams });

// Эмитим изменение параметров
const emitParamsChange = () => {
  emit("paramsChange", localParams); // Эмитим измененные параметры
};

const resetFilters = () => {
  Object.keys(localParams).forEach((key) => {
    localParams[key] = undefined;
  });
  emit("reset");
};
</script>
