<template>
  <div>
    <Button
      icon="pi pi-qrcode"
      variant="text"
      size="small"
      label="Скачать QR карты"
      @click="isVisible = true"
    ></Button>
    <Dialog header="QR код винной карты" v-model:visible="isVisible" modal>
      <div ref="qrCodeContainer">
        <qrcode-vue :value="value" :level="level" :render-as="renderAs" />
      </div>
      <template #footer>
        <Button
          icon="pi pi-qrcode"
          label="Скачать"
          @click="saveQRCode"
        ></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"; // Importing nextTick
import QrcodeVue from "qrcode.vue";
import type { Level, RenderAs } from "qrcode.vue";
import html2canvas from "html2canvas"; // Import html2canvas

const props = defineProps<{
  name: string;
  id: number;
}>();

const value = ref(`https://customer.w-list.ru/${props.id}`);
const level = ref<Level>("L");
const renderAs = ref<RenderAs>("svg");
const qrCodeContainer = ref<HTMLDivElement | null>(null); // Reference for the container of the QR code

const saveQRCode = async () => {
  await nextTick(); // Wait for the next DOM update cycle
  if (qrCodeContainer.value) {
    // Use the wrapper div reference
    // Use html2canvas to capture the QR code from the container
    const canvas = await html2canvas(qrCodeContainer.value);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png"); // Get data URL from the canvas
    link.download = `${props.name}.png`; // Name of the downloaded file
    link.click(); // Trigger download
  }
};

const isVisible = ref(false);
</script>

<style scoped>
/* Add any styles you need here */
</style>
