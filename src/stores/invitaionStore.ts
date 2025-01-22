import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/utils/handleError.ts";
import { checkData } from "@/utils/checkData.ts";
import { InvitationService, type Invitation } from "w-list-api";

export const useInvitationStore = defineStore("invitation", () => {
  const invitations = ref<Invitation[]>([]);
  const isLoad = ref(false);
  const toast = useToast();

  const getInvitations = async () => {
    isLoad.value = true;
    try {
      const data = await InvitationService.getAll();

      checkData(data);

      toast.add({
        severity: "success",
        summary: "Приглашенные получены",
        life: 3000,
      });
      invitations.value = data;
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
  };
});
