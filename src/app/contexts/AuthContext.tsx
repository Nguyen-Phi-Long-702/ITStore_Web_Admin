import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: "admin";
  avatar?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  created_at: string;
}

interface Permissions {
  // Navigation
  canAccessReports: boolean;
  canAccessSettings: boolean;
  canAccessPromotions: boolean;
  canAccessReturns: boolean;
  
  // Products
  canCreateProduct: boolean;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  canManageInventory: boolean;
  
  // Categories & Brands
  canCreateCategory: boolean;
  canEditCategory: boolean;
  canDeleteCategory: boolean;
  canCreateBrand: boolean;
  canEditBrand: boolean;
  canDeleteBrand: boolean;
  
  // Orders
  canViewOrders: boolean;
  canEditOrderStatus: boolean;
  canCancelOrder: boolean;
  canProcessRefund: boolean;
  
  // Customers
  canViewCustomers: boolean;
  canEditCustomer: boolean;
  canDeleteCustomer: boolean;
  
  // Promotions
  canCreatePromotion: boolean;
  canEditPromotion: boolean;
  canDeletePromotion: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permissions;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: keyof Permissions) => boolean;
  updateUser: (updates: Partial<Omit<User, "id" | "username" | "role" | "created_at">>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for authentication
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 24521007,
    username: "admin",
    password: "admin123",
    full_name: "Nguyễn Phi Long",
    email: "24521007@gm.uit.edu.vn",
    role: "admin",
    phone: "0123456789",
    date_of_birth: "2006-02-07",
    gender: "male",
    address: "123 đường A, HCM",
    created_at: "2026-02-07T00:00:00Z",
  },
];

const AUTH_STORAGE_KEY = "auth_user";

// Permission configuration by role
const ROLE_PERMISSIONS: Record<"admin", Permissions> = {
  admin: {
    // Admin has full access
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

  // Get permissions based on user role
  const permissions: Permissions = user
    ? ROLE_PERMISSIONS[user.role]
    : {
        // Default to restrictive permissions
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

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Clean up avatar field if it exists and references figma:asset
        if (parsedUser.avatar && typeof parsedUser.avatar === 'string' && parsedUser.avatar.startsWith('figma:asset')) {
          delete parsedUser.avatar;
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasPermission = (permission: keyof Permissions): boolean => {
    return permissions[permission];
  };

  const updateUser = (updates: Partial<Omit<User, "id" | "username" | "role" | "created_at">>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (user) {
      const foundUser = MOCK_USERS.find(
        (u) => u.username === user.username && u.password === oldPassword
      );

      if (foundUser) {
        foundUser.password = newPassword;
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        return true;
      }
    }

    return false;
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