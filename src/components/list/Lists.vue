<template>
  <div class="wine-list-container">
    <div class="mb-4 flex gap-4 items-center">
      <h2 class="text-2xl">Список винных карт</h2>

      <Button
        class="p-button-primary"
        variant="text"
        icon="pi pi-plus"
        @click="showCreateWineListDialog"
      />
    </div>

    <div v-if="!loading && wineLists.length === 0" class="empty-state">
      <p>Список винных карт пуст. Добавьте новую винную карту.</p>
    </div>

    <div v-if="loading" class="wine-list-grid mt-12">
      <Skeleton
        width="320px"
        height="160px"
        borderRadius="16px"
        v-for="item in 4"
      />
    </div>

    <div class="wine-list-grid mt-12" v-else>
      <WineListCard
        class="w-[320px] h-[160px]"
        v-for="w in wineLists"
        :key="w.id"
        :id="w.id"
        :name="w.name"
        :createdAt="w.createdAt"
        :winesCount="w.itemCount"
        :isActive="w.id === selectedWineListId"
        @select="setActiveWineListId"
        @edit="editWineList"
        @delete="deleteWineList"
      />
    </div>

    <Dialog v-model:visible="dialogVisible" header="Создать винную карту">
      <div>
        <InputText
          v-model="newWineListName"
          placeholder="Название винной карты"
          aria-label="Название винной карты"
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
import { useWineListStore } from "@/stores/wineListStore";
import { storeToRefs } from "pinia";
import WineListCard from "@/components/wineList/WineListCard.vue";

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
  fetchWineListById(id);
};

const deleteWineList = async (id: number) => {
  await deleteWineL(id);
};
</script>

<style scoped>
.wine-list-container {
  padding: 2rem;
  background-color: #f9f9f9; /* Легкий фон для лучшего контраста */
  border-radius: 8px; /* Скругление углов */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Тень для глубины */
}

.wine-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.empty-state {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

button {
  transition: background-color 0.3s ease; /* Плавный переход для кнопок */
}

button:hover {
  background-color: #6ca0d9; /* Цвет фона при наведении на кнопки */
}
</style>
