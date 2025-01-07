<template>
  <Card :class="{ active: isActive }" class="wine-card">
    <template #title>
      <h3>{{ name }}</h3>
    </template>
    <template #content>
      <p>Дата создания: {{ formatDate(createdAt) }}</p>
      <p>Количество вин: {{ winesCount }}</p>
      <div class="button-group">
        <Button
          label="Выбрать активную карту"
          @click="emitSelect"
          class="p-button-success"
        />
        <Button
          icon="pi pi-pencil"
          variant="text"
          @click="emitEdit"
          class="p-button-warning"
        />
        <Button
          icon="pi pi-trash"
          variant="text"
          @click="emitDelete"
          class="p-button-danger"
        />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  id: number;
  name: string;
  createdAt: string;
  winesCount: number;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: "select", id: number): void;
  (e: "edit", id: number): void;
  (e: "delete", id: number): void;
}>();

// Функция для форматирования даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Эмитируем селект события
const emitSelect = () => {
  emit("select", props.id);
};

// Эмитируем событие редактирования
const emitEdit = () => {
  emit("edit", props.id);
};

// Эмитируем событие удаления
const emitDelete = () => {
  emit("delete", props.id);
};
</script>

<style scoped>
.wine-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid transparent; /* Прозрачная рамка по умолчанию */
  border-radius: 8px; /* Скругленные углы */
}

.wine-card:hover {
  box-shadow: 0 4px 20px var(--primary-color); /* Легкая тень при наведении */
}

.wine-card.active {
  border: 2px solid var(--primary-color); /* Зеленая рамка для активного состояния */
  background-color: var(
    --primary-contrast-color
  ); /* Светло-зеленый фон для активного состояния */
}

.button-group {
  display: flex;
  gap: 0.5rem; /* Отступ между кнопками */
  margin-top: 15px; /* Отступ сверху кнопок */
}
</style>
