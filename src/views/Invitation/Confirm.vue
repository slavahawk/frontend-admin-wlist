<template>
  <FloatingConfigurator />
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
          style="border-radius: 53px"
        >
          <div class="text-center mb-8">
            <Logo class="w-24 h-24 ml-auto mr-auto mb-4" />
            <div
              class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4"
            >
              Придумай себе пароль
            </div>
          </div>
          <FormPassword :is-load="isLoad" @submit="handleSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FloatingConfigurator from "@/components/FloatingConfigurator.vue";
import Logo from "@/assets/images/svg/Logo.vue";
import { storeToRefs } from "pinia";
import FormPassword from "@/components/form/FormPassword.vue";
import type { ResetPasswordRequest } from "w-list-api/src/services/auth/types.ts";
import { useInvitationStore } from "@/stores/invitaionStore.ts";
import { useRoute } from "vue-router";

const { confirm, validate } = useInvitationStore();
const { isLoad } = storeToRefs(useInvitationStore());

const route = useRoute();

if (route.query.token) {
  validate(route.query.token);
}

const handleSubmit = async (data: ResetPasswordRequest) => {
  await confirm(data.token, data.newPassword);
};
</script>

<style scoped></style>
