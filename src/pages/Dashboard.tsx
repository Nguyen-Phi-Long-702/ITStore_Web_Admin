import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency, orderStatusConfig } from "../utils/statusUtils";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { Order, ProductVariant, RevenueData } from "../types";

// Tính ngày đầu tuần (Thứ Hai) và cuối tuần (Chủ Nhật) của ngày hiện tại
function getCurrentWeekRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = CN, 1 = T2, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return { dateFrom: fmt(monday), dateTo: fmt(sunday) };
}

// Rút gọn số tiền cho trục Y biểu đồ
function formatYAxis(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}tr`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

const isRevenueOrder = (paymentStatus: string, orderStatus: string) =>
  paymentStatus === "paid" && (orderStatus === "delivered" || orderStatus === "received");

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockVariants, setLowStockVariants] = useState<ProductVariant[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);

  useEffect(() => {
    const { dateFrom, dateTo } = getCurrentWeekRange();
    setLoadingOrders(true);
    orderService
      .getByDateRange(dateFrom, dateTo)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoadingOrders(false));

    setLoadingStock(true);
    productService
      .getLowStock(10)
      .then(setLowStockVariants)
      .catch(console.error)
      .finally(() => setLoadingStock(false));
  }, []);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5),
    [orders],
  );

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) =>
        isRevenueOrder(order.payment_status, order.order_status)
          ? sum + order.total
          : sum,
      0,
    );

    return {
      totalRevenue,
      totalOrders: orders.length,
    };
  }, [orders]);

  // Build biểu đồ doanh thu 7 ngày của tuần hiện tại
  const revenueData = useMemo<RevenueData[]>(() => {
    const { dateFrom } = getCurrentWeekRange();
    const weekStart = new Date(dateFrom + "T00:00:00");
    const result: RevenueData[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const dayOrders = orders.filter((order) => {
        const time = new Date(order.created_at).getTime();
        return time >= day.getTime() && time < nextDay.getTime();
      });

      const dayRevenue = dayOrders.reduce(
        (sum, order) =>
          isRevenueOrder(order.payment_status, order.order_status)
            ? sum + order.total
            : sum,
        0,
      );

      result.push({
        date: day.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }),
        revenue: dayRevenue,
        orders: dayOrders.length,
        id: `revenue-${day.getTime()}`,
      });
    }

    return result;
  }, [orders]);

  const statCards = [
    {
      title: "Doanh thu tuần này",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Đơn hàng tuần này",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-[#E0872B]",
      bgColor: "bg-[#FFE0B2]",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Tổng quan hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">
                    {loadingOrders ? (
                      <span className="text-gray-400">Đang tải...</span>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu tuần này</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueData}
              id="revenue-chart"
              margin={{ top: 5, right: 16, left: 8, bottom: 5 }}
            >
              <CartesianGrid key="revenue-grid" strokeDasharray="3 3" />
              <XAxis
                key="revenue-xaxis"
                dataKey="date"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                key="revenue-yaxis"
                width={72}
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                key="revenue-tooltip"
                formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
              />
              <Legend key="revenue-legend" />
              <Line
                key="revenue-line"
                type="monotone"
                dataKey="revenue"
                stroke="#E0872B"
                strokeWidth={2}
                name="Doanh thu"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <Link to="/orders">
              <Button variant="ghost" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="py-8 text-center text-gray-500">Đang tải...</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Không có đơn hàng nào trong tuần này
                  </p>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <Link
                          to={`/orders/${order.id}`}
                          className="font-medium hover:text-[#E0872B]"
                        >
                          DH{order.id.toString().padStart(6, "0")}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {order.user?.full_name}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                      </div>
                      <Badge
                        className={`${orderStatusConfig[order.order_status].bgColor} ${
                          orderStatusConfig[order.order_status].color
                        }`}
                      >
                        {orderStatusConfig[order.order_status].label}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Cảnh báo tồn kho thấp
            </CardTitle>
            <Link to="/products/stock">
              <Button variant="ghost" size="sm">
                Quản lý kho
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingStock ? (
              <div className="py-8 text-center text-gray-500">Đang tải...</div>
            ) : lowStockVariants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Tất cả sản phẩm đều đủ hàng
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockVariants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                        {(variant as any).variant_image ? (
                          <img
                            src={(variant as any).variant_image}
                            alt={variant.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{variant.product?.name}</p>
                        <p className="text-sm text-gray-600">
                          {variant.sku}
                          {variant.version && ` - ${variant.version}`}
                          {variant.color && ` - ${variant.color}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-medium">
                        Còn {variant.stock}
                      </p>
                      <p className="text-sm text-gray-600">Tối thiểu: 10</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
