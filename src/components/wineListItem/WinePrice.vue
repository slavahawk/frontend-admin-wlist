<template>
  <div class="flex gap-2 justify-self-start">
    <div v-if="pricePerGlass" class="flex gap-2 items-center w-[100px]">
      <Glass />
      <span class="text-xl">{{ formatPrice(pricePerGlass) }}</span>
    </div>
    <div class="flex gap-2 items-center">
      <Bottle />
      <span class="text-xl">{{ formatPrice(pricePerBottle) }}</span>
      <sub class="text-xs items-end">{{ bottleVolume }} мл</sub>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from "@/utils/formatPrice.ts";
import Glass from "@/assets/images/svg/Glass.vue";
import Bottle from "@/assets/images/svg/Bottle.vue";

defineProps<{
  pricePerGlass?: number;
  pricePerBottle: number;
  bottleVolume: number;
}>();
</script>

<style scoped></style>
