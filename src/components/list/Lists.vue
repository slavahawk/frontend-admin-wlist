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
          @click-edit-wine="clickEditWine(list.id)"
        />
      </div>
    </div>
  </div>

  <!-- Create Wine List Dialog -->
  <DialogCreateWineList
    v-model:show="createDialogVisible"
    :wineLists="wineLists"
    @submit="createWineList"
    @copy="copyWineList"
  />
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
import DialogCreateWineList from "@/components/list/DialogCreateWineList.vue";

const { toggleDarkMode, isDarkTheme } = useLayout();
const { logout } = useAuthStore();
const { isLoad } = storeToRefs(useAuthStore());
const router = useRouter();

const {
  createWineList: create,
  updateWineList: update,
  deleteWineList: deleteWineL,
  setActiveList,
  cloneWineList,
} = useWineListStore();

const { wineLists, loading } = storeToRefs(useWineListStore());

const createDialogVisible = ref<boolean>(false);
const editDialogVisible = ref<boolean>(false);
const editWineListName = ref<string>("");
const currentEditingWineListId = ref<number | null>(null);

const setActive = (id: number) => {
  setActiveList(id);
};

const showCreateWineListDialog = () => {
  createDialogVisible.value = true;
};

const createWineList = async (name: string) => {
  const data = await create({ name });
  if (data) {
    createDialogVisible.value = false;
  }
};

const copyWineList = async (body: { wineListId: number; name: string }) => {
  const data = await cloneWineList(body);

  if (data) {
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

const clickEditWine = (listId: number) => {
  router.push({ name: AppRoutes.LIST_ITEM, params: { id: listId } });
};
</script>

<style scoped>
.grid__card__292 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(410px, 1fr));
  gap: 20px;
}
</style>
