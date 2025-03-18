<template>
  <div class="CardList">
    <div class="flex gap-4">
      <img
        class="w-[100px] h-[100px] wine-image"
        style="border: 1px solid var(--surface-border)"
        v-if="currentImagePath"
        :src="currentImagePath"
        alt="Wine List Image"
        @error="onImageError"
      />

      <div class="flex flex-col items-start">
        <Button
          icon="pi pi-image"
          variant="text"
          class="p-button-warning"
          label="Изменить титульный лист"
          @click="emit('clickChangeImage')"
        />
        <Button
          icon="pi pi-pencil"
          variant="text"
          class="p-button-warning"
          label="Редактировать карту"
          @click="emit('clickEdit')"
        />
        <Button
          icon="pi pi-trash"
          variant="text"
          class="p-button-danger"
          label="Удалить карту"
          @click="emit('clickDelete')"
        />
      </div>
    </div>

    <h5 class="mb-4 mt-1">{{ list.name }}</h5>
    <div>Количество вин: {{ list.itemCount }}</div>

    <div class="flex gap-2 flex-wrap items-center mt-1 mb-2">
      <Button
        as="a"
        target="_blank"
        :href="`https://customer.w-list.ru/${list.shopId}`"
        icon="pi pi-arrow-up-right"
        variant="text"
        size="small"
        label="Открыть карту"
      />
      <QRCodeGenerator :name="list.name" :id="list.shopId" />
    </div>

    <div class="flex gap-4 items-center h-[30px]">
      <Tag :severity="list.isActive ? 'success' : 'warn'">{{ tagText }}</Tag>
      <Button
        v-if="!list.isActive"
        style="color: #5d79a4"
        :loading="loading"
        variant="text"
        size="small"
        label="Сделать активной"
        @click="emit('setActive')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WineList } from "w-list-api";
import { computed, ref } from "vue";
import MainImg from "@/assets/images/main.png";
import QRCodeGenerator from "@/components/QRCodeGenerator.vue";

const props = defineProps<{
  list: WineList;
  loading?: boolean;
}>();

const tagText = computed(() =>
  props.list.isActive ? "Активная" : "Неактивная",
);

// Create a ref for the current image path
const currentImagePath = ref(props.list.imagePath || MainImg);

// Function to handle image loading errors
const onImageError = () => {
  currentImagePath.value = MainImg; // Fallback to the main image if the load fails
};

const emit = defineEmits<{
  (e: "clickChangeImage"): void;
  (e: "clickEdit"): void;
  (e: "clickDelete"): void;
  (e: "setActive"): void;
}>();
</script>

<style scoped lang="scss">
.CardList {
  width: 100%;
  background: var(--surface-card);
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: var(--content-border-radius);
}

.wine-image {
  border-radius: 4px; /* To round the corners */
}
</style>
