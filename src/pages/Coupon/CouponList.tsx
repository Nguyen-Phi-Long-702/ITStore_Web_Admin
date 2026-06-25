import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2, Percent, BarChart2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { formatCurrency, formatDateOnly } from "../../utils/statusUtils";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
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

export function CouponList() {
  const { coupons, deleteCoupon, fetchCoupons } = useData();

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);       
  const [couponToDelete, setCouponToDelete] = useState<{ id: number; code: string } | null>(null); 
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number, code: string) => {
    setCouponToDelete({ id, code });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteCoupon(couponToDelete.id);
      toast.success("Đã xóa mã giảm giá");
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      toast.error("Không thể xóa mã giảm giá");
    } finally {
      setIsDeleting(false);
    }
  };

  const isExpired = (coupon: (typeof coupons)[0]) => {
    return !!(
      coupon.expires_at && new Date(coupon.expires_at) < new Date()
    );
  };

  const isOutOfUses = (coupon: (typeof coupons)[0]) => {
    return !!(
      coupon.max_uses !== undefined &&
      coupon.max_uses !== null &&
      coupon.max_uses > 0 &&
      (coupon.used_count || 0) >= coupon.max_uses
    );
  };

  const getStatusBadge = (coupon: (typeof coupons)[0]) => {
    if (isExpired(coupon)) {
      return <Badge className="bg-rose-100 text-rose-700">Đã hết hạn</Badge>;
    }

    if (isOutOfUses(coupon)) {
      return (
        <Badge className="bg-orange-100 text-orange-700">Đã hết lượt</Badge>
      );
    }

    if (!coupon.is_active) {
      return <Badge className="bg-slate-100 text-slate-700">Tạm dừng</Badge>;
    }

    return <Badge className="bg-emerald-100 text-emerald-700">Đang chạy</Badge>;
  };

  const getStatusOrder = (coupon: (typeof coupons)[0]) => {
    if (isExpired(coupon)) return 3;
    if (isOutOfUses(coupon)) return 2;
    if (!coupon.is_active) return 1;
    return 0;
  };

  const isActuallyActive = (coupon: (typeof coupons)[0]) => {
    if (isExpired(coupon)) return false;
    if (isOutOfUses(coupon)) return false;
    if (!coupon.is_active) return false;
    return true;
  };

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    const statusOrderDiff = getStatusOrder(a) - getStatusOrder(b);
    if (statusOrderDiff !== 0) {
      return statusOrderDiff;
    }

    const aCreatedAt = new Date(a.created_at).getTime();
    const bCreatedAt = new Date(b.created_at).getTime();
    return bCreatedAt - aCreatedAt;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý khuyến mãi
          </h2>
          <p className="text-gray-600">Tạo và quản lý mã giảm giá</p>
        </div>
        <Link to="/coupon/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo mã giảm giá
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {coupons.filter((c) => isActuallyActive(c)).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Đang chạy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#E0872B]">
                {coupons.reduce((sum, c) => sum + (c.used_count || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Lượt sử dụng</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#E0872B]">
                {coupons
                  .filter((c) => isActuallyActive(c))
                  .reduce(
                    (sum, c) =>
                      sum +
                      (c.max_uses && c.max_uses > 0
                        ? Math.max(0, c.max_uses - (c.used_count || 0))
                        : 0),
                    0,
                  )}
              </p>
              <p className="text-sm text-gray-600 mt-1">Còn khả dụng</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mã giảm giá..."
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
            Danh sách mã giảm giá ({filteredCoupons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giảm giá</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Đơn tối thiểu</TableHead>
                <TableHead>Sử dụng</TableHead>
                <TableHead>Hết hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <p className="font-medium font-mono">{coupon.code}</p>
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === "percent"
                      ? "Phần trăm"
                      : "Cố định"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {coupon.discount_type === "percent"
                      ? `${coupon.discount_value}%`
                      : formatCurrency(coupon.discount_value)}
                  </TableCell>
                  <TableCell>
                    {coupon.min_order_value
                      ? formatCurrency(coupon.min_order_value)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {coupon.used_count || 0} /{" "}
                        {coupon.max_uses || "∞"}
                      </p>
                      {coupon.max_uses && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-[#E0872B] h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((coupon.used_count || 0) /
                                    coupon.max_uses) *
                                    100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.expires_at
                      ? formatDateOnly(coupon.expires_at)
                      : "Không giới hạn"}
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/coupon/edit/${coupon.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(coupon.id, coupon.code)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa mã giảm giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mã "{couponToDelete?.code}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
