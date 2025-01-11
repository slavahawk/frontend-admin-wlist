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

    <Button label="Сбросить пароль" class="w-full" type="submit"></Button>
  </Form>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { reactive } from "vue";
import { z } from "zod";
import { AuthService } from "w-list-api";
import { handleError } from "@/helper/handleError.ts";

const toast = useToast();
const initialValues = reactive({
  password: "",
});

// Определите схему Zod для валидации
const schema = z.object({
  password: z.string().nonempty("Пароль обязателен."),
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
    try {
      const data = await AuthService.resetPassword({
        newPassword: states.email.value,
        token: localStorage.getItem("accessToken"),
      });
      console.log(data);
    } catch (e) {
      handleError(e, toast);
    }
  }
};
</script>

<style scoped lang="scss"></style>
