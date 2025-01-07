<script setup lang="ts">
import { useLayout } from "@/layout/composables/layout";
import AppConfigurator from "./AppConfigurator.vue";
import { RoutePath } from "@/router";
import { useAuthStore } from "@/stores/authStore.ts";
import Logo from "@/assets/images/svg/Logo.vue";
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useWineListStore } from "@/stores/wineListStore.ts"; // Import the new dialog component

const { toggleDarkMode, isDarkTheme } = useLayout();
const { logout } = useAuthStore();
const { isLoad } = storeToRefs(useAuthStore());
const route = useRoute();
const { isSelectedWineList } = storeToRefs(useWineListStore());
const checkActiveRoute = (item) => route.path === item.to;

const items = ref([
  {
    label: "Вина",
    icon: "pi pi-users",
    to: RoutePath.ListItem,
    disabled: true,
  },
  {
    label: "Приглашенные",
    icon: "pi pi-users",
    to: RoutePath.Invitation,
  },
  {
    label: "Настройки",
    icon: "pi pi-cog",
    to: RoutePath.Common,
  },
  {
    label: "Изменить винную карту",
    icon: "pi pi-users",
    to: RoutePath.List,
  },
]);

watchEffect(() => {
  if (isSelectedWineList.value) {
    items.value[1].disabled = !isSelectedWineList.value;
  }
});
</script>

<template>
  <Menubar :model="items" class="layout-topbar">
    <template #start>
      <router-link :to="RoutePath.List" class="layout-topbar-logo">
        <Logo />
        <span>W-List</span>
      </router-link>
    </template>
    <template #item="{ item }">
      <router-link
        class="link__menu"
        :to="item.to"
        :class="[{ 'active-route': checkActiveRoute(item) }]"
      >
        <i :class="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ item.label }}</span>
      </router-link>
    </template>
    <template #end>
      <div class="flex items-center gap-4">
        <div class="layout-config-menu">
          <Button @click="toggleDarkMode" link>
            <i
              :class="[
                'pi',
                { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme },
              ]"
            ></i>
          </Button>
          <div class="relative">
            <button
              v-styleclass="{
                selector: '@next',
                enterFromClass: 'hidden',
                enterActiveClass: 'animate-scalein',
                leaveToClass: 'hidden',
                leaveActiveClass: 'animate-fadeout',
                hideOnOutsideClick: true,
              }"
              type="button"
              class="layout-topbar-action layout-topbar-action-highlight"
            >
              <i class="pi pi-palette"></i>
            </button>
            <AppConfigurator />
          </div>
        </div>

        <button
          class="layout-topbar-menu-button layout-topbar-action"
          v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-scalein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true,
          }"
        >
          <i class="pi pi-ellipsis-v"></i>
        </button>

        <Button
          :loading="isLoad"
          type="button"
          @click="logout()"
          icon="pi pi-sign-out"
        ></Button>
      </div>
    </template>
  </Menubar>
</template>
