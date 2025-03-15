<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { useWineListStore } from "@/stores/wineListStore.ts";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore.ts";
import TestAge from "@/components/testAge.vue";

const { fetchRegions } = useRegionStore();
const { fetchCountries } = useCountryStore();
const { fetchGrapes } = useGrapeStore();
const { fetchWineLists } = useWineListStore();
const { getMe } = useAuthStore();
const isLoad = ref(true);

const initApp = async () => {
  isLoad.value = true;

  try {
    await getMe();
    await Promise.allSettled([
      fetchRegions(),
      fetchCountries(),
      fetchGrapes(),
      fetchWineLists(),
    ]);
  } catch (e) {
    console.log(e);
  } finally {
    isLoad.value = false;
  }
};

initApp();
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
  <Button
    class="support"
    as="a"
    target="_blank"
    href="https://t.me/slavahawk"
    raised
    icon="pi pi-telegram"
    label="Служба поддержки"
  />
  <TestAge />
</template>

<style lang="scss">
.spinner {
  width: 50px;
  height: 50px;
}

.support {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
}
</style>
