<template>
  <Form
    v-slot="$form"
    :initialValues="initialValues"
    :resolver="resolver"
    @submit="handleResetSubmit"
    class="form"
  >
    <div class="input-container">
      <label
        for="resetEmail"
        class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
        >Email</label
      >
      <InputText
        id="resetEmail"
        name="resetEmail"
        type="text"
        placeholder="Введите ваш Email"
        v-model="initialValues.email"
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

    <Button label="Отправить" type="submit"></Button>
  </Form>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { reactive } from "vue";
import { z } from "zod";
import { AuthService } from "w-list-api";
import { handleError } from "@/helper/handleError.ts";

const toast = useToast();

const emit = defineEmits<{
  (e: "close"): void;
}>();
const initialValues = reactive({ email: "" });

// Определите схему Zod для валидации формы сброса пароля
const schema = z.object({
  email: z
    .string()
    .email("Неверный адрес электронной почты")
    .nonempty("Электронная почта обязательна."),
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
      const data = await AuthService.forgotPassword(states.resetEmail.value);
      console.log(data);
      emit("close");
    } catch (e) {
      handleError(e, toast);
    }
  }
};
</script>

<style scoped lang="scss"></style>
