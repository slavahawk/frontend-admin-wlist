import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

export enum AppRoutes {
  DASHBOARD = "Dashboard",
  LOGIN = "Login",
  REG = "Reg",
  INVITATION = "Invitation",
  INVITATION_CONFIRM = "InvitationConfirm",
  COMMON = "Common",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.DASHBOARD]: "/",
  [AppRoutes.LOGIN]: "/auth/login",
  [AppRoutes.REG]: "/auth/reg",
  [AppRoutes.INVITATION]: "/invitation",
  [AppRoutes.INVITATION_CONFIRM]: "/invitation/:token/confirm",
  [AppRoutes.COMMON]: "/common",
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: RoutePath.Dashboard,
          name: AppRoutes.DASHBOARD,
          component: () => import("@/views/Dashboard.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: RoutePath.Invitation,
          name: AppRoutes.INVITATION,
          component: () => import("@/views/Invitation/Invitation.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: RoutePath.Invitation,
          name: AppRoutes.INVITATION,
          component: () => import("@/views/Invitation/Invitation.vue"),
          meta: { requiresAuth: true },
        },

        {
          path: RoutePath.Common,
          name: AppRoutes.COMMON,
          component: () => import("@/views/Common.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/uikit/formlayout",
          name: "formlayout",
          component: () => import("@/views/uikit/FormLayout.vue"),
        },
        {
          path: "/uikit/input",
          name: "input",
          component: () => import("@/views/uikit/InputDoc.vue"),
        },
        {
          path: "/uikit/button",
          name: "button",
          component: () => import("@/views/uikit/ButtonDoc.vue"),
        },
        {
          path: "/uikit/table",
          name: "table",
          component: () => import("@/views/uikit/TableDoc.vue"),
        },
        {
          path: "/uikit/list",
          name: "list",
          component: () => import("@/views/uikit/ListDoc.vue"),
        },
        {
          path: "/uikit/tree",
          name: "tree",
          component: () => import("@/views/uikit/TreeDoc.vue"),
        },
        {
          path: "/uikit/panel",
          name: "panel",
          component: () => import("@/views/uikit/PanelsDoc.vue"),
        },

        {
          path: "/uikit/overlay",
          name: "overlay",
          component: () => import("@/views/uikit/OverlayDoc.vue"),
        },
        {
          path: "/uikit/media",
          name: "media",
          component: () => import("@/views/uikit/MediaDoc.vue"),
        },
        {
          path: "/uikit/message",
          name: "message",
          component: () => import("@/views/uikit/MessagesDoc.vue"),
        },
        {
          path: "/uikit/file",
          name: "file",
          component: () => import("@/views/uikit/FileDoc.vue"),
        },
        {
          path: "/uikit/menu",
          name: "menu",
          component: () => import("@/views/uikit/MenuDoc.vue"),
        },
        {
          path: "/uikit/charts",
          name: "charts",
          component: () => import("@/views/uikit/ChartDoc.vue"),
        },
        {
          path: "/uikit/misc",
          name: "misc",
          component: () => import("@/views/uikit/MiscDoc.vue"),
        },
        {
          path: "/uikit/timeline",
          name: "timeline",
          component: () => import("@/views/uikit/TimelineDoc.vue"),
        },
        {
          path: "/pages/empty",
          name: "empty",
          component: () => import("@/views/pages/Empty.vue"),
        },
        {
          path: "/pages/crud",
          name: "crud",
          component: () => import("@/views/pages/Crud.vue"),
        },
        {
          path: "/documentation",
          name: "documentation",
          component: () => import("@/views/pages/Documentation.vue"),
        },
      ],
    },
    {
      path: RoutePath.InvitationConfirm,
      name: AppRoutes.INVITATION_CONFIRM,
      component: () => import("@/views/Invitation/Confirm.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/landing",
      name: "landing",
      component: () => import("@/views/pages/Landing.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () => import("@/views/pages/NotFound.vue"),
    },

    {
      path: RoutePath.Login,
      name: AppRoutes.LOGIN,
      component: () => import("@/views/pages/auth/Login.vue"),
    },
    {
      path: RoutePath.Reg,
      name: AppRoutes.REG,
      component: () => import("@/views/pages/auth/Reg.vue"),
    },
    {
      path: "/auth/access",
      name: "accessDenied",
      component: () => import("@/views/pages/auth/Access.vue"),
    },
    {
      path: "/auth/error",
      name: "error",
      component: () => import("@/views/pages/auth/Error.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Обновляем состояние аутентификации
  authStore.checkAuth();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: AppRoutes.LOGIN });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
