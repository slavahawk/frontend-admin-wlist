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
      <div class="input-container">
        <div class="text-l">Категории</div>
        <Select
          v-model="localParams.category"
          :options="categoryOptions"
          option-label="label"
          option-value="value"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Цвет</div>
        <Select
          v-model="localParams.colour"
          :options="colourOptions"
          option-label="label"
          option-value="value"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Уровень сахара</div>
        <Select
          v-model="localParams.sugarType"
          :options="sugarTypesOptions"
          option-label="label"
          option-value="value"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Страна</div>
        <Select
          v-model="localParams.countryId"
          :options="countriesOptions"
          option-label="label"
          option-value="value"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Регион</div>
        <Select
          v-model="localParams.regionId"
          :options="regionOptions"
          option-label="label"
          option-value="value"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Виноград</div>
        <Select
          v-model="localParams.grapeId"
          :options="grapeOptions"
          option-label="label"
          option-value="value"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>

      <!--      <FilterSelect-->
      <!--        label="Год урожая"-->
      <!--        v-model="localParams.vintage"-->
      <!--        @change="emitParamsChange"-->
      <!--      />-->

      <div class="input-container">
        <div class="text-l">Объем бутылк</div>
        <Select
          v-model="localParams.bottleVolume"
          :options="bottleVolumeOptions"
          option-label="name"
          option-value="id"
          showClear
          filter
          placeholder="Выберите"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import {
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

watch(localParams, (val) => {
  emit("paramsChange", val);
});

const resetFilters = () => {
  Object.keys(localParams).forEach((key) => {
    localParams[key] = undefined;
  });
  emit("reset");
};
</script>
