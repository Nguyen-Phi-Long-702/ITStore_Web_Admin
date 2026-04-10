import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit, Package, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { formatCurrency } from "../../utils/statusUtils";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

export function ProductVariantsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProductVariant } = useData();
  const product = products.find((p) => p.id.toString() === id);

  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [stockChange, setStockChange] = useState(0);
  const [stockNote, setStockNote] = useState("");

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy sản phẩm</p>
        <Button onClick={() => navigate("/products")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const handleStockUpdate = (variant: any) => {
    setSelectedVariant(variant);
    setStockChange(0);
    setStockNote("");
    setStockDialogOpen(true);
  };

  const confirmStockUpdate = () => {
    if (stockChange === 0) {
      toast.error("Vui lòng nhập số lượng thay đổi");
      return;
    }

    const newStock = selectedVariant.stock + stockChange;
    if (newStock < 0) {
      toast.error("Số lượng tồn kho không thể âm");
      return;
    }

    toast.success(
      `Đã ${stockChange > 0 ? "nhập" : "xuất"} ${Math.abs(stockChange)} sản phẩm`,
    );
    setStockDialogOpen(false);

    updateProductVariant(selectedVariant.id, {
      ...selectedVariant,
      stock: newStock,
    });
  };

  const variantsByColor = product.variants?.reduce((acc: any, variant) => {
    const key = variant.color || "Không phân loại";
    if (!acc[key]) acc[key] = [];
    acc[key].push(variant);
    return acc;
  }, {});

  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const totalValue =
    product.variants?.reduce((sum, v) => sum + v.stock * v.price, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-600">
              Quản lý biến thể và tồn kho theo màu sắc, phiên bản
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/products/edit/${product.id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa sản phẩm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {product.variants?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Tổng biến thể</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#E0872B]">{totalStock}</div>
            <p className="text-sm text-gray-600">Tổng tồn kho</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-sm text-gray-600">Giá trị kho</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(variantsByColor || {}).length}
            </div>
            <p className="text-sm text-gray-600">Màu sắc</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả biến thể</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Màu sắc</TableHead>
                <TableHead>Phiên bản</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-right">Giá gốc</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.variants?.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-mono text-sm">
                    {variant.sku}
                  </TableCell>
                  <TableCell>
                    {variant.color ? (
                      <span className="text-sm">{variant.color}</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{variant.version || "-"}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(variant.price)}
                  </TableCell>
                  <TableCell className="text-right text-gray-500">
                    {variant.compare_at_price
                      ? formatCurrency(variant.compare_at_price)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-bold ${
                        variant.stock < 10
                          ? "text-red-600"
                          : variant.stock < 20
                            ? "text-yellow-600"
                            : "text-gray-900"
                      }`}
                    >
                      {variant.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {variant.is_active ? (
                      <Badge className="bg-green-100 text-green-700">
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700">
                        Tạm dừng
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStockUpdate(variant)}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Cập nhật kho
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật tồn kho</DialogTitle>
            <DialogDescription>
              Điều chỉnh số lượng tồn kho cho biến thể đã chọn.
            </DialogDescription>
          </DialogHeader>
          {selectedVariant && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{selectedVariant.sku}</p>
                  {selectedVariant.color && (
                    <p className="text-xs text-gray-500">
                      Màu: {selectedVariant.color}
                    </p>
                  )}
                  {selectedVariant.version && (
                    <p className="text-xs text-gray-500">
                      Phiên bản: {selectedVariant.version}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    Tồn kho hiện tại:
                  </span>
                  <span className="font-bold">{selectedVariant.stock}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="stockChange">
                  Thay đổi số lượng (dương: nhập, âm: xuất) *
                </Label>
                <Input
                  id="stockChange"
                  type="number"
                  value={stockChange}
                  onChange={(e) => setStockChange(Number(e.target.value))}
                  placeholder="+10 hoặc -5"
                />
              </div>

              <div>
                <Label htmlFor="stockNote">Ghi chú</Label>
                <Input
                  id="stockNote"
                  value={stockNote}
                  onChange={(e) => setStockNote(e.target.value)}
                  placeholder="Lý do thay đổi..."
                />
              </div>

              {stockChange !== 0 && (
                <div
                  className={`p-3 rounded-lg ${
                    selectedVariant.stock + stockChange < 0
                      ? "bg-red-50"
                      : "bg-[#FFE0B2]"
                  }`}
                >
                  {selectedVariant.stock + stockChange < 0 ? (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm">
                        Lỗi: Số lượng tồn kho không thể âm
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-[#E0872B]">
                      Tồn kho sau khi {stockChange > 0 ? "nhập" : "xuất"}:{" "}
                      <span className="font-bold">
                        {selectedVariant.stock + stockChange}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmStockUpdate}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
