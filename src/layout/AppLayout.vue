<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { useWineStore } from "@/stores/wineStore.ts";

const { fetchRegions } = useRegionStore();
const { fetchCountries } = useCountryStore();
const { fetchGrapes } = useGrapeStore();
const { fetchWinesFilter } = useWineStore();

fetchRegions();
fetchCountries();
fetchGrapes();
fetchWinesFilter();
</script>

<template>
  <div class="layout-wrapper">
    <app-topbar></app-topbar>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
  <Toast />
</template>
