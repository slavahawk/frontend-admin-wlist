<script setup lang="ts">
import {useLayout} from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import {RoutePath} from "@/router";
import {useAuthStore} from "@/stores/authStore.ts";

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const authStore = useAuthStore();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link :to="RoutePath.Dashboard" class="layout-topbar-logo">
              <img src="../assets/images/logo.png" class="w-8" alt="logo">
              <span>W-List</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
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
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                  <button type="button" class="layout-topbar-action" @click="authStore.logout()">
                    <i class="pi pi-sign-out"></i>
                    <span>Выход</span>
                  </button>
                </div>
            </div>
        </div>
    </div>
</template>
