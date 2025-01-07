<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { useWineStore } from "@/stores/wineStore.ts";
import { ref } from "vue";
import Lists from "@/components/list/Lists.vue";
import { SELECT_LIST } from "@/const/localstorage.ts";

const { fetchRegions } = useRegionStore();
const { fetchCountries } = useCountryStore();
const { fetchGrapes } = useGrapeStore();
const { fetchWinesFilter } = useWineStore();

fetchRegions();
fetchCountries();
fetchGrapes();
fetchWinesFilter();
const showSelectList = ref(false);

const checkConditionsAndCloseDialog = () => {
  if (!localStorage.getItem(SELECT_LIST)) showSelectList.value = true;
};

checkConditionsAndCloseDialog();
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
  <Dialog
    v-model:visible="showSelectList"
    header="Выбрать карту"
    modal
    :maximizable="true"
    @hide="checkConditionsAndCloseDialog"
  >
    <Lists />
  </Dialog>
</template>
