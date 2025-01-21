<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
import {useRegionStore} from "@/stores/regionStore.ts";
import {useCountryStore} from "@/stores/countryStore.ts";
import {useGrapeStore} from "@/stores/grapeStore.ts";
import {useWineListStore} from "@/stores/wineListStore.ts";
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore.ts";

const { fetchRegions } = useRegionStore();
const { fetchCountries } = useCountryStore();
const { fetchGrapes } = useGrapeStore();
// const { fetchWinesFilter } = useWineStore();
const { fetchWineLists } = useWineListStore();
const { getMe } = useAuthStore();

const isLoad = ref(true);
Promise.allSettled([
  getMe(),
  fetchRegions(),
  fetchCountries(),
  fetchGrapes(),
  // fetchWinesFilter(),
  fetchWineLists(),
]).finally(() => (isLoad.value = false));
</script>

<template>
  <div
    v-if="isLoad"
    class="layout-wrapper relative flex justify-center items-center"
  >
    <ProgressSpinner
      class="spinner"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
  </div>

  <div v-else class="layout-wrapper">
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

<style lang="scss">
.spinner {
  width: 50px;
  height: 50px;
}
</style>
