import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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

export function PromotionList() {
  const { coupons, deleteCoupon } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${code}"?`)) {
      deleteCoupon(id);
      toast.success("Đã xóa mã giảm giá");
    }
  };

  const isExpired = (promotion: typeof coupons[0]) => {
    return !!(promotion.expires_at && new Date(promotion.expires_at) < new Date());
  };

  const isOutOfUses = (promotion: typeof coupons[0]) => {
    return !!(
      promotion.max_uses !== undefined &&
      promotion.max_uses !== null &&
      promotion.max_uses > 0 &&
      (promotion.used_count || 0) >= promotion.max_uses
    );
  };

  const getStatusBadge = (promotion: typeof coupons[0]) => {
    if (isExpired(promotion)) {
      return <Badge className="bg-rose-100 text-rose-700">Đã hết hạn</Badge>;
    }

    if (isOutOfUses(promotion)) {
      return <Badge className="bg-orange-100 text-orange-700">Đã hết lượt</Badge>;
    }

    if (!promotion.is_active) {
      return <Badge className="bg-slate-100 text-slate-700">Tạm dừng</Badge>;
    }

    return <Badge className="bg-emerald-100 text-emerald-700">Đang chạy</Badge>;
  };

  const getStatusOrder = (promotion: typeof coupons[0]) => {
    if (isExpired(promotion)) return 3;
    if (isOutOfUses(promotion)) return 2;
    if (!promotion.is_active) return 1;
    return 0;
  };

  const isActuallyActive = (promotion: typeof coupons[0]) => {
    if (isExpired(promotion)) return false;
    if (isOutOfUses(promotion)) return false;
    if (!promotion.is_active) return false;
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
        <Link to="/promotions/new">
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
              <p className="text-3xl font-bold text-blue-600">
                {coupons.reduce((sum, c) => sum + (c.used_count || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Lượt sử dụng</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {coupons
                  .filter((c) => isActuallyActive(c))
                  .reduce(
                    (sum, c) =>
                      sum +
                      (c.max_uses && c.max_uses > 0
                        ? Math.max(0, c.max_uses - (c.used_count || 0))
                        : 0),
                    0
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
              {sortedCoupons.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <p className="font-medium font-mono">{promotion.code}</p>
                  </TableCell>
                  <TableCell>
                    {promotion.discount_type === "percent" ? "Phần trăm" : "Cố định"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {promotion.discount_type === "percent"
                      ? `${promotion.discount_value}%`
                      : formatCurrency(promotion.discount_value)}
                  </TableCell>
                  <TableCell>
                    {promotion.min_order_value 
                      ? formatCurrency(promotion.min_order_value) 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {promotion.used_count || 0} / {promotion.max_uses || "∞"}
                      </p>
                      {promotion.max_uses && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((promotion.used_count || 0) / promotion.max_uses) * 100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {promotion.expires_at 
                      ? formatDateOnly(promotion.expires_at)
                      : "Không giới hạn"}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(promotion)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/promotions/edit/${promotion.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(promotion.id, promotion.code)}
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
    </div>
  );
}
