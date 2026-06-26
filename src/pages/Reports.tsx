import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Package, DollarSign, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../utils/statusUtils";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { Order, ProductVariant } from "../types";

// Format ngày thành YYYY-MM-DD
function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Tính khoảng ngày dựa vào timeRange và ngày hiện tại
function getDateRange(timeRange: string): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const days =
    timeRange === "week"
      ? 7
      : timeRange === "month"
        ? 30
        : timeRange === "quarter"
          ? 90
          : 365;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return {
    dateFrom: formatDate(start),
    dateTo: formatDate(now),
  };
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

export function Reports() {
  const [timeRange, setTimeRange] = useState("week");
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockVariants, setLowStockVariants] = useState<ProductVariant[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);

  // Gọi API lấy đơn hàng theo khoảng thời gian khi timeRange thay đổi
  useEffect(() => {
    const { dateFrom, dateTo } = getDateRange(timeRange);
    setLoadingOrders(true);
    orderService
      .getByDateRange(dateFrom, dateTo)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [timeRange]);

  // Gọi API lấy danh sách sản phẩm sắp hết hàng (không phụ thuộc timeRange)
  useEffect(() => {
    setLoadingStock(true);
    productService
      .getLowStock(10)
      .then(setLowStockVariants)
      .catch(console.error)
      .finally(() => setLoadingStock(false));
  }, []);

  const reportData = useMemo(() => {
    const now = new Date();
    const days =
      timeRange === "week"
        ? 7
        : timeRange === "month"
          ? 30
          : timeRange === "quarter"
            ? 90
            : 365;

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    // Tổng doanh thu từ đơn hàng đã về từ API (đã lọc sẵn theo date range)
    const totalRevenue = orders.reduce(
      (sum, order) =>
        isRevenueOrder(order.payment_status, order.order_status)
          ? sum + order.total
          : sum,
      0,
    );

    // Tổng đơn hàng hợp lệ
    const totalOrders = orders.filter(
      (order) =>
        order.order_status === "delivered" ||
        (order.payment_status === "paid" &&
          !["cancelled", "failed"].includes(order.order_status)),
    ).length;

    const avgOrderValue =
      totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    // Build biểu đồ xu hướng doanh thu từ dữ liệu đã lấy về
    const revenueData = (() => {
      if (timeRange === "year") {
        const monthlyMap = new Map<string, { revenue: number; sortValue: number }>();
        for (let i = 0; i < 12; i += 1) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
          const key = monthDate.toLocaleDateString("vi-VN", {
            month: "2-digit",
            year: "numeric",
          });
          monthlyMap.set(key, { revenue: 0, sortValue: monthDate.getTime() });
        }
        orders.forEach((order) => {
          if (!isRevenueOrder(order.payment_status, order.order_status)) return;
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
          if (current) current.revenue += order.total;
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
        const weekMap = new Map<string, number>();
        for (let i = 0; i < 13; i += 1) {
          weekMap.set(`Tuần ${i + 1}`, 0);
        }
        orders.forEach((order) => {
          if (!isRevenueOrder(order.payment_status, order.order_status)) return;
          const orderDate = new Date(order.created_at).getTime();
          const dayOffset = Math.floor(
            (orderDate - start.getTime()) / (1000 * 60 * 60 * 24),
          );
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

      // week / month: theo ngày
      const dayMap = new Map<string, number>();
      for (let i = days - 1; i >= 0; i -= 1) {
        const day = new Date(now);
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        dayMap.set(
          day.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
          0,
        );
      }
      orders.forEach((order) => {
        if (!isRevenueOrder(order.payment_status, order.order_status)) return;
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

    // Phân bổ trạng thái đơn hàng – tính từ orders đã được lọc theo date range bởi API
    const orderStatusData = [
      {
        name: "Hoàn thành",
        value: orders.filter((o) => o.order_status === "delivered").length,
        color: "#10b981",
        id: "status-completed",
      },
      {
        name: "Đang giao",
        value: orders.filter((o) => o.order_status === "shipping").length,
        color: "#E0872B",
        id: "status-shipping",
      },
      {
        name: "Đang xử lý",
        value: orders.filter((o) =>
          ["pending", "confirmed", "preparing", "packed"].includes(o.order_status),
        ).length,
        color: "#f59e0b",
        id: "status-processing",
      },
      {
        name: "Đã hủy",
        value: orders.filter((o) => o.order_status === "cancelled").length,
        color: "#ef4444",
        id: "status-cancelled",
      },
    ];

    return {
      revenueData,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      orderStatusData,
    };
  }, [timeRange, orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Báo cáo &amp; Thống kê
          </h2>
          <p className="text-gray-600">
            Phân tích doanh thu và hiệu suất kinh doanh
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards – 3 thẻ, không có so sánh kỳ trước */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {loadingOrders ? "Đang tải..." : formatCurrency(reportData.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đơn hàng</p>
                <p className="text-2xl font-bold text-[#E0872B]">
                  {loadingOrders ? "Đang tải..." : reportData.totalOrders}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-[#E0872B] flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giá trị TB/Đơn</p>
                <p className="text-2xl font-bold text-[#E0872B]">
                  {loadingOrders ? "Đang tải..." : formatCurrency(reportData.avgOrderValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[#E0872B] flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts – 2 biểu đồ song song */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Xu hướng doanh thu */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={reportData.revenueData}
                id="revenue-line-chart"
                margin={{ top: 5, right: 16, left: 8, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" key="grid-1" />
                <XAxis
                  dataKey="date"
                  key="xaxis-1"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  key="yaxis-1"
                  width={72}
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                  key="tooltip-1"
                />
                <Legend key="legend-1" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E0872B"
                  strokeWidth={2}
                  name="Doanh thu"
                  key="line-1"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Phân bổ trạng thái đơn hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="order-status-pie-chart">
                <Pie
                  key="pie-1"
                  data={reportData.orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.orderStatusData.map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip-pie" />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sản phẩm sắp hết hàng – luôn gọi API low-stock, không phụ thuộc timeRange */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-red-600" />
            Sản phẩm sắp hết hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStock ? (
            <div className="py-8 text-center text-gray-500">Đang tải...</div>
          ) : lowStockVariants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Tất cả sản phẩm đều đủ hàng
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Tồn kho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockVariants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-mono text-sm">
                      {variant.sku}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{variant.product?.name}</p>
                        {(variant.version || variant.color) && (
                          <p className="text-sm text-gray-600">
                            {[variant.version, variant.color]
                              .filter(Boolean)
                              .join(" - ")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600 font-medium">
                        {variant.stock}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
