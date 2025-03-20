<script setup lang="ts">
import { useRegionStore } from "@/stores/regionStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore.ts";
import DialogAge from "@/components/DialogAge.vue";
import { useWineListStore } from "@/stores/wineListStore.ts";

const { fetchRegions } = useRegionStore();
const { fetchCountries } = useCountryStore();
const { fetchGrapes } = useGrapeStore();
const { getMe } = useAuthStore();

const { fetchWineLists } = useWineListStore();
const isLoad = ref(true);

const initApp = async () => {
  isLoad.value = true;

  try {
    await Promise.allSettled([
      getMe(),
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
    <ProgressSpinner />
  </div>

  <div v-else class="layout-wrapper">
    <router-view></router-view>

    <!--    <app-topbar></app-topbar>-->
    <!--    <div class="layout-main-container">-->
    <!--      <div class="layout-main">-->
    <!--        <router-view></router-view>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="layout-mask animate-fadein"></div>-->
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
  <DialogAge />
</template>

<style lang="scss">
.support {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
}
</style>
