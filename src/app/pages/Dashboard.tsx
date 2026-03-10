import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  mockDashboardStats,
  mockRevenueData,
  mockTopProducts,
  mockOrders,
  mockProductVariants,
} from "../utils/mockData";
import { formatCurrency, orderStatusConfig } from "../utils/statusUtils";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export function Dashboard() {
  const stats = mockDashboardStats;
  const lowStockProducts = mockProductVariants.filter((v) => v.stock > 0 && v.stock < 10);
  const recentOrders = mockOrders.slice(0, 5);

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
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Khách hàng",
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Tổng quan hệ thống</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-sm text-gray-500">so với tuần trước</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRevenueData} id="revenue-chart">
                <CartesianGrid key="revenue-grid" strokeDasharray="3 3" />
                <XAxis key="revenue-xaxis" dataKey="date" />
                <YAxis key="revenue-yaxis" />
                <Tooltip
                  key="revenue-tooltip"
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend key="revenue-legend" />
                <Line
                  key="revenue-line"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top products chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockTopProducts} id="top-products-chart">
                <CartesianGrid key="products-grid" strokeDasharray="3 3" />
                <XAxis key="products-xaxis" dataKey="product_name" angle={-45} textAnchor="end" height={100} />
                <YAxis key="products-yaxis" />
                <Tooltip
                  key="products-tooltip"
                  formatter={(value: number, name: string) =>
                    name === "total_revenue" ? formatCurrency(value) : value
                  }
                />
                <Legend key="products-legend" />
                <Bar key="products-bar" dataKey="total_sold" fill="#10b981" name="Số lượng bán" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders and low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
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
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      DH{order.id.toString().padStart(6, '0')}
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low stock warning */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Cảnh báo tồn kho thấp
            </CardTitle>
            <Link to="/products/inventory">
              <Button variant="ghost" size="sm">
                Quản lý kho
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Tất cả sản phẩm đều đủ hàng
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
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
                      <p className="text-sm text-gray-600">
                        Tối thiểu: 10
                      </p>
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