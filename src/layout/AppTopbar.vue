<script setup lang="ts">
import { useLayout } from "@/layout/composables/layout";
import AppConfigurator from "./AppConfigurator.vue";
import { RoutePath } from "@/router";
import { useAuthStore } from "@/stores/authStore.ts";
import Logo from "@/assets/images/svg/Logo.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
import WineSearchDialog from "@/components/wine/WineSearchDialog.vue"; // Import the new dialog component

const { toggleDarkMode, isDarkTheme } = useLayout();
const { logout } = useAuthStore();
const { isLoad } = storeToRefs(useAuthStore());
const route = useRoute();

const checkActiveRoute = (item) => route.path === item.to;

const items = ref([
  {
    label: "Винные карты",
    icon: "pi pi-users",
    to: RoutePath.List,
  },
  {
    label: "Вина",
    icon: "pi pi-users",
    to: RoutePath.ListItem,
  },
  // {
  //   label: "Вина",
  //   icon: "pi pi-users",
  //   to: RoutePath.Wine,
  // },
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
]);

const showSearch = ref(false);
</script>

<template>
  <Menubar :model="items" class="layout-topbar">
    <template #start>
      <router-link :to="RoutePath.Wine" class="layout-topbar-logo">
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
        <Button
          link
          type="button"
          icon="pi pi-search"
          @click="showSearch = true"
        />
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

      <WineSearchDialog
        :visible="showSearch"
        @update:visible="showSearch = false"
      />
    </template>
  </Menubar>
</template>
