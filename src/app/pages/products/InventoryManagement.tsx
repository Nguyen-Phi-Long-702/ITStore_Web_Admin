import { useState } from "react";
import { ArrowLeft, Plus, AlertTriangle, Package, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { formatCurrency } from "../../utils/statusUtils";
import { Product } from "../../types";
import { ColorSwatch } from "../../components/products/ColorSwatch";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

export function InventoryManagement() {
  const navigate = useNavigate();
  const { products, updateProductVariant } = useData();
  const [stockInDialogOpen, setStockInDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");

  const lowStockProducts = products.filter(
    (p) =>
      p.variants &&
      p.variants.some((v) => v.stock > 0 && v.stock < 10)
  );

  const handleStockIn = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants?.[0]?.id.toString() || "");
    setQuantity(0);
    setNote("");
    setStockInDialogOpen(true);
  };

  const confirmStockIn = () => {
    if (!quantity || quantity <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    if (!selectedVariant) {
      toast.error("Vui lòng chọn biến thể");
      return;
    }

    const variant = selectedProduct?.variants?.find(
      (v) => v.id.toString() === selectedVariant
    );
    
    if (variant) {
      updateProductVariant(variant.id, {
        stock: variant.stock + quantity,
      });
      
      toast.success(
        `Đã nhập ${quantity} ${selectedProduct?.name}${
          variant?.color ? ` - ${variant.color}` : ""
        }${variant?.version ? ` - ${variant.version}` : ""} vào kho`
      );
    }
    
    setStockInDialogOpen(false);
    setSelectedProduct(null);
    setSelectedVariant("");
    setQuantity(0);
    setNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý tồn kho</h2>
          <p className="text-gray-600">
            Nhập hàng và theo dõi cảnh báo tồn kho
          </p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo: {lowStockProducts.length} sản phẩm sắp hết hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => {
                const lowStockVariants = product.variants?.filter(
                  (v) => v.stock > 0 && v.stock < 10
                );
                const totalStock = product.variants
                  ? product.variants.reduce((sum, v) => sum + v.stock, 0)
                  : 0;
                return (
                  <div
                    key={product.id}
                    className="bg-white p-3 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {lowStockVariants?.length} biến thể sắp hết
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-red-600 font-medium">
                            Còn {totalStock}
                          </p>
                        </div>
                        <Button onClick={() => handleStockIn(product)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nhập hàng
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lowStockVariants?.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded text-sm"
                        >
                          {variant.color_hex && (
                            <ColorSwatch
                              color={variant.color}
                              colorHex={variant.color_hex}
                              size="sm"
                            />
                          )}
                          <span className="text-gray-700">
                            {variant.color || variant.version || variant.sku}
                          </span>
                          <span className="font-bold text-red-600">
                            ({variant.stock})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tồn kho tất cả sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã sản phẩm</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Màu sắc</TableHead>
                <TableHead>Phiên bản</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead className="text-right">Giá</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.flatMap((product) => {
                const variants = product.variants || [];
                if (variants.length === 0) return null;

                return variants.map((variant, variantIndex) => {
                  const isFirstVariant = variantIndex === 0;
                  const stockStatus = variant.stock < 10 ? 'low' : variant.stock < 20 ? 'medium' : 'ok';

                  return (
                    <TableRow key={`${product.id}-${variant.id}`}>
                      {isFirstVariant && (
                        <TableCell rowSpan={variants.length} className="font-medium text-blue-600">
                          {product.product_code || `SP${product.id.toString().padStart(6, "0")}`}
                        </TableCell>
                      )}
                      
                      {isFirstVariant && (
                        <TableCell rowSpan={variants.length}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {variants.length} biến thể
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      )}

                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {variant.sku}
                        </code>
                      </TableCell>

                      <TableCell>
                        {variant.color ? (
                          <div className="flex items-center gap-2">
                            {variant.color_hex && (
                              <ColorSwatch
                                color={variant.color}
                                colorHex={variant.color_hex}
                                size="sm"
                              />
                            )}
                            <span className="text-sm">{variant.color}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {variant.version ? (
                          <Badge variant="outline" className="text-xs">
                            {variant.version}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>

                      {isFirstVariant && (
                        <TableCell rowSpan={variants.length}>
                          <Badge variant="outline">
                            {product.category?.name || "-"}
                          </Badge>
                        </TableCell>
                      )}

                      {isFirstVariant && (
                        <TableCell rowSpan={variants.length}>
                          <div className="flex items-center gap-2">
                            {product.brand?.logo_url ? (
                              <img
                                src={product.brand.logo_url}
                                alt={product.brand.name}
                                className="h-6 w-6 object-contain"
                              />
                            ) : null}
                            <span className="text-sm">{product.brand?.name || "-"}</span>
                          </div>
                        </TableCell>
                      )}

                      <TableCell className="text-right">
                        <div>
                          <p className="font-semibold text-blue-600">
                            {formatCurrency(variant.price)}
                          </p>
                          {variant.compare_at_price && variant.compare_at_price > variant.price && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatCurrency(variant.compare_at_price)}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div>
                          <p className={`font-bold ${
                            stockStatus === 'low' ? 'text-red-600' :
                            stockStatus === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {variant.stock}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tối thiểu: 10
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {variant.stock === 0 ? (
                          <Badge className="bg-red-100 text-red-700">
                            Hết hàng
                          </Badge>
                        ) : variant.stock < 10 ? (
                          <Badge className="bg-red-100 text-red-700">
                            Cần nhập
                          </Badge>
                        ) : variant.stock < 20 ? (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            Sắp hết
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">
                            Đủ hàng
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/products/variants/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedVariant(variant.id.toString());
                              setQuantity(0);
                              setNote("");
                              setStockInDialogOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={stockInDialogOpen} onOpenChange={setStockInDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nhập hàng vào kho</DialogTitle>
            <DialogDescription>
              Nhập thông tin phiếu nhập kho cho sản phẩm đã chọn.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedProduct.category?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tổng tồn kho hiện tại:{" "}
                    {selectedProduct.variants
                      ? selectedProduct.variants.reduce((sum, v) => sum + v.stock, 0)
                      : 0}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="variant">Chọn biến thể *</Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger id="variant">
                    <SelectValue placeholder="Chọn biến thể để nhập hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct.variants?.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id.toString()}>
                        <div className="flex items-center gap-2">
                          {variant.color_hex && (
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: variant.color_hex }}
                            />
                          )}
                          <span>
                            {variant.sku}
                            {variant.color && ` - ${variant.color}`}
                            {variant.version && ` - ${variant.version}`}
                            {" (Tồn: " + variant.stock + ")"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Số lượng nhập *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Nhập số lượng"
                />
              </div>

              <div>
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập kho từ nhà cung cấp..."
                  rows={3}
                />
              </div>

              {quantity > 0 && selectedVariant && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  {(() => {
                    const variant = selectedProduct.variants?.find(
                      (v) => v.id.toString() === selectedVariant
                    );
                    return (
                      <div className="space-y-1">
                        <p className="text-sm text-blue-700">
                          Tồn kho sau khi nhập: {(variant?.stock || 0) + quantity}
                        </p>
                        <p className="text-sm text-blue-700">
                          Giá trị nhập: {formatCurrency((variant?.price || 0) * quantity)}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStockInDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={confirmStockIn}>Xác nhận nhập kho</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
