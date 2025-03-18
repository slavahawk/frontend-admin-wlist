<template>
  <Dialog
    header="Изменить титульный лист"
    v-model:visible="isVisible"
    style="min-width: 50vw"
    modal
  >
    <div class="input-container">
      <label class="mb-2 text-l" for="image">Загрузить изображение:</label>
      <FileUpload
        choose-label="Выбрать"
        id="image"
        name="image"
        accept="image/*"
        @select="handleFileUpload"
        customUpload
        auto
        mode="basic"
      />
      <Message v-if="imageFile" severity="info" size="small" variant="simple">
        Загружено: {{ imageFile.name }}
      </Message>
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt="Image"
        class="shadow-md rounded-xl w-full sm:w-64 mt-2"
        @error="onImageError"
      />
    </div>

    <p>Желательный размер изображения 1980 × 1300 px и до 500 кб</p>

    <Button
      label="Сохранить"
      :loading="loading"
      @click="clickSaveImage"
    ></Button>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type WineList } from "w-list-api";
import { useWineListStore } from "@/stores/wineListStore.ts";
import { storeToRefs } from "pinia";
import MainImg from "@/assets/images/main.png";

const { saveImage } = useWineListStore();
const { loading } = storeToRefs(useWineListStore());

const props = defineProps<{
  show: boolean;
  wineList: WineList | null;
}>();
const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
}>();

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});

// Реактивные ссылки для изображения
const imageFile = ref<File | null>(null);
const imageSrc = ref(null);

const onImageError = () => {
  imageSrc.value = MainImg; // Fallback to the main image if the load fails
};

watch(
  () => props.show,
  (val) => {
    if (val) {
      imageSrc.value = props.wineList?.imagePath;
    }
  },
);

// Обработчик загрузки изображения
const handleFileUpload = (event: any) => {
  const files = event.files;
  const file = files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    imageSrc.value = e.target.result;
  };

  imageFile.value = files.length > 0 ? file : null;
  reader.readAsDataURL(file);
};

const clickSaveImage = async () => {
  await saveImage(props.wineList.id, imageFile.value);
  emit("update:show", false);
};
</script>

<style scoped lang="scss"></style>
