import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../components/ui/table";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import { TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "../utils/statusUtils";
import { useData } from "../contexts/DataContext";
import { orderService } from "../services/orderService";
export function Reports() {
    const [timeRange, setTimeRange] = useState("week");
    const { orders, customers, productVariants, products, categories } = useData();
    const [detailedOrders, setDetailedOrders] = useState({});
    const isRevenueOrder = (paymentStatus, orderStatus) => paymentStatus === "paid" && orderStatus === "delivered";
    useEffect(() => {
        const missingIds = orders
            .filter((o) => isRevenueOrder(o.payment_status, o.order_status))
            .map((o) => o.id)
            .filter((id) => !detailedOrders[id]);
        if (missingIds.length === 0)
            return;
        Promise.allSettled(missingIds.map((id) => orderService.getDetail(id))).then((results) => {
            setDetailedOrders((prev) => {
                const next = { ...prev };
                results.forEach((res) => {
                    if (res.status === "fulfilled" && res.value) {
                        next[res.value.id] = res.value;
                    }
                });
                return next;
            });
        });
    }, [orders]);
    const reportData = useMemo(() => {
        const now = new Date();
        const days = timeRange === "week"
            ? 7
            : timeRange === "month"
                ? 30
                : timeRange === "quarter"
                    ? 90
                    : 365;
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - (days - 1));
        const previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - days);
        const inRange = (value, rangeStart, rangeEnd) => {
            const time = new Date(value).getTime();
            return time >= rangeStart.getTime() && time <= rangeEnd.getTime();
        };
        const filteredOrders = orders.filter((order) => inRange(order.created_at, start, now));
        const previousOrders = orders.filter((order) => {
            const time = new Date(order.created_at).getTime();
            return time >= previousStart.getTime() && time < start.getTime();
        });
        const previousRevenue = previousOrders.reduce((sum, order) => isRevenueOrder(order.payment_status, order.order_status)
            ? sum + order.total
            : sum, 0);
        const previousAvgOrderValue = previousOrders.length > 0
            ? Math.floor(previousRevenue / previousOrders.length)
            : 0;
        const filteredCustomers = customers.filter((customer) => inRange(customer.created_at, start, now));
        const totalRevenue = filteredOrders.reduce((sum, order) => isRevenueOrder(order.payment_status, order.order_status)
            ? sum + order.total
            : sum, 0);
        const totalOrders = filteredOrders.filter((order) => order.order_status === "delivered" ||
            (order.payment_status === "paid" &&
                !["cancelled", "failed"].includes(order.order_status))).length;
        const newCustomers = filteredCustomers.length;
        const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;
        const revenueData = (() => {
            if (timeRange === "year") {
                const monthlyMap = new Map();
                for (let i = 0; i < 12; i += 1) {
                    const monthDate = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                    const key = monthDate.toLocaleDateString("vi-VN", {
                        month: "2-digit",
                        year: "numeric",
                    });
                    monthlyMap.set(key, { revenue: 0, sortValue: monthDate.getTime() });
                }
                filteredOrders.forEach((order) => {
                    if (!isRevenueOrder(order.payment_status, order.order_status)) {
                        return;
                    }
                    const date = new Date(order.created_at);
                    const key = date.toLocaleDateString("vi-VN", {
                        month: "2-digit",
                        year: "numeric",
                    });
                    if (!monthlyMap.has(key)) {
                        monthlyMap.set(key, {
                            revenue: 0,
                            sortValue: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
                        });
                    }
                    const current = monthlyMap.get(key);
                    if (current) {
                        current.revenue += order.total;
                    }
                });
                return Array.from(monthlyMap.entries())
                    .sort((a, b) => a[1].sortValue - b[1].sortValue)
                    .map(([date, data]) => ({
                    date,
                    revenue: data.revenue,
                    id: `month-${date.replace("/", "-")}`,
                }));
            }
            if (timeRange === "quarter") {
                const weekMap = new Map();
                for (let i = 0; i < 13; i += 1) {
                    weekMap.set(`Tuần ${i + 1}`, 0);
                }
                filteredOrders.forEach((order) => {
                    if (!isRevenueOrder(order.payment_status, order.order_status)) {
                        return;
                    }
                    const orderDate = new Date(order.created_at).getTime();
                    const dayOffset = Math.floor((orderDate - start.getTime()) / (1000 * 60 * 60 * 24));
                    const weekIndex = Math.min(12, Math.max(0, Math.floor(dayOffset / 7)));
                    const weekKey = `Tuần ${weekIndex + 1}`;
                    weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + order.total);
                });
                return Array.from(weekMap.entries()).map(([date, revenue], index) => ({
                    date,
                    revenue,
                    id: `week-${index + 1}`,
                }));
            }
            const dayMap = new Map();
            for (let i = days - 1; i >= 0; i -= 1) {
                const day = new Date(now);
                day.setHours(0, 0, 0, 0);
                day.setDate(day.getDate() - i);
                dayMap.set(day.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), 0);
            }
            filteredOrders.forEach((order) => {
                if (!isRevenueOrder(order.payment_status, order.order_status)) {
                    return;
                }
                const key = new Date(order.created_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                });
                if (dayMap.has(key)) {
                    dayMap.set(key, (dayMap.get(key) || 0) + order.total);
                }
            });
            return Array.from(dayMap.entries()).map(([date, revenue], index) => ({
                date,
                revenue,
                id: `day-${index + 1}`,
            }));
        })();
        const orderStatusData = [
            {
                name: "Hoàn thành",
                value: filteredOrders.filter((order) => order.order_status === "delivered").length,
                color: "#10b981",
                id: "status-completed",
            },
            {
                name: "Đang giao",
                value: filteredOrders.filter((order) => order.order_status === "shipping").length,
                color: "#E0872B",
                id: "status-shipping",
            },
            {
                name: "Đang xử lý",
                value: filteredOrders.filter((order) => ["pending", "confirmed", "preparing", "packed"].includes(order.order_status)).length,
                color: "#f59e0b",
                id: "status-processing",
            },
            {
                name: "Đã hủy",
                value: filteredOrders.filter((order) => order.order_status === "cancelled").length,
                color: "#ef4444",
                id: "status-cancelled",
            },
        ];
        const categoryMap = new Map();
        filteredOrders.forEach((order) => {
            if (!isRevenueOrder(order.payment_status, order.order_status)) {
                return;
            }
            const items = detailedOrders[order.id]?.items || [];
            items.forEach((item) => {
                const variant = productVariants.find((v) => v.id === item.variant_id);
                const product = variant
                    ? products.find((p) => p.id === variant.product_id)
                    : undefined;
                if (!product) {
                    return;
                }
                const categoryId = product.category_id || product.category?.id;
                if (!categoryId) {
                    return;
                }
                const current = categoryMap.get(categoryId) || {
                    revenue: 0,
                    orders: 0,
                };
                categoryMap.set(categoryId, {
                    revenue: current.revenue + Number(item.subtotal),
                    orders: current.orders + Number(item.quantity),
                });
            });
        });
        const categoryData = Array.from(categoryMap.entries())
            .map(([categoryId, data]) => ({
            category: categories.find((c) => c.id === categoryId)?.name ||
                `Danh mục ${categoryId}`,
            revenue: data.revenue,
            orders: data.orders,
            id: `cat-${categoryId}`,
        }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        const topProducts = (() => {
            const productMap = new Map();
            filteredOrders.forEach((order) => {
                if (!isRevenueOrder(order.payment_status, order.order_status)) {
                    return;
                }
                const items = detailedOrders[order.id]?.items || [];
                items.forEach((item) => {
                    const variant = productVariants.find((v) => v.id === item.variant_id);
                    if (!variant) {
                        return;
                    }
                    const current = productMap.get(variant.product_id) || {
                        totalSold: 0,
                        totalRevenue: 0,
                    };
                    productMap.set(variant.product_id, {
                        totalSold: current.totalSold + Number(item.quantity),
                        totalRevenue: current.totalRevenue + Number(item.subtotal),
                    });
                });
            });
            return Array.from(productMap.entries())
                .map(([productId, data]) => ({
                product_id: productId,
                product_name: products.find((product) => product.id === productId)?.name ||
                    `SP-${productId}`,
                total_sold: data.totalSold,
                total_revenue: data.totalRevenue,
            }))
                .sort((a, b) => b.total_sold - a.total_sold)
                .slice(0, 5);
        })();
        const lowStockProducts = productVariants
            .filter((variant) => variant.stock > 0 && variant.stock < 10)
            .slice(0, 5);
        return {
            revenueData,
            totalRevenue,
            totalOrders,
            avgOrderValue,
            newCustomers,
            orderStatusData,
            categoryData,
            topProducts,
            lowStockProducts,
            previousRevenue,
            previousOrders: previousOrders.length,
            previousAvgOrderValue,
            previousCustomers: customers.filter((customer) => {
                const time = new Date(customer.created_at).getTime();
                return time >= previousStart.getTime() && time < start.getTime();
            }).length,
        };
    }, [timeRange, orders, customers, productVariants, products, categories, detailedOrders]);
    const growth = useMemo(() => {
        const calcGrowth = (current, previous) => {
            if (previous === 0) {
                return current === 0 ? 0 : 100;
            }
            return Number((((current - previous) / previous) * 100).toFixed(1));
        };
        return {
            revenue: calcGrowth(reportData.totalRevenue, reportData.previousRevenue),
            orders: calcGrowth(reportData.totalOrders, reportData.previousOrders),
            avgOrderValue: calcGrowth(reportData.avgOrderValue, reportData.previousAvgOrderValue),
            customers: calcGrowth(reportData.newCustomers, reportData.previousCustomers),
        };
    }, [reportData]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "B\u00E1o c\u00E1o & Th\u1ED1ng k\u00EA" }), _jsx("p", { className: "text-gray-600", children: "Ph\u00E2n t\u00EDch doanh thu v\u00E0 hi\u1EC7u su\u1EA5t kinh doanh" })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Select, { value: timeRange, onValueChange: setTimeRange, children: [_jsx(SelectTrigger, { className: "w-40", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "week", children: "7 ng\u00E0y qua" }), _jsx(SelectItem, { value: "month", children: "30 ng\u00E0y qua" }), _jsx(SelectItem, { value: "quarter", children: "Qu\u00FD n\u00E0y" }), _jsx(SelectItem, { value: "year", children: "N\u0103m nay" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "T\u1ED5ng doanh thu" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: formatCurrency(reportData.totalRevenue) }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }), _jsxs("span", { className: "text-sm text-green-600", children: [growth.revenue > 0 ? "+" : "", growth.revenue, "%"] })] })] }), _jsx(DollarSign, { className: "h-8 w-8 text-green-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "\u0110\u01A1n h\u00E0ng" }), _jsx("p", { className: "text-2xl font-bold text-[#E0872B]", children: reportData.totalOrders }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-[#E0872B]" }), _jsxs("span", { className: "text-sm text-[#E0872B]", children: [growth.orders > 0 ? "+" : "", growth.orders, "%"] })] })] }), _jsx(Package, { className: "h-8 w-8 text-[#E0872B]" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Gi\u00E1 tr\u1ECB TB/\u0110\u01A1n" }), _jsx("p", { className: "text-2xl font-bold text-[#E0872B]", children: formatCurrency(reportData.avgOrderValue) }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-[#E0872B]" }), _jsxs("span", { className: "text-sm text-[#E0872B]", children: [growth.avgOrderValue > 0 ? "+" : "", growth.avgOrderValue, "%"] })] })] }), _jsx(DollarSign, { className: "h-8 w-8 text-[#E0872B]" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Kh\u00E1ch h\u00E0ng m\u1EDBi" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: reportData.newCustomers }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-orange-600" }), _jsxs("span", { className: "text-sm text-orange-600", children: [growth.customers > 0 ? "+" : "", growth.customers, "%"] })] })] }), _jsx(Users, { className: "h-8 w-8 text-orange-600" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Xu h\u01B0\u1EDBng doanh thu" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: reportData.revenueData, id: "revenue-line-chart", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }, "grid-1"), _jsx(XAxis, { dataKey: "date" }, "xaxis-1"), _jsx(YAxis, {}, "yaxis-1"), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }, "tooltip-1"), _jsx(Legend, {}, "legend-1"), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#E0872B", strokeWidth: 2, name: "Doanh thu" }, "line-1")] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Ph\u00E2n b\u1ED5 tr\u1EA1ng th\u00E1i \u0111\u01A1n h\u00E0ng" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { id: "order-status-pie-chart", children: [_jsx(Pie, { data: reportData.orderStatusData, cx: "50%", cy: "50%", labelLine: false, label: (entry) => `${entry.name}: ${entry.value}`, outerRadius: 100, fill: "#8884d8", dataKey: "value", children: reportData.orderStatusData.map((entry) => (_jsx(Cell, { fill: entry.color }, `cell-${entry.id}`))) }, "pie-1"), _jsx(Tooltip, {}, "tooltip-pie")] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Doanh thu theo danh m\u1EE5c" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: reportData.categoryData, id: "category-bar-chart", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }, "grid-2"), _jsx(XAxis, { dataKey: "category", angle: -45, textAnchor: "end", height: 100 }, "xaxis-2"), _jsx(YAxis, {}, "yaxis-2"), _jsx(Tooltip, { formatter: (value, name) => name === "revenue" ? formatCurrency(value) : value }, "tooltip-2"), _jsx(Legend, {}, "legend-2"), _jsx(Bar, { dataKey: "revenue", fill: "#10b981", name: "Doanh thu" }, "bar-1")] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "S\u1EA3n ph\u1EA9m s\u1EAFp h\u1EBFt h\u00E0ng" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "SKU" }), _jsx(TableHead, { children: "S\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { className: "text-right", children: "T\u1ED3n kho" })] }) }), _jsx(TableBody, { children: reportData.lowStockProducts.map((variant) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-mono text-sm", children: variant.sku }), _jsx(TableCell, { children: _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: variant.product?.name }), (variant.version || variant.color) && (_jsx("p", { className: "text-sm text-gray-600", children: [variant.version, variant.color]
                                                                        .filter(Boolean)
                                                                        .join(" - ") }))] }) }), _jsx(TableCell, { className: "text-right", children: _jsx("span", { className: "text-red-600 font-medium", children: variant.stock }) })] }, variant.id))) })] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "S\u1EA3n ph\u1EA9m b\u00E1n ch\u1EA1y nh\u1EA5t" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "X\u1EBFp h\u1EA1ng" }), _jsx(TableHead, { children: "S\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { className: "text-right", children: "S\u1ED1 l\u01B0\u1EE3ng b\u00E1n" }), _jsx(TableHead, { className: "text-right", children: "Doanh thu" })] }) }), _jsx(TableBody, { children: reportData.topProducts.map((product, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : index === 1
                                                            ? "bg-gray-100 text-gray-700"
                                                            : index === 2
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-[#FFE0B2] text-[#E0872B]"}`, children: index + 1 }) }), _jsx(TableCell, { className: "font-medium", children: product.product_name }), _jsx(TableCell, { className: "text-right", children: product.total_sold }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(product.total_revenue) })] }, product.product_id))) })] }) })] })] }));
}
