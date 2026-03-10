import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
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
import {
  Download,
  TrendingUp,
  Package,
  DollarSign,
  Users,
} from "lucide-react";
import {
  mockRevenueData,
  mockTopProducts,
  mockProductVariants,
} from "../utils/mockData";
import { formatCurrency } from "../utils/statusUtils";

export function Reports() {
  const [timeRange, setTimeRange] = useState("week");

  // Generate data based on time range
  const reportData = useMemo(() => {
    const multiplier = {
      week: 1,
      month: 4,
      quarter: 12,
      year: 48,
    }[timeRange] || 1;

    // Generate revenue data based on time range
    const generateRevenueData = () => {
      const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : timeRange === "quarter" ? 90 : 365;
      const data = [];
      const baseRevenue = 6000000;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const variation = Math.random() * 0.3 + 0.85; // 85% - 115%
        data.push({
          date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
          revenue: Math.floor(baseRevenue * variation * (timeRange === "year" ? 7 : timeRange === "quarter" ? 2 : 1)),
          timestamp: date.getTime(), // Add timestamp for unique identification
        });
      }
      
      // Group data for better visualization if needed
      if (timeRange === "year") {
        // Group by month
        const monthlyData: { [key: string]: { revenue: number; timestamp: number } } = {};
        data.forEach((item) => {
          const monthKey = item.date.split("/")[1] + "/" + item.date.split("/")[2];
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { revenue: 0, timestamp: item.timestamp };
          }
          monthlyData[monthKey].revenue += item.revenue;
        });
        return Object.entries(monthlyData).map(([date, data]) => ({ 
          date, 
          revenue: data.revenue,
          id: `month-${date.replace('/', '-')}-${data.timestamp}`
        }));
      } else if (timeRange === "quarter") {
        // Group by week
        const weeklyData: { [key: string]: { revenue: number; weekNum: number } } = {};
        data.forEach((item, index) => {
          const weekNum = Math.floor(index / 7) + 1;
          const weekKey = `Tuần ${weekNum}`;
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { revenue: 0, weekNum };
          }
          weeklyData[weekKey].revenue += item.revenue;
        });
        return Object.entries(weeklyData).map(([date, data]) => ({ 
          date, 
          revenue: data.revenue,
          id: `week-${data.weekNum}`
        }));
      }
      
      return data.map((item, index) => ({ 
        date: item.date,
        revenue: item.revenue,
        id: `day-${item.timestamp}`
      }));
    };

    const totalRevenue = timeRange === "week" 
      ? 45678000 
      : timeRange === "month" 
      ? 182450000 
      : timeRange === "quarter" 
      ? 523890000 
      : 2145600000;

    const totalOrders = timeRange === "week" 
      ? 234 
      : timeRange === "month" 
      ? 945 
      : timeRange === "quarter" 
      ? 2856 
      : 11345;

    const newCustomers = timeRange === "week" 
      ? 23 
      : timeRange === "month" 
      ? 89 
      : timeRange === "quarter" 
      ? 267 
      : 1045;

    const orderStatusData = [
      { 
        name: "Hoàn thành", 
        value: Math.floor(156 * multiplier), 
        color: "#10b981",
        id: "status-completed"
      },
      { 
        name: "Đang giao", 
        value: Math.floor(42 * multiplier), 
        color: "#3b82f6",
        id: "status-shipping"
      },
      { 
        name: "Đang xử lý", 
        value: Math.floor(28 * multiplier), 
        color: "#f59e0b",
        id: "status-processing"
      },
      { 
        name: "Đã hủy", 
        value: Math.floor(8 * multiplier), 
        color: "#ef4444",
        id: "status-cancelled"
      },
    ];

    const categoryData = [
      { 
        category: "Vi điều khiển", 
        revenue: Math.floor(12500000 * multiplier), 
        orders: Math.floor(85 * multiplier),
        id: "cat-microcontroller"
      },
      { 
        category: "Cảm biến", 
        revenue: Math.floor(8900000 * multiplier), 
        orders: Math.floor(132 * multiplier),
        id: "cat-sensor"
      },
      { 
        category: "Module điều khiển", 
        revenue: Math.floor(6700000 * multiplier), 
        orders: Math.floor(95 * multiplier),
        id: "cat-module"
      },
      { 
        category: "Led", 
        revenue: Math.floor(5200000 * multiplier), 
        orders: Math.floor(178 * multiplier),
        id: "cat-led"
      },
      { 
        category: "Động cơ", 
        revenue: Math.floor(4800000 * multiplier), 
        orders: Math.floor(64 * multiplier),
        id: "cat-motor"
      },
    ];

    return {
      revenueData: generateRevenueData(),
      totalRevenue,
      totalOrders,
      avgOrderValue: Math.floor(totalRevenue / totalOrders),
      newCustomers,
      orderStatusData,
      categoryData,
    };
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h2>
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

      {/* Summary cards */}
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
                  <span className="text-sm text-green-600">+12.5%</span>
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
                <p className="text-2xl font-bold text-blue-600">{reportData.totalOrders}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">+8.3%</span>
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
                  <span className="text-sm text-purple-600">+5.2%</span>
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
                <p className="text-2xl font-bold text-orange-600">{reportData.newCustomers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-600">+15.2%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend */}
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
                <Tooltip formatter={(value: number) => formatCurrency(value)} key="tooltip-1" />
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

        {/* Order status */}
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
                  {reportData.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip-pie" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.categoryData} id="category-bar-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-2" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} key="xaxis-2" />
                <YAxis key="yaxis-2" />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "revenue" ? formatCurrency(value) : value
                  }
                  key="tooltip-2"
                />
                <Legend key="legend-2" />
                <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" key="bar-1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low stock products */}
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
                {mockProductVariants
                  .filter((v) => v.stock > 0 && v.stock < 10)
                  .slice(0, 5)
                  .map((variant) => (
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

      {/* Top products */}
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
              {mockTopProducts.map((product, index) => (
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