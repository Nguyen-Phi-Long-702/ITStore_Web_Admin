import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react";
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
import { formatCurrency, productStatusConfig } from "../../utils/statusUtils";
import { Product } from "../../types";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

export function ProductList() {
  const { products, productVariants, deleteProduct, productFetchError } =
    useData();
  const { permissions } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean)),
  );

  const colors = Array.from(
    new Set(
      products.flatMap(
        (p) => p.variants?.map((v) => v.color).filter(Boolean) || [],
      ),
    ),
  );

  const versions = Array.from(
    new Set(
      products.flatMap(
        (p) => p.variants?.map((v) => v.version).filter(Boolean) || [],
      ),
    ),
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.product_code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.variants &&
        product.variants.some((v) =>
          v.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        ));
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category?.name === categoryFilter;
    const matchesColor =
      colorFilter === "all" ||
      (product.variants &&
        product.variants.some((v) => v.color === colorFilter));
    const matchesVersion =
      versionFilter === "all" ||
      (product.variants &&
        product.variants.some((v) => v.version === versionFilter));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesColor &&
      matchesVersion
    );
  });

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      toast.success("Sản phẩm đã được xóa thành công!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể xóa sản phẩm trên backend";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
          <p className="text-gray-600">Quản lý thông tin sản phẩm và tồn kho</p>
        </div>
        <div className="flex gap-2">
          <Link to="/products/inventory">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Quản lý kho
            </Button>
          </Link>
          <Link to="/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="md:col-span-2 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, mã SP hoặc SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang kinh doanh</SelectItem>
                <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Màu sắc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả màu</SelectItem>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={versionFilter} onValueChange={setVersionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Phiên bản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phiên bản</SelectItem>
                {versions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(colorFilter !== "all" || versionFilter !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Lọc theo:</span>
              {colorFilter !== "all" && (
                <Badge variant="outline" className="bg-[#FFE0B2]">
                  Màu: {colorFilter}
                  <button
                    onClick={() => setColorFilter("all")}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {versionFilter !== "all" && (
                <Badge variant="outline" className="bg-green-50">
                  Phiên bản: {versionFilter}
                  <button
                    onClick={() => setVersionFilter("all")}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({filteredProducts.length})</CardTitle>
          {productFetchError && (
            <p className="text-sm text-red-600">
              {productFetchError.toLowerCase().includes("cloud_name")
                ? "Backend lỗi cấu hình ảnh (cloud_name), nên chưa lấy được danh sách sản phẩm"
                : `Không thể đồng bộ sản phẩm từ backend: ${productFetchError}`}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SP</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>SKU biến thể</TableHead>
                <TableHead>Màu sắc</TableHead>
                <TableHead>Phiên bản</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const variants = product.variants || [];
                const normalizedProductSku = (product.sku || "")
                  .trim()
                  .toLowerCase();
                const fallbackVariantBySku = normalizedProductSku
                  ? productVariants.find(
                      (variant) =>
                        variant.sku.trim().toLowerCase() ===
                        normalizedProductSku,
                    )
                  : undefined;
                const effectiveVariantCount =
                  variants.length > 0
                    ? variants.length
                    : fallbackVariantBySku || product.sku
                      ? 1
                      : 0;

                if (variants.length === 0) {
                  return (
                    <TableRow key={`${product.id}-no-variant`}>
                      <TableCell className="font-medium text-[#E0872B]">
                        {product.product_code ||
                          `SP${product.id.toString().padStart(6, "0")}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback =
                                    document.createElement("div");
                                  fallback.className =
                                    "w-12 h-12 bg-gray-100 rounded flex items-center justify-center";
                                  fallback.innerHTML =
                                    '<svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                                  parent.insertBefore(
                                    fallback,
                                    e.currentTarget,
                                  );
                                }
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {effectiveVariantCount} biến thể
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku || "-"}</TableCell>
                      <TableCell className="text-gray-400">-</TableCell>
                      <TableCell className="text-gray-400">-</TableCell>
                      <TableCell>{product.category?.name || "-"}</TableCell>
                      <TableCell>{product.brand?.name || "-"}</TableCell>
                      <TableCell className="text-right">
                        {fallbackVariantBySku ? (
                          formatCurrency(fallbackVariantBySku.price)
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {fallbackVariantBySku ? (
                          <span
                            className={
                              fallbackVariantBySku.stock < 10
                                ? "text-red-600 font-semibold"
                                : ""
                            }
                          >
                            {fallbackVariantBySku.stock}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            productStatusConfig[product.status].bgColor
                          } ${productStatusConfig[product.status].color}`}
                        >
                          {productStatusConfig[product.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/products/edit/${product.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product)}
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                return variants.map((variant, index) => (
                  <TableRow key={`${product.id}-${variant.id}`}>
                    {index === 0 && (
                      <TableCell
                        className="font-medium text-[#E0872B] align-top"
                        rowSpan={variants.length}
                      >
                        {product.product_code ||
                          `SP${product.id.toString().padStart(6, "0")}`}
                      </TableCell>
                    )}

                    {index === 0 && (
                      <TableCell
                        rowSpan={variants.length}
                        className="align-top"
                      >
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback =
                                    document.createElement("div");
                                  fallback.className =
                                    "w-12 h-12 bg-gray-100 rounded flex items-center justify-center";
                                  fallback.innerHTML =
                                    '<svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                                  parent.insertBefore(
                                    fallback,
                                    e.currentTarget,
                                  );
                                }
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {effectiveVariantCount} biến thể
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">
                        {variant.sku}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {variant.color ? (
                        <span className="text-sm">{variant.color}</span>
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

                    {index === 0 && (
                      <TableCell
                        rowSpan={variants.length}
                        className="align-top"
                      >
                        {product.category?.name || "-"}
                      </TableCell>
                    )}

                    {index === 0 && (
                      <TableCell
                        rowSpan={variants.length}
                        className="align-top"
                      >
                        {product.brand?.name || "-"}
                      </TableCell>
                    )}

                    <TableCell className="text-right">
                      {formatCurrency(variant.price)}
                    </TableCell>

                    <TableCell className="text-right">
                      <span
                        className={
                          variant.stock < 10 ? "text-red-600 font-semibold" : ""
                        }
                      >
                        {variant.stock}
                      </span>
                    </TableCell>

                    {index === 0 && (
                      <TableCell
                        rowSpan={variants.length}
                        className="align-top"
                      >
                        <Badge
                          className={`${
                            productStatusConfig[product.status].bgColor
                          } ${productStatusConfig[product.status].color}`}
                        >
                          {productStatusConfig[product.status].label}
                        </Badge>
                      </TableCell>
                    )}

                    {index === 0 && (
                      <TableCell
                        className="text-right align-top"
                        rowSpan={variants.length}
                      >
                        <div className="flex justify-end gap-2">
                          <Link to={`/products/variants/${product.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xem chi tiết biến thể"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {permissions.canEditProduct && (
                            <Link to={`/products/edit/${product.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Chỉnh sửa"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          {permissions.canDeleteProduct && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product)}
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
