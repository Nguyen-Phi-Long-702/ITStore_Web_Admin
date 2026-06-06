import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  formatCurrency,
  formatDate,
  paymentGatewayStatusConfig,
  paymentMethodLabels,
} from "../../utils/statusUtils";
import { paymentService } from "../../services/paymentService";
import type { PaymentHistoryItem } from "../../types";

export function PaymentList() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const params: Record<string, any> = { page: currentPage, limit: 10 };
        if (statusFilter !== "all") params.payment_status = statusFilter;
        if (methodFilter !== "all") params.method = methodFilter;
        const parsed = parseInt(userIdSearch.trim(), 10);
        if (!isNaN(parsed)) params.user_id = parsed;
        const res = await paymentService.getAll(params);
        setPayments(res.data);
        setPagination(res.pagination);
      } catch {
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [currentPage, statusFilter, methodFilter, userIdSearch]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lịch sử thanh toán</h2>
        <p className="text-gray-600">Quản lý và theo dõi toàn bộ giao dịch thanh toán</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thành công</p>
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter((p) => p.payment_status === "success").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {payments.filter((p) => p.payment_status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thất bại / Hoàn tiền</p>
                <p className="text-2xl font-bold text-red-600">
                  {payments.filter(
                    (p) => p.payment_status === "failed" || p.payment_status === "refunded",
                  ).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo ID người dùng..."
                value={userIdSearch}
                onChange={(e) => {
                  setUserIdSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={methodFilter}
              onValueChange={(val) => {
                setMethodFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="cod">COD</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-[#E0872B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã GD</TableHead>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Không có giao dịch nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">#{payment.id}</TableCell>
                        <TableCell>
                          <Link
                            to={`/orders/${payment.order_id}`}
                            className="text-[#E0872B] hover:underline font-medium"
                          >
                            DH{payment.order_id.toString().padStart(6, "0")}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {payment.order?.user?.full_name || "-"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {payment.order?.user?.email || ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {paymentMethodLabels[payment.method] ?? payment.method}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${paymentGatewayStatusConfig[payment.payment_status].bgColor} ${paymentGatewayStatusConfig[payment.payment_status].color}`}
                          >
                            {paymentGatewayStatusConfig[payment.payment_status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(payment.created_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {payment.paid_at ? formatDate(payment.paid_at) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Trang {pagination.page} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasMore}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}