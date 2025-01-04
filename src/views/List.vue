<template>
  <div class="wine-list-container">
    <h2 class="text-2xl mb-4">Список винных карт</h2>

    <Button
      class="mb-4"
      label="Добавить винную карту"
      icon="pi pi-plus"
      @click="showCreateWineListDialog"
    />

    <ProgressSpinner v-if="loading" />

    <div class="wine-list-grid">
      <Card
        v-for="w in wineLists"
        :key="w.id"
        :class="{ active: w.id === selectedWineListId }"
      >
        <template #title>{{ w.name }}</template>
        <template #content>
          <p>Дата создания: {{ formatDate(w.createdAt) }}</p>
          <p>Количество вин: {{ w.wines.length }}</p>
          <div class="flex flex-wrap gap-2">
            <Button
              label="Выбрать активную карту"
              @click="setActiveWineListId(w.id)"
              class="p-button-success"
            />
            <Button
              label="Редактировать"
              @click="editWineList(w.id)"
              class="p-button-warning"
            />
            <Button
              label="Удалить"
              @click="deleteWineList(w.id)"
              class="p-button-danger"
            />
          </div>
        </template>
      </Card>
    </div>

    <Dialog v-model:visible="dialogVisible" header="Создать винную карту">
      <div>
        <InputText
          v-model="newWineListName"
          placeholder="Название винной карты"
        />
      </div>

      <template #footer>
        <div>
          <Button
            label="Сохранить"
            icon="pi pi-check"
            @click="createWineList"
          />
          <Button
            label="Отмена"
            icon="pi pi-times"
            @click="() => (dialogVisible = false)"
            class="p-button-text"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWineListStore } from "@/stores/wineListStore"; // Импортируем хранилище
import { Button, Card, Dialog, InputText } from "primevue"; // Импортируем компоненты PrimeVue
import { storeToRefs } from "pinia"; // Импортируем функцию для работы с Pinia

const {
  fetchWineLists,
  fetchWineListById,
  createWineList: create,
  deleteWineList: deleteWineL,
  setWineListId,
} = useWineListStore(); // Используем хранилище для состояния

const { wineLists, loading, selectedWineListId } =
  storeToRefs(useWineListStore()); // Используем хранилище для состояния

const dialogVisible = ref<boolean>(false); // Показывать или скрывать диалог создания
const newWineListName = ref<string>(""); // Название новой винной карты

// Получаем данные
fetchWineLists();

// Обработчик для показа диалога создания новой винной карты
const showCreateWineListDialog = () => {
  dialogVisible.value = true;
};

// Создание новой винной карты
const createWineList = async () => {
  if (newWineListName.value.trim()) {
    await create({ name: newWineListName.value });
    newWineListName.value = ""; // Сброс имени
    dialogVisible.value = false; // Скрытие диалога
  }
};

// Установка активной винной карты
const setActiveWineListId = (id: number) => {
  setWineListId(id);
};

const editWineList = (id: number) => {
  // Обработчик для редактирования списка вин
  fetchWineListById(id);
  // Дополнительная логика для редактирования можно добавить
};

const deleteWineList = async (id: number) => {
  await deleteWineL(id);
};

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
</script>

<style scoped>
.wine-list-container {
  padding: 2rem;
}

.wine-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.active {
  border: 2px solid #4caf50; /* Зелёная рамка для активного состояния */
  background-color: #f0fff0; /* Светло-зелёный фон для выделения */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Лёгкая тень */
  transition: all 0.3s ease; /* Плавный переход */
}

.active:hover {
  background-color: #e0ffdb; /* Тёмно-светло-зелёный фон при наведении */
}
</style>
