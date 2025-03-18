<script setup lang="ts">
import { useLayout } from "@/layout/composables/layout";
import AppConfigurator from "./AppConfigurator.vue";
import { AppRoutes, RoutePath } from "@/router";
import { useAuthStore } from "@/stores/authStore.ts";
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Role } from "w-list-api";

const { toggleDarkMode, isDarkTheme } = useLayout();
const { logout } = useAuthStore();
const { isLoad, user } = storeToRefs(useAuthStore());
const route = useRoute();
const checkActiveRoute = (item) => route.path === item.to;

const items = ref([
  {
    label: "Вина",
    icon: "pi pi-users",
    to: RoutePath.ListItem,
  },
  // {
  //   label: "Настройки",
  //   icon: "pi pi-cog",
  //   to: RoutePath.Common,
  // },
]);

watchEffect(() => {
  if (user.value?.role === Role.ADMIN) {
    items.value.push({
      label: "Приглашенные",
      icon: "pi pi-users",
      to: RoutePath.Invitation,
    });
  }
});
</script>

<template>
  <Menubar :model="items" class="layout-topbar">
    <template #start>
      <Button
        variant="text"
        icon="pi pi-arrow-left"
        label="Изменить карту"
        @click="$router.push({ name: AppRoutes.LIST })"
      ></Button>
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
