export const handleError = (error: any, toast: any) => {
  let errorMessage = "Произошла ошибка"; // Сообщение по умолчанию

  // Проверяем наличие ошибок в ответе
  if (error.response && error.response.data) {
    const details = error.response.data.details;

    // Если details является объектом, извлекаем сообщения
    if (typeof details === "object" && details !== null) {
      // Получаем все значения сообщений через Object.values()
      const messages = Object.values(details).join(", ");
      errorMessage = messages || "Произошла ошибка"; // Если нет сообщений, используем сообщение по умолчанию
    } else {
      errorMessage = details || error.message || "Произошла ошибка";
    }
  } else {
    errorMessage = error.message || "Произошла ошибка";
  }

  // Показ уведомления об ошибке
  toast.add({
    severity: "error",
    summary: "Ошибка",
    detail: errorMessage,
    life: 3000,
  });
};
