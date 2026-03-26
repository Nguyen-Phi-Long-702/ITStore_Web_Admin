import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
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
  BarChart,
  Bar,
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
import { Download, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "../utils/statusUtils";
import { useData } from "../contexts/DataContext";

export function Reports() {
  const [timeRange, setTimeRange] = useState("week");
  const { orders, customers, productVariants, products, categories } =
    useData();

  const isRevenueOrder = (paymentStatus: string, orderStatus: string) =>
    paymentStatus === "paid" && orderStatus === "delivered";

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

    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - days);

    const inRange = (value: string, rangeStart: Date, rangeEnd: Date) => {
      const time = new Date(value).getTime();
      return time >= rangeStart.getTime() && time <= rangeEnd.getTime();
    };

    const filteredOrders = orders.filter((order) =>
      inRange(order.created_at, start, now),
    );
    const previousOrders = orders.filter((order) => {
      const time = new Date(order.created_at).getTime();
      return time >= previousStart.getTime() && time < start.getTime();
    });
    const previousRevenue = previousOrders.reduce(
      (sum, order) =>
        isRevenueOrder(order.payment_status, order.order_status)
          ? sum + order.total
          : sum,
      0,
    );
    const previousAvgOrderValue =
      previousOrders.length > 0
        ? Math.floor(previousRevenue / previousOrders.length)
        : 0;

    const filteredCustomers = customers.filter((customer) =>
      inRange(customer.created_at, start, now),
    );

    const totalRevenue = filteredOrders.reduce(
      (sum, order) =>
        isRevenueOrder(order.payment_status, order.order_status)
          ? sum + order.total
          : sum,
      0,
    );
    const totalOrders = filteredOrders.length;
    const newCustomers = filteredCustomers.length;
    const avgOrderValue =
      totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    const revenueData = (() => {
      if (timeRange === "year") {
        const monthlyMap = new Map<
          string,
          { revenue: number; sortValue: number }
        >();
        for (let i = 0; i < 12; i += 1) {
          const monthDate = new Date(
            now.getFullYear(),
            now.getMonth() - 11 + i,
            1,
          );
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
              sortValue: new Date(
                date.getFullYear(),
                date.getMonth(),
                1,
              ).getTime(),
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
        const weekMap = new Map<string, number>();

        for (let i = 0; i < 13; i += 1) {
          weekMap.set(`Tuần ${i + 1}`, 0);
        }

        filteredOrders.forEach((order) => {
          if (!isRevenueOrder(order.payment_status, order.order_status)) {
            return;
          }

          const orderDate = new Date(order.created_at).getTime();
          const dayOffset = Math.floor(
            (orderDate - start.getTime()) / (1000 * 60 * 60 * 24),
          );
          const weekIndex = Math.min(
            12,
            Math.max(0, Math.floor(dayOffset / 7)),
          );
          const weekKey = `Tuần ${weekIndex + 1}`;
          weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + order.total);
        });

        return Array.from(weekMap.entries()).map(([date, revenue], index) => ({
          date,
          revenue,
          id: `week-${index + 1}`,
        }));
      }

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
        value: filteredOrders.filter(
          (order) => order.order_status === "delivered",
        ).length,
        color: "#10b981",
        id: "status-completed",
      },
      {
        name: "Đang giao",
        value: filteredOrders.filter(
          (order) => order.order_status === "shipping",
        ).length,
        color: "#3b82f6",
        id: "status-shipping",
      },
      {
        name: "Đang xử lý",
        value: filteredOrders.filter((order) =>
          ["pending", "confirmed", "preparing", "packed"].includes(
            order.order_status,
          ),
        ).length,
        color: "#f59e0b",
        id: "status-processing",
      },
      {
        name: "Đã hủy",
        value: filteredOrders.filter(
          (order) => order.order_status === "cancelled",
        ).length,
        color: "#ef4444",
        id: "status-cancelled",
      },
    ];

    const categoryMap = new Map<number, { revenue: number; orders: number }>();
    filteredOrders.forEach((order) => {
      if (!isRevenueOrder(order.payment_status, order.order_status)) {
        return;
      }

      order.items?.forEach((item) => {
        const variant = productVariants.find((v) => v.id === item.variant_id);
        const product = variant
          ? products.find((p) => p.id === variant.product_id)
          : undefined;
        if (!product) {
          return;
        }

        const current = categoryMap.get(product.category_id) || {
          revenue: 0,
          orders: 0,
        };
        categoryMap.set(product.category_id, {
          revenue: current.revenue + item.subtotal,
          orders: current.orders + item.quantity,
        });
      });
    });

    const categoryData = Array.from(categoryMap.entries())
      .map(([categoryId, data]) => ({
        category:
          categories.find((c) => c.id === categoryId)?.name ||
          `Danh mục ${categoryId}`,
        revenue: data.revenue,
        orders: data.orders,
        id: `cat-${categoryId}`,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const topProducts = (() => {
      const productMap = new Map<
        number,
        { totalSold: number; totalRevenue: number }
      >();

      filteredOrders.forEach((order) => {
        if (!isRevenueOrder(order.payment_status, order.order_status)) {
          return;
        }

        order.items?.forEach((item) => {
          const variant = productVariants.find((v) => v.id === item.variant_id);
          if (!variant) {
            return;
          }

          const current = productMap.get(variant.product_id) || {
            totalSold: 0,
            totalRevenue: 0,
          };
          productMap.set(variant.product_id, {
            totalSold: current.totalSold + item.quantity,
            totalRevenue: current.totalRevenue + item.subtotal,
          });
        });
      });

      return Array.from(productMap.entries())
        .map(([productId, data]) => ({
          product_id: productId,
          product_name:
            products.find((product) => product.id === productId)?.name ||
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
  }, [timeRange, orders, customers, productVariants, products, categories]);

  const growth = useMemo(() => {
    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) {
        return current === 0 ? 0 : 100;
      }
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    return {
      revenue: calcGrowth(reportData.totalRevenue, reportData.previousRevenue),
      orders: calcGrowth(reportData.totalOrders, reportData.previousOrders),
      avgOrderValue: calcGrowth(
        reportData.avgOrderValue,
        reportData.previousAvgOrderValue,
      ),
      customers: calcGrowth(
        reportData.newCustomers,
        reportData.previousCustomers,
      ),
    };
  }, [reportData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Báo cáo & Thống kê
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
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.totalRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {growth.revenue > 0 ? "+" : ""}
                    {growth.revenue}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đơn hàng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reportData.totalOrders}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">
                    {growth.orders > 0 ? "+" : ""}
                    {growth.orders}%
                  </span>
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giá trị TB/Đơn</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(reportData.avgOrderValue)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-600">
                    {growth.avgOrderValue > 0 ? "+" : ""}
                    {growth.avgOrderValue}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Khách hàng mới</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reportData.newCustomers}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-600">
                    {growth.customers > 0 ? "+" : ""}
                    {growth.customers}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.revenueData} id="revenue-line-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-1" />
                <XAxis dataKey="date" key="xaxis-1" />
                <YAxis key="yaxis-1" />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  key="tooltip-1"
                />
                <Legend key="legend-1" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Doanh thu"
                  key="line-1"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.orderStatusData.map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip-pie" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.categoryData} id="category-bar-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-2" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  key="xaxis-2"
                />
                <YAxis key="yaxis-2" />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "revenue" ? formatCurrency(value) : value
                  }
                  key="tooltip-2"
                />
                <Legend key="legend-2" />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  name="Doanh thu"
                  key="bar-1"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm sắp hết hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Tồn kho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.lowStockProducts.map((variant) => (
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Xếp hạng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-right">Số lượng bán</TableHead>
                <TableHead className="text-right">Doanh thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.topProducts.map((product, index) => (
                <TableRow key={product.product_id}>
                  <TableCell>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-100 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.product_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.total_sold}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.total_revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
