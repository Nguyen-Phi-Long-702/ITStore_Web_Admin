import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../lib/api";

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: "admin";
  avatar?: string;
  phone?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  created_at: string;
}

interface Permissions {
  canAccessReports: boolean;
  canAccessSettings: boolean;
  canAccessPromotions: boolean;
  canAccessReturns: boolean;
  canCreateProduct: boolean;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  canManageInventory: boolean;
  canCreateCategory: boolean;
  canEditCategory: boolean;
  canDeleteCategory: boolean;
  canCreateBrand: boolean;
  canEditBrand: boolean;
  canDeleteBrand: boolean;
  canViewOrders: boolean;
  canEditOrderStatus: boolean;
  canCancelOrder: boolean;
  canProcessRefund: boolean;
  canViewCustomers: boolean;
  canEditCustomer: boolean;
  canDeleteCustomer: boolean;
  canCreatePromotion: boolean;
  canEditPromotion: boolean;
  canDeletePromotion: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permissions;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: keyof Permissions) => boolean;
  updateUser: (
    updates: Partial<Omit<User, "id" | "username" | "role" | "created_at" | "email">>,
  ) => Promise<{ ok: boolean; message?: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_user";
const TOKEN_KEY = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";

const ADMIN_PERMISSIONS: Permissions = {
  canAccessReports: true,
  canAccessSettings: true,
  canAccessPromotions: true,
  canAccessReturns: true,
  canCreateProduct: true,
  canEditProduct: true,
  canDeleteProduct: true,
  canManageInventory: true,
  canCreateCategory: true,
  canEditCategory: true,
  canDeleteCategory: true,
  canCreateBrand: true,
  canEditBrand: true,
  canDeleteBrand: true,
  canViewOrders: true,
  canEditOrderStatus: true,
  canCancelOrder: true,
  canProcessRefund: true,
  canViewCustomers: true,
  canEditCustomer: true,
  canDeleteCustomer: true,
  canCreatePromotion: true,
  canEditPromotion: true,
  canDeletePromotion: true,
};

const NO_PERMISSIONS: Permissions = {
  canAccessReports: false,
  canAccessSettings: false,
  canAccessPromotions: false,
  canAccessReturns: false,
  canCreateProduct: false,
  canEditProduct: false,
  canDeleteProduct: false,
  canManageInventory: false,
  canCreateCategory: false,
  canEditCategory: false,
  canDeleteCategory: false,
  canCreateBrand: false,
  canEditBrand: false,
  canDeleteBrand: false,
  canViewOrders: false,
  canEditOrderStatus: false,
  canCancelOrder: false,
  canProcessRefund: false,
  canViewCustomers: false,
  canEditCustomer: false,
  canDeleteCustomer: false,
  canCreatePromotion: false,
  canEditPromotion: false,
  canDeletePromotion: false,
};

function parseUser(raw: Record<string, unknown>): User {
  const email = String(raw.email ?? "");
  return {
    id: Number(raw.id),
    username: String(raw.username ?? email.split("@")[0]),
    full_name: String(raw.full_name ?? raw.name ?? ""),
    email,
    role: "admin",
    avatar: (raw.avatar ?? raw.avatar_url) as string | undefined,
    phone: (raw.phone ?? raw.phone_number) as string | undefined,
    phone_number: (raw.phone_number ?? raw.phone) as string | undefined,
    date_of_birth: raw.date_of_birth as string | undefined,
    gender: raw.gender as User["gender"],
    address: raw.address as string | undefined,
    created_at: String(raw.created_at ?? new Date().toISOString()),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = user ? ADMIN_PERMISSIONS : NO_PERMISSIONS;

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get<Record<string, unknown>>("/api/users/me")
      .then((res) => {
        const raw = (res as any)?.data ?? res;
        if (raw?.id && raw?.email) {
          const parsed = parseUser(raw);
          setUser(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post<any>("/api/auth/login", { email, password });
      const data = res?.data ?? res;
      const raw = data?.user ?? data;
      if (!raw?.id || !raw?.email) return false;
      if (raw.role && raw.role !== "admin") return false;

      const loggedUser = parseUser(raw);
      setUser(loggedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      if (data?.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
      if (data?.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    try {
      await api.post("/api/auth/logout", { refresh_token: refreshToken });
    } catch {}
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  const hasPermission = (permission: keyof Permissions) => permissions[permission];

  const updateUser = async (
    updates: Partial<Omit<User, "id" | "username" | "role" | "created_at" | "email">>,
  ): Promise<{ ok: boolean; message?: string }> => {
    if (!user) return { ok: false, message: "Không tìm thấy thông tin đăng nhập" };

    try {
      if ("avatar" in updates && typeof updates.avatar === "string") {
        const blob = await fetch(updates.avatar).then((r) => r.blob());
        const form = new FormData();
        form.append("avatar", blob, "avatar.png");
        await api.patchForm("/api/users/me/avatar", form);
      } else {
        const payload: Record<string, unknown> = {};
        if (updates.full_name) payload.full_name = updates.full_name;
        if (updates.phone ?? updates.phone_number) {
          payload.phone_number = updates.phone_number ?? updates.phone;
        }
        if (Object.keys(payload).length > 0) {
          await api.put("/api/users/me", payload);
        }
      }

      const res = await api.get<any>("/api/users/me");
      const raw = res?.data ?? res;
      const refreshed = raw?.id ? parseUser(raw) : { ...user, ...updates };
      setUser(refreshed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? "Không thể cập nhật thông tin" };
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<{ ok: boolean; message?: string }> => {
    if (!user) return { ok: false, message: "Không tìm thấy thông tin đăng nhập" };

    try {
      await api.post("/api/auth/reset-password-user", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? "Không thể đổi mật khẩu" };
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        login,
        logout,
        isLoading,
        hasPermission,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
