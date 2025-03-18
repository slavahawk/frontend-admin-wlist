<template>
  <app-topbar></app-topbar>
  <div class="layout-main-container">
    <div class="layout-main">
      <router-view></router-view>
    </div>
  </div>
  <div class="layout-mask animate-fadein"></div>
</template>

<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
</script>

<style scoped lang="scss"></style>
