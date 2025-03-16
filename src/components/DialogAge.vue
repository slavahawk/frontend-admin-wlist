<template>
  <Dialog header="18+" :visible="showModal" :modal="true" class="max-w-2xl">
    <div>
      <p>
        Для доступа на сайт необходимо подтвердить свое совершеннолетие и
        согласие на обработку файлов cookies.
      </p>
      <Button class="w-full" label="Подтверждаю" @click="confirmAge" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showModal = ref(false); // Изменение начального значения

// Проверяем наличие данных в localStorage при монтировании компонента
onMounted(() => {
  const ageConfirmed = localStorage.getItem("ageConfirmed");
  if (!ageConfirmed) {
    showModal.value = true; // Показываем окно только если данные отсутствуют
  }
});

const confirmAge = () => {
  // Сохраняем состояние подтверждения возраста в localStorage
  localStorage.setItem("ageConfirmed", "true");
  showModal.value = false; // Закрываем модальное окно
};
</script>
