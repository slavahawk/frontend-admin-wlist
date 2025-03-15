<template>
  <Form
    v-slot="$form"
    :initialValues="initialValues"
    :resolver="resolver"
    @submit="handlePricesSubmit"
    class="form"
  >
    <div class="input-container">
      <label
        for="pricePerBottle"
        class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
        >Цена за бутылку</label
      >
      <InputNumber
        id="pricePerBottle"
        v-model="initialValues.pricePerBottle"
        mode="decimal"
        placeholder="Введите цену за бутылку"
        :min="0"
      />
      <Message
        v-if="$form.pricePerBottle?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.pricePerBottle.error?.message }}</Message
      >
    </div>

    <div class="input-container">
      <label
        for="pricePerGlass"
        class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
        >Цена за бокал</label
      >
      <InputNumber
        id="pricePerGlass"
        v-model="initialValues.pricePerGlass"
        mode="decimal"
        placeholder="Введите цену за бокал"
        :min="0"
      />
      <Message
        v-if="$form.pricePerGlass?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.pricePerGlass.error?.message }}</Message
      >
    </div>

    <div class="input-container">
      <label for="glassVolume">Объем бокала (мл):</label>
      <Select
        id="glassVolume"
        name="glassVolume"
        v-model="initialValues.glassVolume"
        :options="glassVolumeOptions"
        show-clear
        option-label="name"
        option-value="id"
      />
      <Message
        v-if="$form.glassVolume?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.glassVolume.error.message }}
      </Message>
    </div>
    <div class="input-container">
      <label for="internalComment">Комментарий:</label>
      <InputText
        id="internalComment"
        v-model="initialValues.internalComment"
        placeholder="Введите комментарий"
      />
      <Message
        v-if="$form.internalComment?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.internalComment.error.message }}
      </Message>
    </div>
    <div class="flex justify-between items-center">
      <slot />
      <Button label="Добавить" type="submit"></Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { z } from "zod";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";
import { glassVolumeOptions, type PricesWithGlass } from "w-list-api";

const toast = useToast();

const props = defineProps<{
  prices?: PricesWithGlass;
}>();

const emit = defineEmits<{
  (e: "save", prices: PricesWithGlass): void;
}>();

const initialValues = reactive<any>({
  pricePerBottle: props.prices?.pricePerBottle,
  pricePerGlass: props.prices?.pricePerGlass,
  glassVolume: props.prices?.glassVolume,
  internalComment: props.prices?.internalComment,
});

// Определите схему Zod для валидации формы с новыми полями
const schema = z.object({
  pricePerBottle: z
    .number()
    .positive("Цена за бутылку должна быть положительным числом"),
  pricePerGlass: z
    .number()
    .positive("Цена за стакан должна быть положительным числом"),
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

// Handle form submission for prices
const handlePricesSubmit = async ({ valid }) => {
  if (valid) {
    try {
      if (valid) {
        emit("save", initialValues);
      }
    } catch (e) {
      handleError(e, toast);
    }
  }
};
</script>

<style scoped>
.input-container {
  margin-bottom: 1.5rem;
}
</style>
