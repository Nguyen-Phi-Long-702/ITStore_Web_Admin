import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
    updates: Partial<
      Omit<User, "id" | "username" | "role" | "created_at" | "email">
    >,
  ) => Promise<{ ok: boolean; message?: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "auth_user";
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "auth_refresh_token";
const API_BASE_URL = "http://localhost:3000";
const PASSWORD_ENDPOINT_METHODS = ["POST", "PATCH", "PUT"] as const;
const PASSWORD_PROFILE_METHODS = ["PATCH", "PUT", "POST"] as const;

function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

function getAuthHeaders(headers?: HeadersInit): HeadersInit {
  const rawToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const token = rawToken?.trim();
  if (!token || token === "undefined" || token === "null") {
    if (rawToken) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
    return headers ?? {};
  }

  return {
    ...(headers ?? {}),
    Authorization: `Bearer ${token}`,
  };
}

type AuthPayload = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  user?: any;
  data?: {
    access_token?: string;
    accessToken?: string;
    token?: string;
    refresh_token?: string;
    refreshToken?: string;
    user?: any;
  };
};

function firstNonEmptyString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return null;
}

function resolveCreatedAtValue(raw: any): string | null {
  return firstNonEmptyString(
    raw?.created_at,
    raw?.createdAt,
    raw?.created_date,
    raw?.createdDate,
    raw?.data?.created_at,
    raw?.data?.createdAt,
    raw?.data?.created_date,
    raw?.data?.createdDate,
  );
}

function resolveAccessToken(payload: AuthPayload | any): string | null {
  return firstNonEmptyString(
    payload?.access_token,
    payload?.accessToken,
    payload?.token,
    payload?.jwt,
    payload?.bearerToken,
    payload?.data?.access_token,
    payload?.data?.accessToken,
    payload?.data?.token,
    payload?.data?.jwt,
    payload?.data?.bearerToken,
    payload?.tokens?.access_token,
    payload?.tokens?.accessToken,
    payload?.tokens?.token,
    payload?.data?.tokens?.access_token,
    payload?.data?.tokens?.accessToken,
    payload?.data?.tokens?.token,
    payload?.auth?.access_token,
    payload?.auth?.accessToken,
    payload?.auth?.token,
    payload?.data?.auth?.access_token,
    payload?.data?.auth?.accessToken,
    payload?.data?.auth?.token,
  );
}

function resolveRefreshToken(payload: AuthPayload | any): string | null {
  return firstNonEmptyString(
    payload?.refresh_token,
    payload?.refreshToken,
    payload?.data?.refresh_token,
    payload?.data?.refreshToken,
    payload?.tokens?.refresh_token,
    payload?.tokens?.refreshToken,
    payload?.data?.tokens?.refresh_token,
    payload?.data?.tokens?.refreshToken,
    payload?.auth?.refresh_token,
    payload?.auth?.refreshToken,
    payload?.data?.auth?.refresh_token,
    payload?.data?.auth?.refreshToken,
  );
}

function toAdminUser(raw: any): User | null {
  if (!raw?.id || !raw?.email) {
    return null;
  }

  if (raw.role && raw.role !== "admin") {
    return null;
  }

  const fallbackUsername =
    typeof raw.email === "string" && raw.email.includes("@")
      ? raw.email.split("@")[0]
      : `admin-${raw.id}`;

  return {
    id: raw.id,
    username: raw.username || fallbackUsername,
    full_name: raw.full_name || raw.name || fallbackUsername,
    email: raw.email,
    role: "admin",
    avatar: raw.avatar || raw.avatar_url,
    phone: raw.phone || raw.phone_number || raw.phoneNumber,
    phone_number: raw.phone_number || raw.phoneNumber || raw.phone,
    date_of_birth: raw.date_of_birth,
    gender: raw.gender,
    address: raw.address,
    created_at: resolveCreatedAtValue(raw) || new Date().toISOString(),
  };
}

function extractRawUser(payload: any): any {
  return (
    payload?.user ??
    payload?.data?.user ??
    payload?.data?.profile ??
    payload?.profile ??
    payload?.data ??
    payload
  );
}

async function fetchCurrentUser(userId?: number): Promise<User | null> {
  const endpoints = [
    ...(userId
      ? [
          `/api/admin/users/${userId}`,
          `/admins/${userId}`,
          `/api/users/${userId}`,
        ]
      : []),
    "/api/users/me",
    "/users/me",
    "/api/admin/users/me",
    "/api/admin/profile",
    "/admins/me",
    "/api/auth/me",
    "/auth/me",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json().catch(() => null)) as any;
      const userFromApi = toAdminUser(extractRawUser(payload));
      if (userFromApi) {
        return userFromApi;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function toCamelPayload(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  if (Object.prototype.hasOwnProperty.call(input, "full_name")) {
    output.fullName = input.full_name;
  }
  if (Object.prototype.hasOwnProperty.call(input, "date_of_birth")) {
    output.dateOfBirth = input.date_of_birth;
  }
  if (Object.prototype.hasOwnProperty.call(input, "phone")) {
    output.phone = input.phone;
  }
  if (Object.prototype.hasOwnProperty.call(input, "gender")) {
    output.gender = input.gender;
  }
  if (Object.prototype.hasOwnProperty.call(input, "address")) {
    output.address = input.address;
  }
  if (Object.prototype.hasOwnProperty.call(input, "avatar")) {
    output.avatar = input.avatar;
    output.avatarUrl = input.avatar;
  }

  return output;
}

function toAdminApiPayload(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  if (Object.prototype.hasOwnProperty.call(input, "full_name")) {
    output.full_name = input.full_name;
    output.fullName = input.full_name;
  }
  if (Object.prototype.hasOwnProperty.call(input, "phone")) {
    output.phone = input.phone;
    output.phone_number = input.phone;
    output.phoneNumber = input.phone;
  }
  if (Object.prototype.hasOwnProperty.call(input, "avatar")) {
    output.avatar = input.avatar;
    output.avatar_url = input.avatar;
    output.avatarUrl = input.avatar;
  }

  return output;
}

function collectApiError(payload: any, status: number): string {
  const candidates = [
    payload?.message,
    payload?.error,
    payload?.errors?.message,
    Array.isArray(payload?.errors) ? payload.errors.join(", ") : null,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return `HTTP ${status}`;
}

function clearAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

async function postAuth(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<any | null> {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json().catch(() => null)) as
      | AuthPayload
      | any;

    if (!response.ok) {
      return payload;
    }

    return payload;
  } catch {
    return null;
  }
}

const ROLE_PERMISSIONS: Record<"admin", Permissions> = {
  admin: {
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
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions: Permissions = user
    ? ROLE_PERMISSIONS[user.role]
    : {
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

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      try {
        const rawToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
        const token = rawToken?.trim();
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        let parsedUser: User | null = null;

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (
              parsed?.avatar &&
              typeof parsed.avatar === "string" &&
              parsed.avatar.startsWith("figma:asset")
            ) {
              delete parsed.avatar;
            }
            parsedUser = parsed;
            if (mounted) {
              setUser(parsed);
            }
          } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }

        if (!token || token === "undefined" || token === "null") {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
          if (mounted) {
            setUser(null);
          }
          return;
        }

        const backendUser = await fetchCurrentUser(parsedUser?.id);
        if (backendUser) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(backendUser));
          if (mounted) {
            setUser(backendUser);
          }
        } else if (!parsedUser) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          if (mounted) {
            setUser(null);
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const endpoints = [
      "/api/auth/login",
      "/auth/login",
      "/admins/login",
      "/login",
    ];

    for (const endpoint of endpoints) {
      const payload = await postAuth(endpoint, { email, password });
      const rawUser = payload?.user ?? payload?.data?.user ?? payload;
      const userFromApi = toAdminUser(rawUser);

      if (!userFromApi) {
        continue;
      }

      const accessToken = resolveAccessToken(payload);
      const refreshToken = resolveRefreshToken(payload);

      const backendUser = await fetchCurrentUser(userFromApi.id);
      const finalUser = backendUser ?? userFromApi;

      setUser(finalUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(finalUser));
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
      }
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      }
      return true;
    }

    return false;
  };

  const logout = async (): Promise<void> => {
    const endpoints = ["/api/auth/logout", "/auth/logout", "/logout"];
    const refreshToken = localStorage
      .getItem(REFRESH_TOKEN_STORAGE_KEY)
      ?.trim();
    const payload = refreshToken
      ? { refresh_token: refreshToken, refreshToken }
      : {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(buildApiUrl(endpoint), {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          break;
        }

        if (response.status === 404) {
          continue;
        }
      } catch {
        continue;
      }
    }

    setUser(null);
    clearAuthState();
  };

  const hasPermission = (permission: keyof Permissions): boolean => {
    return permissions[permission];
  };

  const updateUser = async (
    updates: Partial<
      Omit<User, "id" | "username" | "role" | "created_at" | "email">
    >,
  ): Promise<{ ok: boolean; message?: string }> => {
    if (!user) {
      return { ok: false, message: "Không tìm thấy thông tin đăng nhập" };
    }

    const hasAvatarUpdate = Object.prototype.hasOwnProperty.call(
      updates,
      "avatar",
    );

    if (hasAvatarUpdate) {
      const avatarValue = updates.avatar;
      const avatarFormData = new FormData();

      if (typeof avatarValue === "string" && avatarValue.trim().length > 0) {
        try {
          const avatarBlob = await fetch(avatarValue).then((response) =>
            response.blob(),
          );
          avatarFormData.append("avatar", avatarBlob, "avatar.png");
        } catch {
          return { ok: false, message: "Không thể xử lý ảnh đại diện" };
        }
      }

      const avatarEndpoints = ["/api/users/me/avatar", "/users/me/avatar"];

      for (const endpoint of avatarEndpoints) {
        try {
          const response = await fetch(buildApiUrl(endpoint), {
            method: "PATCH",
            credentials: "include",
            headers: getAuthHeaders(),
            body: avatarFormData,
          });

          if (!response.ok) {
            const errorPayload = (await response.json().catch(() => null)) as any;
            return { ok: false, message: collectApiError(errorPayload, response.status) };
          }

          const backendUser = await fetchCurrentUser(user.id);
          const mergedUser: User = backendUser
            ? backendUser
            : { ...user, avatar: typeof avatarValue === "string" ? avatarValue : undefined };

          setUser(mergedUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mergedUser));
          return { ok: true };
        } catch {
          continue;
        }
      }

      return { ok: false, message: "Không thể cập nhật ảnh đại diện" };
    }

    const nextUser = { ...user, ...updates };
    const requestPayload: Record<string, unknown> = {};

    const fullNameValue =
      typeof nextUser.full_name === "string" ? nextUser.full_name.trim() : "";
    if (fullNameValue && fullNameValue !== user.full_name) {
      requestPayload.full_name = fullNameValue;
    }

    const nextPhoneValue =
      updates.phone_number ?? updates.phone ?? nextUser.phone_number ?? nextUser.phone;
    const currentPhoneValue = user.phone_number ?? user.phone ?? null;
    const normalizedNextPhone =
      typeof nextPhoneValue === "string"
        ? nextPhoneValue.trim()
        : nextPhoneValue ?? null;

    if (normalizedNextPhone !== currentPhoneValue && normalizedNextPhone !== null) {
      requestPayload.phone_number = normalizedNextPhone;
    }

    const updatesRecord = updates as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(updatesRecord, "setting")) {
      requestPayload.setting = updatesRecord.setting ?? null;
    }

    if (Object.keys(requestPayload).length === 0) {
      return { ok: true };
    }

    const endpoints = ["/api/users/me", "/users/me"];

    const methods: RequestInit["method"][] = ["PUT"];
    let lastError = "Không thể cập nhật thông tin";
    let hasUnauthorized = false;

    for (const endpoint of endpoints) {
      for (const method of methods) {
        try {
          const response = await fetch(buildApiUrl(endpoint), {
            method,
            credentials: "include",
            headers: getAuthHeaders({
              "Content-Type": "application/json",
            }),
            body: JSON.stringify(requestPayload),
          });

          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              hasUnauthorized = true;
            }
            const errorPayload = (await response.json().catch(() => null)) as any;
            lastError = collectApiError(errorPayload, response.status);
            continue;
          }

          const payload = (await response.json().catch(() => null)) as any;
          const parsedUser = toAdminUser(extractRawUser(payload));
          const backendUser = await fetchCurrentUser(user.id);

          const mergedUser: User = backendUser
            ? backendUser
            : parsedUser
              ? parsedUser
              : {
                  ...user,
                  ...requestPayload,
                };

          setUser(mergedUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mergedUser));
          return { ok: true };
        } catch {
          lastError = "Không thể kết nối backend";
          continue;
        }
      }
    }

    if (hasUnauthorized) {
      return {
        ok: false,
        message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
      };
    }

    return { ok: false, message: lastError };
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<{ ok: boolean; message?: string }> => {
    if (!user) {
      return { ok: false, message: "Không tìm thấy thông tin đăng nhập" };
    }

    try {
      const verifyPayload = await postAuth("/api/auth/login", {
        email: user.email,
        password: oldPassword,
      });
      const verifiedUser = toAdminUser(extractRawUser(verifyPayload));

      if (!verifiedUser || verifiedUser.id !== user.id) {
        return { ok: false, message: "Mật khẩu cũ không chính xác" };
      }

      const dedicatedEndpoints = [
        "/users/me/password",
        "/api/users/me/password",
        `/api/admin/users/${user.id}/password`,
        "/api/admin/change-password",
        "/api/auth/change-password",
        "/auth/change-password",
        "/api/users/change-password",
      ];

      const dedicatedPayloads = [
        {
          user_id: user.id,
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          userId: user.id,
          oldPassword,
          newPassword,
        },
        {
          current_password: oldPassword,
          new_password: newPassword,
        },
        {
          currentPassword: oldPassword,
          newPassword,
        },
      ];

      const fallbackProfileEndpoints = [
        `/api/admin/users/${user.id}`,
        "/api/admin/users/me",
        "/api/admin/profile",
      ];

      const fallbackPayloads = [
        { password: newPassword },
        { new_password: newPassword },
        { newPassword },
        { user: { password: newPassword } },
        { data: { password: newPassword } },
      ];

      let lastError = "Không thể đổi mật khẩu";
      let unauthorized = false;
      let allNotFound = true;

      for (const endpoint of dedicatedEndpoints) {
        for (const method of PASSWORD_ENDPOINT_METHODS) {
          for (const payload of dedicatedPayloads) {
            const response = await fetch(buildApiUrl(endpoint), {
              method,
              credentials: "include",
              headers: getAuthHeaders({
                "Content-Type": "application/json",
              }),
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              return { ok: true };
            }

            if (response.status !== 404) {
              allNotFound = false;
            }

            if (response.status === 401 || response.status === 403) {
              unauthorized = true;
            }

            const errorPayload = (await response
              .json()
              .catch(() => null)) as any;
            const currentError = collectApiError(errorPayload, response.status);
            if (currentError) {
              lastError = currentError;
            }
          }
        }
      }

      for (const endpoint of fallbackProfileEndpoints) {
        for (const method of PASSWORD_PROFILE_METHODS) {
          for (const payload of fallbackPayloads) {
            const response = await fetch(buildApiUrl(endpoint), {
              method,
              credentials: "include",
              headers: getAuthHeaders({
                "Content-Type": "application/json",
              }),
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              return { ok: true };
            }

            if (response.status !== 404) {
              allNotFound = false;
            }

            if (response.status === 401 || response.status === 403) {
              unauthorized = true;
            }

            const errorPayload = (await response
              .json()
              .catch(() => null)) as any;
            const currentError = collectApiError(errorPayload, response.status);
            if (currentError) {
              lastError = currentError;
            }
          }
        }
      }

      if (unauthorized) {
        return {
          ok: false,
          message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
        };
      }

      if (allNotFound) {
        return {
          ok: false,
          message: "Không tìm thấy endpoint đổi mật khẩu phù hợp.",
        };
      }

      return { ok: false, message: lastError };
    } catch {
      return { ok: false, message: "Không thể kết nối backend" };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    permissions,
    login,
    logout,
    isLoading,
    hasPermission,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
