export const formatPrice = (price: number) =>
  price.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }) + " ₽";
