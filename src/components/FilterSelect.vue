<template>
  <div class="input-container">
    <div class="text-l">{{ label }}</div>
    <Select
      :modelValue="modelValue"
      @update:modelValue="updateModelValue"
      :options="options"
      option-label="name"
      option-value="id"
      showClear
      filter
      placeholder="Выберите"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number | object | undefined;
  label: string;
  options: [];
}>();

const emit = defineEmits(["update:modelValue", "change"]);

// Функция для обновления значения
const updateModelValue = (value) => {
  emit("update:modelValue", value);
  emit("change", value);
};
</script>

<style scoped>
.input-container {
  margin-bottom: 16px;
}
</style>
