import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, AlertTriangle, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import { Product, ProductVariant } from "../../types";
import { ColorSwatch } from "../../components/products/ColorSwatch";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { productService } from "../../services/productService";

const PAGE_LIMIT = 10;

// Mỗi "row" trong bảng kho là một variant kèm thông tin product
interface StockRow {
  product: Product;
  variant: ProductVariant;
}

export function Stock() {
  const navigate = useNavigate();
  const { addStockMovement } = useData();

  // Phân trang products
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingPage, setLoadingPage] = useState(true);

  // Dữ liệu hiển thị
  const [stockRows, setStockRows] = useState<StockRow[]>([]);

  // Low-stock data riêng từ API
  const [lowStockVariants, setLowStockVariants] = useState<ProductVariant[]>([]);
  const [loadingLowStock, setLoadingLowStock] = useState(true);

  const [stockInDialogOpen, setStockInDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");
  const [isStockSaving, setIsStockSaving] = useState(false);

  // Tải danh sách sản phẩm theo trang, sau đó gọi API variant cho từng sản phẩm
  const loadPage = useCallback(async (targetPage: number) => {
    setLoadingPage(true);
    try {
      const res = await productService.getAll({ page: targetPage, limit: PAGE_LIMIT });
      setTotalProducts(res.total);

      const products = res.data;
      if (products.length === 0) {
        setStockRows([]);
        return;
      }

      // Gọi song song API variant cho tất cả sản phẩm trong trang
      const variantResults = await Promise.allSettled(
        products.map((p) => productService.getVariantsByProduct(p.id)),
      );

      const rows: StockRow[] = [];
      products.forEach((product, i) => {
        const result = variantResults[i];
        const variants: ProductVariant[] =
          result.status === "fulfilled" ? result.value : [];
        variants.forEach((variant) => {
          rows.push({ product, variant });
        });
      });
      setStockRows(rows);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu kho");
    } finally {
      setLoadingPage(false);
    }
  }, []);

  // Tải lần đầu và khi trang thay đổi
  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  // Tải danh sách sản phẩm sắp hết hàng từ API
  useEffect(() => {
    setLoadingLowStock(true);
    productService
      .getLowStock(10)
      .then(setLowStockVariants)
      .catch(console.error)
      .finally(() => setLoadingLowStock(false));
  }, []);

  const handleStockIn = (product: Product, variantId?: string) => {
    setSelectedProduct(product);
    // Lấy variants của product từ stockRows hiện tại
    const productVariants = stockRows
      .filter((r) => r.product.id === product.id)
      .map((r) => r.variant);
    setSelectedVariant(variantId || productVariants[0]?.id.toString() || "");
    setQuantity(0);
    setNote("");
    setStockInDialogOpen(true);
  };

  const confirmStockIn = async () => {
    if (!quantity || quantity <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }
    if (!selectedVariant) {
      toast.error("Vui lòng chọn biến thể");
      return;
    }

    setIsStockSaving(true);
    try {
      await addStockMovement({
        variant_id: Number(selectedVariant),
        change_qty: quantity,
        note: note.trim() || undefined,
      });

      const variantName = stockRows
        .find((r) => r.variant.id.toString() === selectedVariant)
        ?.variant;

      toast.success(
        `Đã nhập ${quantity} ${selectedProduct?.name}${
          variantName?.color ? ` - ${variantName.color}` : ""
        }${variantName?.version ? ` - ${variantName.version}` : ""} vào kho`,
      );

      setStockInDialogOpen(false);
      setSelectedProduct(null);
      setSelectedVariant("");
      setQuantity(0);
      setNote("");

      // Reload trang hiện tại + low stock
      loadPage(page);
      productService.getLowStock(10).then(setLowStockVariants).catch(console.error);
    } catch {
      toast.error("Không thể nhập kho, vui lòng thử lại");
    } finally {
      setIsStockSaving(false);
    }
  };

  const totalPages = Math.ceil(totalProducts / PAGE_LIMIT);

  // Lấy danh sách variants hiển thị trong dialog (của selectedProduct)
  const dialogVariants = selectedProduct
    ? stockRows.filter((r) => r.product.id === selectedProduct.id).map((r) => r.variant)
    : [];

  const selectedVariantObj = dialogVariants.find((v) => v.id.toString() === selectedVariant);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý tồn kho</h2>
          <p className="text-gray-600">
            Nhập hàng và theo dõi cảnh báo tồn kho
          </p>
        </div>
      </div>

      {/* Cảnh báo tồn kho thấp từ API */}
      {!loadingLowStock && lowStockVariants.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo: {lowStockVariants.length} biến thể sắp hết hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center gap-2 bg-white border border-red-200 px-3 py-2 rounded-lg text-sm"
                >
                  {variant.color_hex && (
                    <ColorSwatch
                      color={variant.color}
                      colorHex={variant.color_hex}
                      size="sm"
                    />
                  )}
                  <div>
                    <span className="font-medium text-gray-800">
                      {variant.product?.name}
                    </span>
                    <span className="text-gray-500 ml-1">
                      ({variant.color || variant.version || variant.sku})
                    </span>
                  </div>
                  <span className="font-bold text-red-600 ml-1">
                    Còn {variant.stock}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bảng tồn kho tất cả sản phẩm với phân trang */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tồn kho tất cả sản phẩm</CardTitle>
          {totalProducts > 0 && (
            <span className="text-sm text-gray-500">
              Trang {page}/{totalPages} · {totalProducts} sản phẩm
            </span>
          )}
        </CardHeader>
        <CardContent>
          {loadingPage ? (
            <div className="py-12 text-center text-gray-500">Đang tải dữ liệu kho...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
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
                  {stockRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockRows.map(({ product, variant }, idx) => {
                      const isFirstVariantOfProduct =
                        idx === 0 || stockRows[idx - 1].product.id !== product.id;
                      const productVariantCount = stockRows.filter(
                        (r) => r.product.id === product.id,
                      ).length;
                      const stockStatus =
                        variant.stock < 10
                          ? "low"
                          : variant.stock < 20
                            ? "medium"
                            : "ok";

                      return (
                        <TableRow key={`${product.id}-${variant.id}`}>
                          {isFirstVariantOfProduct && (
                            <TableCell
                              rowSpan={productVariantCount}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {product.primary_image ? (
                                    <img
                                      src={product.primary_image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {productVariantCount} biến thể
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

                          {isFirstVariantOfProduct && (
                            <TableCell rowSpan={productVariantCount}>
                              <Badge variant="outline">
                                {product.category?.name || "-"}
                              </Badge>
                            </TableCell>
                          )}

                          {isFirstVariantOfProduct && (
                            <TableCell rowSpan={productVariantCount}>
                              <div className="flex items-center gap-2">
                                {product.brand?.logo_url ? (
                                  <img
                                    src={product.brand.logo_url}
                                    alt={product.brand.name}
                                    className="h-6 w-6 object-contain"
                                  />
                                ) : null}
                                <span className="text-sm">
                                  {product.brand?.name || "-"}
                                </span>
                              </div>
                            </TableCell>
                          )}

                          <TableCell className="text-right">
                            <div>
                              <p className="font-semibold text-[#E0872B]">
                                {formatCurrency(variant.price)}
                              </p>
                              {variant.compare_at_price &&
                                variant.compare_at_price > variant.price && (
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatCurrency(variant.compare_at_price)}
                                  </p>
                                )}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div>
                              <p
                                className={`font-bold ${
                                  stockStatus === "low"
                                    ? "text-red-600"
                                    : stockStatus === "medium"
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                }`}
                              >
                                {variant.stock}
                              </p>
                              <p className="text-xs text-gray-500">Tối thiểu: 10</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            {variant.stock === 0 ? (
                              <Badge className="bg-red-100 text-red-700">Hết hàng</Badge>
                            ) : variant.stock < 10 ? (
                              <Badge className="bg-red-100 text-red-700">Cần nhập</Badge>
                            ) : variant.stock < 20 ? (
                              <Badge className="bg-yellow-100 text-yellow-700">Sắp hết</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700">Đủ hàng</Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStockIn(product, variant.id.toString())
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-gray-500">
                  Trang {page} / {totalPages} · {totalProducts} sản phẩm
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog nhập kho */}
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
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedProduct.primary_image ? (
                    <img
                      src={selectedProduct.primary_image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedProduct.category?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tổng tồn kho hiện tại:{" "}
                    {dialogVariants.reduce((sum, v) => sum + v.stock, 0)}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="variant">Chọn biến thể *</Label>
                <Select
                  value={selectedVariant}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger id="variant">
                    <SelectValue placeholder="Chọn biến thể để nhập hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {dialogVariants.map((variant) => (
                      <SelectItem
                        key={variant.id}
                        value={variant.id.toString()}
                      >
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

              {quantity > 0 && selectedVariant && selectedVariantObj && (
                <div className="p-3 bg-[#FFE0B2] rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-[#E0872B]">
                      Tồn kho sau khi nhập:{" "}
                      {selectedVariantObj.stock + quantity}
                    </p>
                    <p className="text-sm text-[#E0872B]">
                      Giá trị nhập:{" "}
                      {formatCurrency(selectedVariantObj.price * quantity)}
                    </p>
                  </div>
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
            <Button onClick={confirmStockIn} disabled={isStockSaving}>
              {isStockSaving ? "Đang xử lý..." : "Xác nhận nhập kho"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
