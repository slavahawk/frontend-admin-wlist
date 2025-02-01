<script setup lang="ts">
import { initializeAuth } from "w-list-api";

initializeAuth();

// const toast = useToast();
//
// const handleErrors = (event: any) => {
//   console.log(event);
//   toast.add({
//     severity: "error",
//     summary: "Ошибка",
//     detail: event.detail,
//     life: 5000,
//   });
// };
//
// onMounted(() => {
//   window.addEventListener("api-error", handleErrors);
// });
//
// onBeforeUnmount(() => {
//   window.removeEventListener("api-error", handleErrors);
// });
</script>

<template>
  <Suspense>
    <router-view />
  </Suspense>
  <Toast />
  <ConfirmDialog />
</template>

<style scoped></style>
