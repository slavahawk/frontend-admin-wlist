<script setup lang="ts">
import { initializeAuth } from "w-list-api";

import { onMounted } from "vue";

initializeAuth();
// import axios from "axios";
//
// // Замените на ваш API токен
// const API_TOKEN = "apify_api_xDH7CnlVqxtJgNHYI8WgvGQfh6B6wX0fPaBW";
//
// // Подготовка входных данных для актора
// const input = {
//   keyword: "Dowdell Pinot Noir", // Название вина для поиска
//   delay: 2,
//   proxy: {
//     useApifyProxy: true,
//     apifyProxyGroups: ["RESIDENTIAL"],
//   },
// };
//
// // Асинхронная функция для выполнения запроса к Apify
// const fetchWinesByName = async () => {
//   try {
//     // Выполнить вызов актора и дождаться завершения
//     const response = await axios.post(
//       `https://api.apify.com/v2/acts/canadesk~vivino/run-sync-get-dataset-items?token=${API_TOKEN}`,
//       input,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//
//     console.log("Ответ API:", response);
//
//     // // Результаты возвращаются в HTTP ответе
//     // console.log("Результаты из набора данных для:", wineName);
//     // response.data.forEach((item) => {
//     //   console.dir(item); // Логируем каждое вино
//     // });
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error);
//   }
// };
//
// // Вызов функции, чтобы получить вина по названию
// fetchWinesByName();
// try {
//   const client = new ApifyClient({
//     token: "apify_api_xDH7CnlVqxtJgNHYI8WgvGQfh6B6wX0fPaBW",
//   });
//   console.log(client);
//
//   // Starts an actor and waits for it to finish.
//   const { defaultDatasetId } = await client
//     .actor("john-doe/my-cool-actor")
//     .call();
//
//   // Fetches results from the actor's dataset.
//   const { items } = await client.dataset(defaultDatasetId).listItems();
//
//   console.log(items);
// } catch (e) {
//   console.log(e);
// }

onMounted(async () => {
  // // Starts an Actor and waits for it to finish
  // const { defaultDatasetId } = await client.actor("username/actor-name").call();
  //
  // // Lists items from the Actor's dataset
  // const { items } = await client.dataset(defaultDatasetId).listItems();
  //
  // console.log(items);
});

// const toast = useToast();
//
// const handleErrors = (event: any) => {
//   console.log(event);
//   toast.add({
//     severity: "error",
//     summary: "Ошибка",
//     detail: event.detail,
//     life: 5000,
//   });
// };
//
// onMounted(() => {
//   window.addEventListener("api-error", handleErrors);
// });
//
// onBeforeUnmount(() => {
//   window.removeEventListener("api-error", handleErrors);
// });
</script>

<template>
  <Suspense>
    <router-view />
  </Suspense>
  <Toast />
  <ConfirmDialog />
</template>

<style scoped></style>
