import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, NavLink, useNavigate, Navigate, useLocation, } from "react-router";
import { LayoutDashboard, Package, ShoppingCart, Users, Percent, BarChart3, Menu, LogOut, ChevronDown, RotateCcw, Tag, FolderOpen, User, Lock, } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { toast } from "sonner";
export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, permissions, isAuthenticated, isLoading } = useAuth();
    const { orders, returnRequests } = useData();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pendingOrderCount = orders.filter((order) => ["pending", "confirmed", "preparing", "packed", "shipping"].includes(order.order_status)).length;
    const pendingReturnCount = returnRequests.filter((request) => ["pending", "approved", "received"].includes(request.status)).length;
    const formatNavBadge = (count) => {
        if (count <= 0) {
            return null;
        }
        return count > 99 ? "99+" : String(count);
    };
    const orderBadge = formatNavBadge(pendingOrderCount);
    const returnBadge = formatNavBadge(pendingReturnCount);
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block h-12 w-12 border-4 border-[#E0872B] border-t-transparent rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-gray-600", children: "\u0110ang t\u1EA3i..." })] }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    const handleLogout = async () => {
        await logout();
        toast.success("Đã đăng xuất thành công!");
        navigate("/login");
    };
    const navigation = [
        { name: "Tổng quan", href: "/", icon: LayoutDashboard, show: true },
        { name: "Sản phẩm", href: "/products", icon: Package, show: true },
        { name: "Thương hiệu", href: "/brands", icon: Tag, show: true },
        { name: "Danh mục", href: "/categories", icon: FolderOpen, show: true },
        {
            name: "Đơn hàng",
            href: "/orders",
            icon: ShoppingCart,
            badge: orderBadge,
            show: permissions.canViewOrders,
        },
        {
            name: "Trả hàng",
            href: "/returns",
            icon: RotateCcw,
            badge: returnBadge,
            show: permissions.canAccessReturns,
        },
        {
            name: "Khách hàng",
            href: "/customers",
            icon: Users,
            show: permissions.canViewCustomers,
        },
        {
            name: "Khuyến mãi",
            href: "/promotions",
            icon: Percent,
            show: permissions.canAccessPromotions,
        },
        {
            name: "Báo cáo",
            href: "/reports",
            icon: BarChart3,
            show: permissions.canAccessReports,
        },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("aside", { className: `${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`, children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-4 border-b border-gray-200", children: [sidebarOpen && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-[#E0872B] rounded-lg flex items-center justify-center text-white font-bold", children: "I" }), _jsx("span", { className: "font-bold text-lg", children: "IT Store" })] })), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSidebarOpen(!sidebarOpen), children: _jsx(Menu, { className: "h-5 w-5" }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4", children: _jsx("ul", { className: "space-y-1 px-2", children: navigation.map((item) => item.show && (_jsx("li", { children: _jsxs(NavLink, { to: item.href, end: item.href === "/", className: ({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? "bg-[#FFE0B2] text-[#E0872B]"
                                        : "text-gray-700 hover:bg-gray-100"}`, children: [_jsx(item.icon, { className: "h-5 w-5 flex-shrink-0" }), sidebarOpen && (_jsxs(_Fragment, { children: [_jsx("span", { className: "flex-1", children: item.name }), item.badge && (_jsx(Badge, { variant: "destructive", children: item.badge }))] }))] }) }, item.name))) }) })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Qu\u1EA3n tr\u1ECB h\u1EC7 th\u1ED1ng" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Ch\u00E0o m\u1EEBng tr\u1EDF l\u1EA1i, ", user?.full_name || "Admin"] })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", className: "flex items-center gap-2", children: [user?.avatar ? (_jsx("img", { src: user.avatar, alt: user.full_name, className: "w-8 h-8 rounded-full object-cover" })) : (_jsx("div", { className: "w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium", children: _jsx(User, { className: "h-5 w-5" }) })), _jsxs("div", { className: "hidden md:block text-left", children: [_jsx("p", { className: "text-sm font-medium", children: user?.full_name }), _jsx("p", { className: "text-xs text-gray-500 capitalize", children: user?.role })] }), _jsx(ChevronDown, { className: "h-4 w-4" })] }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [_jsx(DropdownMenuLabel, { children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("p", { className: "text-sm font-medium", children: user?.full_name }), _jsx("p", { className: "text-xs text-gray-500", children: user?.email })] }) }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: () => navigate("/account"), children: [_jsx(User, { className: "h-4 w-4 mr-2" }), "T\u00E0i kho\u1EA3n"] }), _jsxs(DropdownMenuItem, { onClick: () => navigate("/account?action=change-password"), children: [_jsx(Lock, { className: "h-4 w-4 mr-2" }), "\u0110\u1ED5i m\u1EADt kh\u1EA9u"] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "text-red-600", onClick: handleLogout, children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "\u0110\u0103ng xu\u1EA5t"] })] })] }) })] }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsx(Outlet, {}) })] })] }));
}
