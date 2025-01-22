<template>
  <div class="flex justify-center items-center w-full min-h-screen">
    <div class="card min-w-[50vw]">
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="handleResetSubmit"
      >
        <div class="input-container">
          <label
            for="password"
            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
            >Придумайте пароль</label
          >
          <InputText
            id="password"
            name="password"
            type="password"
            placeholder="Придумайте пароль"
            v-model="initialValues.password"
            autocomplete="email"
          />
          <Message
            v-if="$form.resetEmail?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.resetEmail.error?.message }}</Message
          >
        </div>

        <Button label="Сохранить" type="submit"></Button>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { reactive } from "vue";
import { z } from "zod";
import { handleError } from "@/utils/handleError.ts";
import { useRoute } from "vue-router";
import { InvitationService } from "w-list-api";

const toast = useToast();
const { params } = useRoute();

const initialValues = reactive({ password: "" });

// Определите схему Zod для валидации формы сброса пароля
const schema = z.object({
  password: z
    .string()
    .min(6, "Минимум 6 символов")
    .nonempty("Пароль обязателен."),
});

// Resolver для формы сброса пароля
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

// Handle form submission for password reset
const handleResetSubmit = async ({ valid, states }) => {
  if (valid) {
    try {
      const data = await InvitationService.confirm(
        params.token,
        states.password.value,
      );
      console.log(data);
    } catch (e) {
      handleError(e, toast);
    }
  }
};
</script>

<style scoped lang="scss"></style>
