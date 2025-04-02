<template>
  <div class="CardList" :class="{ disabled: disabled }">
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
          @click="!disabled && emit('clickChangeImage')"
          :disabled="disabled"
        />
        <Button
          icon="pi pi-file-edit"
          class="p-button-warning"
          severity="success"
          variant="text"
          label="Редактировать карту"
          @click="!disabled && emit('clickEditWine')"
          :disabled="disabled"
        />
        <Button
          icon="pi pi-pencil"
          variant="text"
          class="p-button-warning"
          label="Изменить название"
          @click="!disabled && emit('clickEdit')"
          :disabled="disabled"
        />
        <Button
          icon="pi pi-trash"
          variant="text"
          class="p-button-danger"
          label="Удалить карту"
          @click="!disabled && confirm1($event)"
          :disabled="disabled"
        />
      </div>
    </div>

    <h5 class="my-4">{{ list.name }}</h5>
    <div>Количество вин: {{ list.itemCount }}</div>

    <div class="flex gap-2 flex-wrap items-center my-4">
      <Button
        as="a"
        target="_blank"
        :href="`https://customer.w-list.ru/${list.shopId}`"
        icon="pi pi-arrow-up-right"
        variant="text"
        size="small"
        label="Открыть карту"
        :disabled="disabled"
      />
      <QRCodeGenerator :name="list.name" :id="list.shopId" />
    </div>

    <div class="flex gap-4 items-center h-[30px]">
      <Tag :severity="list.isActive ? 'success' : 'warn'">{{ tagText }}</Tag>
      <Button
        v-if="!list.isActive && !disabled"
        style="color: #5d79a4"
        :loading="loading"
        variant="text"
        size="small"
        label="Сделать активной"
        @click="emit('setActive')"
      />
    </div>
    <h4 v-if="disabled" class="disabled-message">
      Чтобы вернуть карту, напишите в поддержку.
    </h4>
  </div>
</template>

<script setup lang="ts">
import type { WineList } from "wlist-types";
import { computed, ref } from "vue";
import MainImg from "@/assets/images/main.png";
import QRCodeGenerator from "@/components/QRCodeGenerator.vue";
import { useConfirm } from "primevue";

const confirm = useConfirm();

const props = defineProps<{
  list: WineList;
  loading?: boolean;
  disabled?: boolean; // New prop for controlling disabled state
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
  (e: "clickEditWine"): void;
}>();

const confirm1 = (event) => {
  confirm.require({
    header: "Удалить винную карту",
    target: event.currentTarget,
    message: "Вы действительно хотите удалить винную карту?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Нет",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Да",
    },
    accept: () => {
      emit("clickDelete");
    },
    reject: () => {},
  });
};
</script>

<style scoped lang="scss">
.CardList {
  position: relative;
  width: 100%;
  background: var(--surface-card);
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: var(--content-border-radius);
}

.wine-image {
  border-radius: 4px; /* To round the corners */
}

/* Style for the disabled state */
.disabled {
  pointer-events: none; /* Disable pointer events for the card */
  background: var(
    --surface-border
  ); /* Optional: Change background to indicate disabled state */
  &:after {
    opacity: 0.8;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background: var(--surface-border);
    width: 100%;
    height: 100%;
  }
}

.disabled-message {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-color);
  z-index: 2;
}
</style>
