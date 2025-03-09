import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts";
import { type Invitation, InvitationService } from "w-list-api";
import { AppRoutes } from "@/router";
import { useRouter } from "vue-router";

export const useInvitationStore = defineStore("invitation", () => {
  const invitations = ref<Invitation[]>([]);
  const isLoad = ref(false);
  const toast = useToast();
  const router = useRouter();

  const getInvitations = async () => {
    isLoad.value = true;
    try {
      const data = await InvitationService.getAll();
      invitations.value = data;
      return data;
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  const validate = async (token: string) => {
    isLoad.value = true;
    try {
      const data = await InvitationService.validate(token);
      if (data) {
        return data;
      }
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  const confirm = async (token: string, newPassword: string) => {
    isLoad.value = true;
    try {
      const data = await InvitationService.confirm(token, newPassword);

      if (data) {
        await router.push({ name: AppRoutes.LOGIN });
        return data;
      }
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  return {
    invitations,
    isLoad,
    getInvitations,
    validate,
    confirm,
  };
});
