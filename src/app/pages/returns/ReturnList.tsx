import { useState } from "react";
import { useNavigate } from "react-router";
import { Filter, ArrowUpDown, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
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
import { formatCurrency, formatDate } from "../../utils/statusUtils";
import { ReturnStatus } from "../../types";
import { useData } from "../../contexts/DataContext";

const returnStatusConfig: Record<
  ReturnStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Chờ duyệt",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  approved: {
    label: "Đã chấp nhận",
    color: "text-[#E0872B]",
    bgColor: "bg-[#FFE0B2]",
  },
  rejected: { label: "Từ chối", color: "text-red-700", bgColor: "bg-red-100" },
  received: {
    label: "Đã nhận hàng",
    color: "text-[#E0872B]",
    bgColor: "bg-[#FFE0B2]",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
};

export function ReturnList() {
  const navigate = useNavigate();
  const { returnRequests } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  let filteredReturns = returnRequests.filter((returnRequest) => {
    const returnCode = `YC${returnRequest.id.toString().padStart(6, "0")}`;
    const orderCode = returnRequest.order_id
      ? `DH${returnRequest.order_id.toString().padStart(6, "0")}`
      : "";

    const matchesSearch =
      returnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnRequest.user?.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || returnRequest.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  filteredReturns.sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      return (b.refund_amount || 0) - (a.refund_amount || 0);
    }
  });

  const stats = {
    total: returnRequests.length,
    pending: returnRequests.filter((r) => r.status === "pending").length,
    approved: returnRequests.filter((r) => r.status === "approved").length,
    completed: returnRequests.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý trả hàng</h2>
        <p className="text-gray-600">Xử lý yêu cầu trả hàng và hoàn tiền</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Tổng yêu cầu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-sm text-gray-600">Chờ duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E0872B]">
              {stats.approved}
            </div>
            <p className="text-sm text-gray-600">Đã chấp nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-sm text-gray-600">Hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu trả hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Tìm kiếm theo mã yêu cầu hoặc mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-96"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã chấp nhận</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
                <SelectItem value="received">Đã nhận hàng</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "date" | "amount")}
            >
              <SelectTrigger className="md:w-48">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sắp xếp theo ngày</SelectItem>
                <SelectItem value="amount">Sắp xếp theo số tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã yêu cầu</TableHead>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Số tiền hoàn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      Không tìm thấy yêu cầu trả hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((returnRequest) => (
                    <TableRow key={returnRequest.id}>
                      <TableCell className="font-medium text-[#E0872B]">
                        YC{returnRequest.id.toString().padStart(6, "0")}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            navigate(`/orders/${returnRequest.order_id}`)
                          }
                          className="text-[#E0872B] hover:underline"
                        >
                          DH{returnRequest.order_id.toString().padStart(6, "0")}
                        </button>
                      </TableCell>
                      <TableCell>{returnRequest.user?.full_name}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          <p className="truncate">{returnRequest.reason}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>
                              {returnRequest.items?.length || 0} sản phẩm
                            </span>
                            {returnRequest.images &&
                              returnRequest.images.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{returnRequest.images.length} ảnh</span>
                                </>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {returnRequest.refund_amount
                          ? formatCurrency(returnRequest.refund_amount)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            returnStatusConfig[returnRequest.status].bgColor
                          } ${returnStatusConfig[returnRequest.status].color}`}
                        >
                          {returnStatusConfig[returnRequest.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(returnRequest.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/returns/${returnRequest.id}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
