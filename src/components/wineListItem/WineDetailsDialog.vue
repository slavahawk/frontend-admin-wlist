<template>
  <Drawer v-model:visible="isVisible" header=" " position="full">
    <WineDetailCard v-if="wine" :wine="wine">
      <p class="mb-4">
        <WinePrice
          :price-per-glass="pricePerGlass"
          :price-per-bottle="pricePerBottle"
          :bottle-volume="wine.bottleVolume"
        />
      </p>
    </WineDetailCard>
  </Drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { type Wine } from "w-list-api";
import WinePrice from "@/components/wineListItem/WinePrice.vue";
import WineDetailCard from "@/components/wineList/WineDetailCard.vue";

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
}>();

const props = defineProps<{
  show: boolean;
  wine: Wine | null;
  pricePerGlass?: number;
  pricePerBottle: number;
}>();

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});
</script>

<style scoped></style>
