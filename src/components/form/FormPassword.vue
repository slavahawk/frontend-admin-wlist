<template>
  <Form
    v-slot="$form"
    :initialValues="initialValues"
    :resolver="resolver"
    @submit="handleSubmit"
    class="form"
  >
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
        placeholder="Новый пароль"
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

    <div class="input-container">
      <label
        for="confirmPassword"
        class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
        >Повторите пароль</label
      >
      <Password
        id="confirmPassword"
        name="confirmPassword"
        v-model="initialValues.confirmPassword"
        placeholder="Повторите пароль"
        :toggleMask="true"
        fluid
        :feedback="false"
        autocomplete="new-password"
      />
      <Message
        v-if="$form.confirmPassword?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.confirmPassword.error?.message }}</Message
      >
    </div>

    <Button
      :loading="isLoad"
      label="Сохранить"
      class="w-full"
      type="submit"
    ></Button>
  </Form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive } from "vue";
import { Button, Message, Password } from "primevue";
import { Form } from "@primevue/forms";
import { z } from "zod";
import { useRoute } from "vue-router";
import type { ResetPasswordRequest } from "w-list-api";

const route = useRoute();

defineProps<{
  isLoad: boolean;
}>();
const emit = defineEmits<{
  (e: "submit", val: ResetPasswordRequest): void;
}>();

const initialValues = reactive({
  password: "",
  confirmPassword: "", // Новое поле для повторного ввода пароля
});

// Define Zod schema for validation
const schema = z.object({
  password: z
    .string()
    .nonempty("Пароль обязателен.")
    .min(6, "Минимум 6 символов"),
  confirmPassword: z
    .string()
    .nonempty("Повторите пароль.")
    .min(6, "Минимум 6 символов")
    .refine((val, ctx) => {
      if (val !== initialValues.password) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Пароли не совпадают.",
        });
      }
      return val === initialValues.password;
    }),
});

// Resolver function to validate the form
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
    emit("submit", {
      token: route.query.token,
      newPassword: states.password.value,
    });
  }
};
</script>
