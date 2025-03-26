import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { AppRoutes } from "@/router";
import { ACCESS_TOKEN, AuthService, REFRESH_TOKEN } from "w-list-api";
import { handleError } from "@/utils/handleError.ts";
import { checkData } from "w-list-utils";
import type {
  RegistrationRequest,
  ResetPasswordRequest,
  Me,
} from "wlist-types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<Me | null>(null);
  const isLoad = ref(false);
  const isAuthenticated = ref(false);
  const toast = useToast();
  const router = useRouter();

  const initAuth = () => {
    isAuthenticated.value = !!localStorage.getItem(REFRESH_TOKEN);
  };

  const showToast = (summary: string) => {
    toast.add({ severity: "success", summary, life: 3000 });
  };

  const setLoading = (loading: boolean) => {
    isLoad.value = loading;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await AuthService.login({ email, password });
      checkData(data);
      isAuthenticated.value = true;
      localStorage.setItem(ACCESS_TOKEN, data.details.accessToken);
      localStorage.setItem(REFRESH_TOKEN, data.details.refreshToken);
      showToast("Успешный вход");
      await router.push({ name: AppRoutes.LIST });
    } catch (error) {
      handleError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  const getMe = async () => {
    setLoading(true);
    try {
      const data = await AuthService.me();
      checkData(data);
      user.value = data;
      return data;
    } catch (error) {
      handleError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  const register = async (body: RegistrationRequest) => {
    setLoading(true);
    try {
      const data = await AuthService.register(body);
      checkData(data);
      showToast("Регистрация успешна");
      await login(body.email, body.password);
    } catch (error) {
      handleError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout({
        refreshToken: localStorage.getItem(REFRESH_TOKEN),
      });
      isAuthenticated.value = false;
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(ACCESS_TOKEN);
      showToast("Успешный выход");
      await router.push({ name: AppRoutes.LOGIN });
    } catch (error) {
      handleError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setLoading(true);
    try {
      const d = await AuthService.resetPassword(data);
      checkData(d);
      showToast("Успешное восстановление пароля");
      await router.push({ name: AppRoutes.LOGIN });
    } catch (error) {
      handleError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const data = await AuthService.forgotPassword({ email });
      checkData(data);
      showToast("Успешное восстановление пароля");
      await router.push({ name: AppRoutes.LOGIN });
    } catch (error) {
      handleError(error, toast);
    } finally {
      setLoading(false);
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
    resetPassword,
    forgotPassword,
  };
});
