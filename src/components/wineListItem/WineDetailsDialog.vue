<template>
  <Dialog
    v-model:visible="isVisible"
    header="Информация о вине"
    modal
    style="min-width: 60%"
  >
    <div class="wine-detail" v-if="wine">
      <img :src="wine.originalImagePath" alt="Wine Image" class="wine-image" />
      <div class="detail-content">
        <h3 class="wine-title">{{ wine.name }}</h3>
        <p><strong>Категория:</strong> {{ wine.category }}</p>
        <p><strong>Цвет:</strong> {{ wine.colour }}</p>
        <p><strong>Объем:</strong> {{ wine.bottleVolume }} л</p>
        <p>
          <strong>Алкогольное содержание:</strong> {{ wine.alcoholByVolume }} %
        </p>
        <p><strong>Уровень сахара:</strong> {{ wine.sugarType }}</p>
        <p><strong>Год урожая:</strong> {{ wine.vintage }}</p>
        <p><strong>Интересные факты:</strong> {{ wine.interestingFacts }}</p>
        <p>
          <strong>Органолептические характеристики:</strong>
          {{ wine.organoleptic }}
        </p>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import type { Wine } from "w-list-api";

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
}>();

const props = defineProps<{
  show: boolean;
  wine: Wine | null; // Определите более точный тип для объекта вина
}>();

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});
</script>

<style scoped>
.wine-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.wine-image {
  max-width: 300px; /* Ограничиваем размер изображения */
  height: auto;
  border-radius: 10px; /* Закругление углов изображения */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Тень для изображения */
  margin-bottom: 1rem;
}

.detail-content {
  background-color: #f9f9f9; /* Легкий фон для информации */
  border-radius: 10px; /* Закругление углов блока информации */
  padding: 1rem;
  width: 100%; /* Занять всю ширину родителя */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Тень для блока информации */
}

.wine-title {
  font-size: 1.5rem; /* Размер заголовка */
  margin-bottom: 0.5rem; /* Отступ снизу */
  text-align: center; /* Центрирование заголовка */
}
</style>
