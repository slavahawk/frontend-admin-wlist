<template>
  <Dialog
    header="Подтверждение возраста"
    :visible="showModal"
    :modal="true"
    style="width: 300px"
  >
    <div>
      <p>Пожалуйста, подтвердите, что вам 18 лет или больше.</p>
      <div class="flex items-center gap-2">
        <Button label="Да" @click="confirmAge" />
        <Button severity="secondary" label="Нет" @click="declineAge" />
      </div>
      <div class="mt-2" v-if="errorMessage" style="color: red">
        {{ errorMessage }}
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showModal = ref(false); // Изменение начального значения
const errorMessage = ref("");

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

const declineAge = () => {
  errorMessage.value =
    "Для доступа к сервису вам должно быть 18 или больше лет!";
};
</script>
