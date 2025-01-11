<script setup lang="ts">
import { initializeAuth } from "w-list-api";

initializeAuth();
</script>

<template>
  <Suspense>
    <router-view />
  </Suspense>
  <Toast />
  <ConfirmDialog />
</template>

<style scoped></style>
