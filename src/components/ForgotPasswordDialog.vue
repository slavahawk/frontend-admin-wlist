<template>
  <Button
    link
    class="font-medium no-underline text-right cursor-pointer text-primary"
    @click="showForgotPassword = true"
    >Забыли пароль?</Button
  >
  <Dialog
    v-model:visible="showForgotPassword"
    header="Сбросить пароль"
    :modal="true"
    :breakpoints="{ '960px': '75vw' }"
    :style="{ width: '30vw' }"
  >
    <ForgotPasswordForm @submit="submit" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ForgotPasswordForm from "@/components/form/ForgotPasswordForm.vue";
import { useAuthStore } from "@/stores/authStore.ts";

const showForgotPassword = ref(false);

const { forgotPassword } = useAuthStore();

const submit = async (email: string) => {
  await forgotPassword(email);
};
</script>

<style scoped></style>
