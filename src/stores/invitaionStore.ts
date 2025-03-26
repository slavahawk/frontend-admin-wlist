import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts";
import { InvitationService } from "w-list-api";
import { AppRoutes } from "@/router";
import { useRouter } from "vue-router";
import { type Invitation } from "wlist-types";
import { checkData } from "w-list-utils";

export const useInvitationStore = defineStore("invitation", () => {
  const invitations = ref<Invitation[]>([]);
  const isLoad = ref(false);
  const toast = useToast();
  const router = useRouter();

  const getInvitations = async () => {
    isLoad.value = true;
    try {
      const data = await InvitationService.getAll();
      checkData(data);
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
      checkData(data);
      return data;
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
      checkData(data);
      await router.push({ name: AppRoutes.LOGIN });
      return data;
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
