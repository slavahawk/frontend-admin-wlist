<template>
  <FloatingConfigurator />
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
          style="border-radius: 53px"
        >
          <div class="text-center mb-8">
            <Logo class="w-24 h-24 ml-auto mr-auto mb-4" />
            <div
              class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4"
            >
              Добро пожаловать в W-List!
            </div>
            <span class="text-muted-color font-medium"
              >Войдите, чтобы продолжить</span
            >
          </div>
          <Form
            v-slot="$form"
            :initialValues="initialValues"
            :resolver="resolver"
            @submit="handleSubmit"
            class="form"
          >
            <div class="input-container">
              <label
                for="email1"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                >Email</label
              >
              <InputText
                id="email"
                name="email"
                type="text"
                placeholder="Email адрес"
                class="w-full md:w-[30rem]"
                v-model.trim="initialValues.email"
                autocomplete="email"
              />
              <Message
                v-if="$form.email?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.email.error?.message }}</Message
              >
            </div>

            <div class="input-container">
              <label
                for="password"
                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                >Пароль</label
              >
              <Password
                id="password"
                name="password"
                v-model.trim="initialValues.password"
                placeholder="Пароль"
                :toggleMask="true"
                fluid
                :feedback="false"
                autocomplete="current-password"
              />
              <Message
                v-if="$form.password?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.password.error?.message }}</Message
              >
            </div>

            <Button
              :loading="authStore.isLoad"
              label="Войти"
              class="w-full"
              type="submit"
            ></Button>

            <div class="flex items-center justify-between mt-4 mb-8 gap-8">
              <router-link
                :to="{ name: AppRoutes.REG }"
                class="font-medium no-underline text-right cursor-pointer text-primary"
                >Регистрация</router-link
              >
              <ForgotPasswordDialog />
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { z } from "zod";

import FloatingConfigurator from "@/components/FloatingConfigurator.vue";
import { useAuthStore } from "@/stores/authStore.ts";
import Logo from "@/assets/images/svg/Logo.vue";
import { AppRoutes } from "@/router";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog.vue";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/const/localstorage.ts";

const authStore = useAuthStore();

if (localStorage.getItem(REFRESH_TOKEN) && localStorage.getItem(ACCESS_TOKEN)) {
  authStore.isAuthenticated = false;
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN);
}

const initialValues = reactive({
  email: "",
  password: "",
});

// Определите схему Zod для валидации
const schema = z.object({
  email: z
    .string()
    .email("Неверный адрес электронной почты")
    .nonempty("Электронная почта обязательна."),
  password: z
    .string()
    .nonempty("Пароль обязателен.")
    .min(6, "Минимум 6 символов"),
});

const resolver = async ({ values }) => {
  try {
    schema.parse(values);
    return { errors: {} }; // Если ошибок нет, возвращаем пустой объект ошибок
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.reduce((acc, error) => {
        const path = error.path[0]; // Получаем путь к ошибке
        acc[path] = [{ message: error.message }]; // Добавляем ошибку по пути
        return acc;
      }, {});
      return { errors }; // Возвращаем ошибки
    }
    return { errors: {} }; // На случай других ошибок
  }
};

// Handle form submission
const handleSubmit = async ({ valid, states }) => {
  if (valid) {
    await authStore.login(states.email.value, states.password.value);
  }
};
</script>

<style scoped>
/* Ваши стили здесь */
</style>
