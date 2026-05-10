import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";
const AuthContext = createContext(undefined);
const STORAGE_KEY = "auth_user";
const TOKEN_KEY = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";
const ADMIN_PERMISSIONS = {
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
const NO_PERMISSIONS = {
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
function parseUser(raw) {
    const email = String(raw.email ?? "");
    return {
        id: Number(raw.id),
        username: String(raw.username ?? email.split("@")[0]),
        full_name: String(raw.full_name ?? raw.name ?? ""),
        email,
        role: "admin",
        avatar: (raw.avatar ?? raw.avatar_url),
        phone: (raw.phone ?? raw.phone_number),
        phone_number: (raw.phone_number ?? raw.phone),
        date_of_birth: raw.date_of_birth,
        gender: raw.gender,
        address: raw.address,
        created_at: String(raw.created_at ?? new Date().toISOString()),
    };
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const permissions = user ? ADMIN_PERMISSIONS : NO_PERMISSIONS;
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setIsLoading(false);
            return;
        }
        api
            .get("/api/users/me")
            .then((res) => {
            const raw = res?.data ?? res;
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
    const login = async (email, password) => {
        try {
            const res = await api.post("/api/auth/login", { email, password });
            const data = res?.data ?? res;
            const raw = data?.user ?? data;
            if (!raw?.id || !raw?.email)
                return false;
            if (raw.role && raw.role !== "admin")
                return false;
            const loggedUser = parseUser(raw);
            setUser(loggedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
            if (data?.access_token)
                localStorage.setItem(TOKEN_KEY, data.access_token);
            if (data?.refresh_token)
                localStorage.setItem(REFRESH_KEY, data.refresh_token);
            return true;
        }
        catch {
            return false;
        }
    };
    const logout = async () => {
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        try {
            await api.post("/api/auth/logout", { refresh_token: refreshToken });
        }
        catch { }
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
    };
    const hasPermission = (permission) => permissions[permission];
    const updateUser = async (updates) => {
        if (!user)
            return { ok: false, message: "Không tìm thấy thông tin đăng nhập" };
        try {
            if ("avatar" in updates && typeof updates.avatar === "string") {
                const blob = await fetch(updates.avatar).then((r) => r.blob());
                const form = new FormData();
                form.append("avatar", blob, "avatar.png");
                await api.patchForm("/api/users/me/avatar", form);
            }
            else {
                const payload = {};
                if (updates.full_name)
                    payload.full_name = updates.full_name;
                if (updates.phone ?? updates.phone_number) {
                    payload.phone_number = updates.phone_number ?? updates.phone;
                }
                if (Object.keys(payload).length > 0) {
                    await api.put("/api/users/me", payload);
                }
            }
            const res = await api.get("/api/users/me");
            const raw = res?.data ?? res;
            const refreshed = raw?.id ? parseUser(raw) : { ...user, ...updates };
            setUser(refreshed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
            return { ok: true };
        }
        catch (err) {
            return { ok: false, message: err?.message ?? "Không thể cập nhật thông tin" };
        }
    };
    const changePassword = async (oldPassword, newPassword) => {
        if (!user)
            return { ok: false, message: "Không tìm thấy thông tin đăng nhập" };
        try {
            await api.post("/api/auth/reset-password-user", {
                old_password: oldPassword,
                new_password: newPassword,
            });
            return { ok: true };
        }
        catch (err) {
            return { ok: false, message: err?.message ?? "Không thể đổi mật khẩu" };
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isAuthenticated: !!user,
            permissions,
            login,
            logout,
            isLoading,
            hasPermission,
            updateUser,
            changePassword,
        }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
