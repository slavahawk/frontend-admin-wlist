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
              Регистрация
            </div>
            <span class="text-muted-color font-medium"
              >Создайте учетную запись</span
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
                for="shopName"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                >Название магазина</label
              >
              <InputText
                id="shopName"
                name="shopName"
                type="text"
                placeholder="Название вашего магазина"
                v-model="initialValues.shopName"
                autocomplete="off"
              />
              <Message
                v-if="$form.shopName?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.shopName.error?.message }}</Message
              >
            </div>

            <div class="input-container">
              <label
                for="email"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                >Email</label
              >
              <InputText
                id="email"
                name="email"
                type="text"
                placeholder="Email адрес"
                v-model="initialValues.email"
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
                v-model="initialValues.password"
                placeholder="Пароль"
                :toggleMask="true"
                fluid
                :feedback="false"
                autocomplete="new-password"
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
              label="Зарегистрироваться"
              class="w-full"
              type="submit"
            ></Button>

            <div class="mt-4 max-w-xl">
              Нажимая на кнопку «Зарегистрироваться» я даю согласие на
              <a
                style="color: var(--primary-color)"
                href="https://files.puzzlebrain.ru/documents/main/6._Soglasie_na_obrabotku_personalnyh_dannyh.pdf"
                target="_blank"
              >
                обработку моих персональных данных</a
              >
              и соглашаюсь с условиями
              <a
                style="color: var(--primary-color)"
                href="https://files.puzzlebrain.ru/documents/main/9._Oferta_dlya_sellerov.pdf"
                target="_blank"
                >оферты</a
              >.
            </div>

            <div class="flex items-center justify-between mt-4 mb-8 gap-8">
              <router-link
                :to="{ name: AppRoutes.LOGIN }"
                class="font-medium no-underline text-right cursor-pointer text-primary"
                >Уже есть учетная запись? Войти</router-link
              >
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
import { Form } from "@primevue/forms";
import { Button, InputText, Message, Password } from "primevue";
import FloatingConfigurator from "@/components/FloatingConfigurator.vue";
import { useAuthStore } from "@/stores/authStore.ts";
import Logo from "@/assets/images/svg/Logo.vue";
import { AppRoutes } from "@/router";

const authStore = useAuthStore();

const initialValues = reactive({
  shopName: "",
  email: "",
  password: "",
});

// Define Zod schema for validation
const schema = z.object({
  shopName: z.string().nonempty("Название магазина обязательно."),
  email: z
    .string()
    .email("Неверный адрес электронной почты")
    .nonempty("Электронная почта обязательна."),
  password: z
    .string()
    .nonempty("Пароль обязателен.")
    .min(6, "Минимум 6 символов"),
});

// Resolver function to validate the form
const resolver = async ({ values }) => {
  try {
    schema.parse(values);
    return { errors: {} }; // If no errors, return empty object
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.reduce((acc, error) => {
        const path = error.path[0]; // Get error path
        acc[path] = [{ message: error.message }]; // Add error by path
        return acc;
      }, {});
      return { errors }; // Return errors
    }
    return { errors: {} }; // In case of other errors
  }
};

// Handle form submission
const handleSubmit = async ({ valid, states }) => {
  if (valid) {
    await authStore.register({
      shopName: states.shopName.value,
      email: states.email.value,
      password: states.password.value,
    });
  }
};
</script>

<style scoped></style>
