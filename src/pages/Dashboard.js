import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, } from "../components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, AlertTriangle, } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import { formatCurrency, orderStatusConfig } from "../utils/statusUtils";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { useData } from "../contexts/DataContext";
export function Dashboard() {
    const { orders, customers, productVariants, products } = useData();
    const isRevenueOrder = (paymentStatus, orderStatus) => paymentStatus === "paid" && orderStatus === "delivered";
    const recentOrders = useMemo(() => [...orders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5), [orders]);
    const lowStockProducts = useMemo(() => productVariants.filter((v) => v.stock > 0 && v.stock < 10), [productVariants]);
    const stats = useMemo(() => {
        const now = new Date();
        const currentStart = new Date(now);
        currentStart.setHours(0, 0, 0, 0);
        currentStart.setDate(currentStart.getDate() - 6);
        const previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - 7);
        const previousEnd = new Date(currentStart);
        const inRange = (dateValue, start, end) => {
            const date = new Date(dateValue).getTime();
            return date >= start.getTime() && date < end.getTime();
        };
        const currentOrders = orders.filter((order) => inRange(order.created_at, currentStart, now));
        const previousOrders = orders.filter((order) => inRange(order.created_at, previousStart, previousEnd));
        const currentRevenue = currentOrders.reduce((sum, order) => isRevenueOrder(order.payment_status, order.order_status)
            ? sum + order.total
            : sum, 0);
        const previousRevenue = previousOrders.reduce((sum, order) => isRevenueOrder(order.payment_status, order.order_status)
            ? sum + order.total
            : sum, 0);
        const currentCustomers = customers.filter((customer) => inRange(customer.created_at, currentStart, now)).length;
        const previousCustomers = customers.filter((customer) => inRange(customer.created_at, previousStart, previousEnd)).length;
        const pendingStatuses = new Set([
            "pending",
            "confirmed",
            "preparing",
            "packed",
            "shipping",
        ]);
        const currentPending = currentOrders.filter((order) => pendingStatuses.has(order.order_status)).length;
        const previousPending = previousOrders.filter((order) => pendingStatuses.has(order.order_status)).length;
        const calcChange = (current, previous) => {
            if (previous === 0) {
                return current === 0 ? 0 : 100;
            }
            return Number((((current - previous) / previous) * 100).toFixed(1));
        };
        return {
            totalRevenue: orders.reduce((sum, order) => isRevenueOrder(order.payment_status, order.order_status)
                ? sum + order.total
                : sum, 0),
            totalOrders: orders.length,
            totalCustomers: customers.length,
            pendingOrders: orders.filter((order) => pendingStatuses.has(order.order_status)).length,
            revenueChange: calcChange(currentRevenue, previousRevenue),
            ordersChange: calcChange(currentOrders.length, previousOrders.length),
            customersChange: calcChange(currentCustomers, previousCustomers),
            pendingChange: calcChange(currentPending, previousPending),
            lowStockProducts: lowStockProducts.length,
        };
    }, [orders, customers, lowStockProducts.length]);
    const revenueData = useMemo(() => {
        const result = [];
        for (let i = 6; i >= 0; i -= 1) {
            const day = new Date();
            day.setHours(0, 0, 0, 0);
            day.setDate(day.getDate() - i);
            const nextDay = new Date(day);
            nextDay.setDate(nextDay.getDate() + 1);
            const dayOrders = orders.filter((order) => {
                const time = new Date(order.created_at).getTime();
                return time >= day.getTime() && time < nextDay.getTime();
            });
            const dayRevenue = dayOrders.reduce((sum, order) => isRevenueOrder(order.payment_status, order.order_status)
                ? sum + order.total
                : sum, 0);
            result.push({
                date: day.toLocaleDateString("vi-VN", { weekday: "short" }),
                revenue: dayRevenue,
                orders: dayOrders.length,
                id: `revenue-${day.getTime()}`,
            });
        }
        return result;
    }, [orders]);
    const topProducts = useMemo(() => {
        const salesByProduct = new Map();
        orders.forEach((order) => {
            if (!isRevenueOrder(order.payment_status, order.order_status)) {
                return;
            }
            order.items?.forEach((item) => {
                const variant = productVariants.find((v) => v.id === item.variant_id);
                if (!variant) {
                    return;
                }
                const productId = variant.product_id;
                const current = salesByProduct.get(productId) || {
                    total_sold: 0,
                    total_revenue: 0,
                };
                salesByProduct.set(productId, {
                    total_sold: current.total_sold + item.quantity,
                    total_revenue: current.total_revenue + item.subtotal,
                });
            });
        });
        return Array.from(salesByProduct.entries())
            .map(([product_id, sales]) => ({
            product_id,
            product_name: products.find((product) => product.id === product_id)?.name ||
                `SP-${product_id}`,
            total_sold: sales.total_sold,
            total_revenue: sales.total_revenue,
        }))
            .sort((a, b) => b.total_sold - a.total_sold)
            .slice(0, 5);
    }, [orders, productVariants, products]);
    const statCards = [
        {
            title: "Doanh thu",
            value: formatCurrency(stats.totalRevenue),
            change: stats.revenueChange,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Đơn hàng",
            value: stats.totalOrders.toString(),
            change: stats.ordersChange,
            icon: ShoppingCart,
            color: "text-[#E0872B]",
            bgColor: "bg-[#FFE0B2]",
        },
        {
            title: "Khách hàng",
            value: stats.totalCustomers.toString(),
            change: stats.customersChange,
            icon: Users,
            color: "text-[#E0872B]",
            bgColor: "bg-[#FFE0B2]",
        },
        {
            title: "Chờ xử lý",
            value: stats.pendingOrders.toString(),
            change: stats.pendingChange,
            icon: Package,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }), _jsx("p", { className: "text-gray-600", children: "T\u1ED5ng quan h\u1EC7 th\u1ED1ng" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: statCards.map((stat) => (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: stat.title }), _jsx("p", { className: "text-2xl font-bold", children: stat.value }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [stat.change > 0 ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsxs("span", { className: `text-sm ${stat.change > 0 ? "text-green-600" : "text-red-600"}`, children: [Math.abs(stat.change), "%"] }), _jsx("span", { className: "text-sm text-gray-500", children: "so v\u1EDBi tu\u1EA7n tr\u01B0\u1EDBc" })] })] }), _jsx("div", { className: `${stat.bgColor} p-3 rounded-lg`, children: _jsx(stat.icon, { className: `h-6 w-6 ${stat.color}` }) })] }) }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Doanh thu 7 ng\u00E0y" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: revenueData, id: "revenue-chart", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }, "revenue-grid"), _jsx(XAxis, { dataKey: "date" }, "revenue-xaxis"), _jsx(YAxis, {}, "revenue-yaxis"), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }, "revenue-tooltip"), _jsx(Legend, {}, "revenue-legend"), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#E0872B", strokeWidth: 2, name: "Doanh thu" }, "revenue-line")] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "S\u1EA3n ph\u1EA9m b\u00E1n ch\u1EA1y" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: topProducts, id: "top-products-chart", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }, "products-grid"), _jsx(XAxis, { dataKey: "product_name", angle: -45, textAnchor: "end", height: 100 }, "products-xaxis"), _jsx(YAxis, {}, "products-yaxis"), _jsx(Tooltip, { formatter: (value, name) => name === "total_revenue" ? formatCurrency(value) : value }, "products-tooltip"), _jsx(Legend, {}, "products-legend"), _jsx(Bar, { dataKey: "total_sold", fill: "#10b981", name: "S\u1ED1 l\u01B0\u1EE3ng b\u00E1n" }, "products-bar")] }) }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsx(CardTitle, { children: "\u0110\u01A1n h\u00E0ng g\u1EA7n \u0111\u00E2y" }), _jsx(Link, { to: "/orders", children: _jsx(Button, { variant: "ghost", size: "sm", children: "Xem t\u1EA5t c\u1EA3" }) })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: recentOrders.map((order) => (_jsxs("div", { className: "flex items-center justify-between pb-4 border-b last:border-0 last:pb-0", children: [_jsxs("div", { className: "flex-1", children: [_jsxs(Link, { to: `/orders/${order.id}`, className: "font-medium hover:text-[#E0872B]", children: ["DH", order.id.toString().padStart(6, "0")] }), _jsx("p", { className: "text-sm text-gray-600", children: order.user?.full_name })] }), _jsx("div", { className: "text-right mr-4", children: _jsx("p", { className: "font-medium", children: formatCurrency(order.total) }) }), _jsx(Badge, { className: `${orderStatusConfig[order.order_status].bgColor} ${orderStatusConfig[order.order_status].color}`, children: orderStatusConfig[order.order_status].label })] }, order.id))) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-red-600" }), "C\u1EA3nh b\u00E1o t\u1ED3n kho th\u1EA5p"] }), _jsx(Link, { to: "/products/inventory", children: _jsx(Button, { variant: "ghost", size: "sm", children: "Qu\u1EA3n l\u00FD kho" }) })] }), _jsx(CardContent, { children: lowStockProducts.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "T\u1EA5t c\u1EA3 s\u1EA3n ph\u1EA9m \u0111\u1EC1u \u0111\u1EE7 h\u00E0ng" })) : (_jsx("div", { className: "space-y-4", children: lowStockProducts.map((variant) => (_jsxs("div", { className: "flex items-center justify-between pb-4 border-b last:border-0 last:pb-0", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center", children: _jsx(Package, { className: "h-6 w-6 text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: variant.product?.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [variant.sku, variant.version && ` - ${variant.version}`, variant.color && ` - ${variant.color}`] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-red-600 font-medium", children: ["C\u00F2n ", variant.stock] }), _jsx("p", { className: "text-sm text-gray-600", children: "T\u1ED1i thi\u1EC3u: 10" })] })] }, variant.id))) })) })] })] })] }));
}
