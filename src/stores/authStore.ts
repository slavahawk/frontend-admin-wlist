import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { AppRoutes } from "@/router";
import { ACCESS_TOKEN, AuthService, type Me, REFRESH_TOKEN } from "w-list-api";
import { handleError } from "@/utils/handleError.ts";
import { checkData } from "@/utils/checkData.ts";
import type { RegistrationRequest } from "w-list-api/src/services/auth/types.ts";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<Me | null>(null);
  const isLoad = ref(false);
  const isAuthenticated = ref(false);
  const toast = useToast();
  const router = useRouter();

  const initAuth = () => {
    isAuthenticated.value = !!localStorage.getItem(REFRESH_TOKEN);
  };

  const showToast = (severity: any, summary: string) => {
    toast.add({ severity, summary, life: 3000 });
  };

  const handleLoadState = (loading: boolean) => {
    isLoad.value = loading;
  };

  const login = async (email: string, password: string) => {
    handleLoadState(true);
    try {
      const data = await AuthService.login({ email, password });
      checkData(data, "User data not found in response");

      isAuthenticated.value = true;
      localStorage.setItem(ACCESS_TOKEN, data.details.accessToken);
      localStorage.setItem(REFRESH_TOKEN, data.details.refreshToken);
      showToast("success", "Успешный вход");
      await router.push({ name: AppRoutes.LIST });
    } catch (error) {
      handleError(error, toast);
    } finally {
      handleLoadState(false);
    }
  };

  const getMe = async () => {
    handleLoadState(true);
    try {
      const data = await AuthService.me();
      checkData(data, "User data not found in response");
      user.value = data;
      return data;
    } catch (error) {
      handleError(error, toast);
    } finally {
      handleLoadState(false);
    }
  };

  const register = async (body: RegistrationRequest) => {
    handleLoadState(true);
    try {
      const data = await AuthService.register(body);
      checkData(data, "User data not found in response");
      showToast("success", "Регистрация успешна");
      await login(body.email, body.password);
    } catch (error) {
      handleError(error, toast);
    } finally {
      handleLoadState(false);
    }
  };

  const logout = async () => {
    handleLoadState(true);
    try {
      await AuthService.logout({
        refreshToken: localStorage.getItem(REFRESH_TOKEN),
      });
      isAuthenticated.value = false;
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(ACCESS_TOKEN);
      showToast("success", "Успешный выход");
      await router.push({ name: AppRoutes.LOGIN });
    } catch (error) {
      handleError(error, toast);
    } finally {
      handleLoadState(false);
    }
  };

  const checkAuth = () => isAuthenticated.value;

  // Инициализация состояния аутентификации при создании стора
  initAuth();

  return {
    user,
    isLoad,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    getMe,
  };
});
