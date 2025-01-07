<template>
  <Card>
    <template #title>
      <h3>{{ wine.name }}</h3>
    </template>
    <template #content>
      <div class="wine-detail">
        <Avatar
          :image="wine.mediumImagePath"
          alt="Wine Image"
          class="wine-image"
        />
        <div class="detail-content">
          <p><strong>Категория:</strong> {{ wine.category }}</p>
          <p><strong>Цвет:</strong> {{ wine.colour }}</p>
          <p><strong>Объем:</strong> {{ wine.bottleVolume }} л</p>
          <p>
            <strong>Алкогольное содержание:</strong>
            {{ wine.alcoholByVolume }} %
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
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Wine } from "@/types/wine.ts"; // Импортируйте тип Wine, если это необходимо
import Card from "primevue/card";
import Avatar from "primevue/avatar";

const props = defineProps<{
  wine: Wine; // Определяем, что мы получаем объект типа Wine
}>();
</script>

<style scoped>
.wine-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.wine-image {
  max-width: 300px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.detail-content {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
