import { useState } from "react";
import { Search, User, XCircle, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { formatCurrency } from "../../utils/statusUtils";
import { Customer } from "../../types";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

export function CustomerList() {
  const { customers, updateCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customer_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm),
  );

  const handleToggleBlock = (customer: Customer) => {
    setSelectedCustomer(customer);
    setBlockDialogOpen(true);
  };

  const confirmToggleBlock = async () => {
    if (!selectedCustomer || isUpdatingStatus) {
      return;
    }

    const newActive = !selectedCustomer.is_active;
    setIsUpdatingStatus(true);

    try {
      await updateCustomer(selectedCustomer.id, { is_active: newActive });
      toast.success(
        `Đã ${!newActive ? "khóa" : "mở khóa"} tài khoản ${
          selectedCustomer.full_name
        }`,
      );
      setBlockDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái tài khoản";
      toast.error(message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h2>
        <p className="text-gray-600">Xem và quản lý tài khoản khách hàng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {customers.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng khách hàng</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {customers.filter((c) => c.is_active).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Đang hoạt động</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {customers.filter((c) => !c.is_active).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Đã khóa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mã KH, tên, email hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách khách hàng ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KH</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Đơn hàng</TableHead>
                <TableHead className="text-right">Tổng chi tiêu</TableHead>
                <TableHead>Xác thực</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-blue-600">
                    {customer.customer_code ||
                      `KH${customer.id.toString().padStart(6, "0")}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center";
                              fallback.innerHTML =
                                '<svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                              parent.insertBefore(fallback, e.currentTarget);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{customer.full_name}</p>
                        <p className="text-sm text-gray-600">
                          ID: {customer.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-right">
                    {customer.totalOrders || 0}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(customer.totalSpent || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        customer.is_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {customer.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        customer.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {customer.is_active ? "Hoạt động" : "Vô hiệu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBlock(customer)}
                      >
                        {customer.is_active ? (
                          <XCircle className="h-4 w-4 mr-1 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                        )}
                        {customer.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCustomer?.is_active ? "Khóa" : "Mở khóa"} tài khoản
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn{" "}
              {selectedCustomer?.is_active ? "khóa" : "mở khóa"} tài khoản của "
              {selectedCustomer?.full_name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleBlock}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
