<template>
  <div class="layout-topbar justify-between" style="padding: 0.5rem 0.75rem">
    <div class="flex gap-4">
      <Button
        variant="text"
        icon="pi pi-arrow-left"
        label="Выйти"
        @click="router.push({ name: AppRoutes.LOGIN })"
      ></Button>
    </div>
    <div class="flex items-center gap-4">
      <Button
        v-if="activeWineList"
        icon="pi pi-arrow-right"
        severity="success"
        iconPos="right"
        size="small"
        label="Далее"
        @click="router.push({ name: AppRoutes.LIST_ITEM })"
      ></Button>
      <div class="layout-config-menu">
        <Button @click="toggleDarkMode" link>
          <i
            :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"
          ></i>
        </Button>
        <div class="relative">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true,
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div>
      </div>

      <Button
        :loading="isLoad"
        type="button"
        @click="logout"
        icon="pi pi-sign-out"
      ></Button>
    </div>
  </div>

  <div class="layout-main-container">
    <div>
      <div class="card">
        <h1 class="mb-4">Старт 🍷</h1>
        <p>
          1. ✨
          <span
            class="underline cursor-pointer"
            @click="showCreateWineListDialog"
          >
            Создайте винную карту.</span
          >
        </p>
        <p>
          2. 🗒️ <Tag severity="success">Активной</Tag> может быть только одна
          винная карта. Убедитесь, что это именно та карта для вашего заведения.
        </p>
        <p>
          3. 🍇 После создания карты добавляйте вино в активной карте! Появится
          кнопка -
          <span v-if="!activeWineList">тут</span>
          <Button
            v-else
            icon="pi pi-arrow-right"
            severity="success"
            iconPos="right"
            size="small"
            label="Далее"
            @click="router.push({ name: AppRoutes.LIST_ITEM })"
          ></Button>
        </p>
        <p>
          4. 🥂 Доступ к винной карте возможен с любого устройства по ссылке. Вы
          также можете скачать QR-код для быстрого доступа!
        </p>
        <p>
          5. 📞 На любые вопросы готов ответить
          <a
            href="https://t.me/slavahawk"
            target="_blank"
            style="color: var(--p-primary-400)"
            >ваш менеджер!</a
          >
        </p>
      </div>

      <div class="mb-4 flex gap-4 items-center">
        <h2>Винные карты {{ wineLists.length }}</h2>

        <Button
          icon="pi pi-plus"
          label="Создать винную карту"
          @click="showCreateWineListDialog"
        ></Button>
      </div>
      <div class="grid__card__292">
        <CardList
          v-for="list in wineLists"
          :key="list.id"
          :list="list"
          :loading="loading"
          :disabled="list.isDeleted"
          @setActive="setActive(list.id)"
          @clickChangeImage="editImage(list)"
          @clickEdit="editWineList(list)"
          @clickDelete="deleteWineList(list.id)"
        />
      </div>
    </div>
  </div>

  <!-- Create Wine List Dialog -->
  <Dialog
    v-model:visible="createDialogVisible"
    modal
    header="Создать винную карту"
  >
    <div>
      <InputText
        v-model="newWineListName"
        placeholder="Название винной карты"
        aria-label="Название винной карты"
        style="width: 100%"
      />
    </div>
    <div class="flex gap-2 justify-between mt-4">
      <Button label="Сохранить" icon="pi pi-check" @click="createWineList" />
      <Button
        label="Отмена"
        icon="pi pi-times"
        @click="() => (createDialogVisible = false)"
        class="p-button-text"
      />
    </div>
  </Dialog>

  <!-- Edit Wine List Dialog -->
  <Dialog
    v-model:visible="editDialogVisible"
    header="Редактировать винную карту"
    modal
  >
    <div>
      <InputText
        v-model="editWineListName"
        placeholder="Название винной карты"
        aria-label="Название винной карты"
        style="width: 100%"
      />
    </div>
    <div class="flex gap-2 justify-between mt-4">
      <Button label="Сохранить" icon="pi pi-check" @click="updateWineList" />
      <Button
        label="Отмена"
        icon="pi pi-times"
        @click="() => (editDialogVisible = false)"
        class="p-button-text"
      />
    </div>
  </Dialog>

  <DialogEditImageList v-model:show="showEditImage" :wineList="editImageList" />
  <Button
    class="support"
    as="a"
    target="_blank"
    href="https://t.me/slavahawk"
    raised
    icon="pi pi-telegram"
    label="Служба поддержки"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWineListStore } from "@/stores/wineListStore";
import { storeToRefs } from "pinia";
import type { WineList } from "wlist-types";
import DialogEditImageList from "@/components/DialogEditImageList.vue";
import CardList from "@/components/list/CardList.vue";
import AppConfigurator from "@/layout/AppConfigurator.vue";
import { AppRoutes } from "@/router";
import { useLayout } from "@/layout/composables/layout.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { useRouter } from "vue-router";

const { toggleDarkMode, isDarkTheme } = useLayout();
const { logout } = useAuthStore();
const { isLoad } = storeToRefs(useAuthStore());
const router = useRouter();

const {
  createWineList: create,
  updateWineList: update,
  deleteWineList: deleteWineL,
  setActiveList,
} = useWineListStore();

const { wineLists, loading, activeWineList } = storeToRefs(useWineListStore());

const createDialogVisible = ref<boolean>(false);
const editDialogVisible = ref<boolean>(false);
const newWineListName = ref<string>("");
const editWineListName = ref<string>("");
const currentEditingWineListId = ref<number | null>(null);

const setActive = (id: number) => {
  setActiveList(id);
};

const showCreateWineListDialog = () => {
  newWineListName.value = ""; // Reset the new list name
  createDialogVisible.value = true;
};

const createWineList = async () => {
  if (newWineListName.value.trim()) {
    await create({ name: newWineListName.value });
    newWineListName.value = "";
    createDialogVisible.value = false;
  }
};

// Show the edit dialog with the current wine list's name
const editWineList = (wineList) => {
  editWineListName.value = wineList.name;
  currentEditingWineListId.value = wineList.id;
  editDialogVisible.value = true;
};

// Update the wine list
const updateWineList = async () => {
  if (
    currentEditingWineListId.value !== null &&
    editWineListName.value.trim()
  ) {
    await update(currentEditingWineListId.value, {
      name: editWineListName.value,
    });
    editWineListName.value = ""; // Reset the name
    editDialogVisible.value = false; // Close the dialog
  }
};

const deleteWineList = async (id: number) => {
  await deleteWineL(id);
};

const showEditImage = ref(false);
const editImageList = ref<WineList | null>(null);
const editImage = (wineList: WineList) => {
  editImageList.value = wineList;
  showEditImage.value = true;
};
</script>

<style scoped>
.grid__card__292 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(410px, 1fr));
  gap: 20px;
}
</style>
