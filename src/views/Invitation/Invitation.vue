<template>
  <div>
    <DataTable :loading="isLoad" :value="invitations">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <h4>Приглашенные сомелье {{ invitations?.length }}</h4>
            <Button
              class="p-button-primary"
              variant="text"
              icon="pi pi-plus"
              @click="showAddInvitation = true"
              v-tooltip.bottom="`Пригласить`"
            />
          </div>
          <Button icon="pi pi-refresh" rounded raised @click="getInvitations" />
        </div>
      </template>
      <Column field="id" header="ID"></Column>
      <Column field="sentMail" header="Отправленный email"></Column>
      <Column field="expiredAt" header="Дата истечения">
        <template #body="{ data }">
          {{ data.expiredAt }}
        </template>
      </Column>
      <Column field="confirmedAt" header="Дата подтверждения"></Column>
      <Column field="createdAt" header="Дата создания"></Column>
    </DataTable>
    <Dialog
      v-model:visible="showAddInvitation"
      modal
      header="Пригласить сомелье"
      :breakpoints="{ '960px': '75vw' }"
      :style="{ width: '30vw' }"
    >
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="handleResetSubmit"
        class="form"
      >
        <div class="input-container">
          <label
            for="email"
            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
            >Email</label
          >
          <InputText
            id="email"
            name="email"
            type="text"
            placeholder="Введите ваш Email"
            v-model="initialValues.email"
            autocomplete="email"
          />
          <Message
            v-if="$form.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.email.error?.message }}</Message
          >
        </div>

        <Button label="Отправить" type="submit"></Button>
      </Form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useInvitationStore } from "@/stores/invitaionStore.ts";
import { storeToRefs } from "pinia";
import { reactive, ref } from "vue";

import { useToast } from "primevue/usetoast";
import { z } from "zod";
import { InvitationService } from "w-list-api";
import { handleError } from "@/utils/handleError.ts";

const { getInvitations } = useInvitationStore();
const { invitations, isLoad } = storeToRefs(useInvitationStore());

getInvitations();

const showAddInvitation = ref(false);

const toast = useToast();

const initialValues = reactive({ email: "" });

// Определите схему Zod для валидации формы сброса пароля
const schema = z.object({
  email: z
    .string()
    .email("Неверный адрес электронной почты")
    .nonempty("Электронная почта обязательна."),
});

// Resolver для формы сброса пароля
const resolver = async ({ values }) => {
  try {
    schema.parse(values);
    return { errors: {} }; // Если ошибок нет, возвращаем пустой объект ошибок
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.reduce((acc, error) => {
        const path = error.path[0]; // Получаем путь к ошибке
        acc[path] = [{ message: error.message }]; // Добавляем ошибку по пути
        return acc;
      }, {});
      return { errors }; // Возвращаем ошибки
    }
    return { errors: {} }; // На случай других ошибок
  }
};

// Handle form submission for password reset
const handleResetSubmit = async ({ valid, states }) => {
  if (valid) {
    try {
      const data = await InvitationService.send({ email: states.email.value });

      if (data) {
        toast.add({
          severity: "success",
          summary: "Приглашение отправлено",
          life: 3000,
        });
        showAddInvitation.value = false;
      }
    } catch (e) {
      handleError(e, toast);
    }
  }
};
</script>

<style scoped></style>
