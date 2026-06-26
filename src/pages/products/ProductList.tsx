import { useState, useEffect } from "react";
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
import { productService } from "../../services/productService";
import { toast } from "sonner";

function ProductThumbnail({ src, alt }: { src?: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
        <Package className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 object-cover rounded flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = productStatusConfig[status as keyof typeof productStatusConfig];
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }
  return (
    <Badge className={`${config.bgColor} ${config.color}`}>{config.label}</Badge>
  );
}

export function ProductList() {
  const { deleteProduct, categories: contextCategories, brands: contextBrands, fetchCategories, fetchBrands } = useData();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced/state-based fetching triggers
  const fetchProducts = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const selectedCategory = contextCategories.find(c => c.name === categoryFilter);
      const selectedBrand = contextBrands.find(b => b.name === brandFilter);

      const params: Parameters<typeof productService.getAll>[0] = {
        page: currentPage,
        limit,
      };

      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (categoryFilter !== "all" && selectedCategory) {
        params.category_id = selectedCategory.id;
      }
      if (brandFilter !== "all" && selectedBrand) {
        params.brand_id = selectedBrand.id;
      }

      const res = await productService.getAll(params);
      setProducts(res.data);
      setTotalProducts(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when search or filters change
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      fetchProducts(page);
    } else {
      setPage(1);
      fetchProducts(1);
    }
  }, [statusFilter, categoryFilter, brandFilter, searchTerm]);

  useEffect(() => {
    if (!isFirstLoad) {
      fetchProducts(page);
    }
  }, [page]);

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
      // Reload lại danh sách sản phẩm từ API để phản ánh đúng sau khi xóa
      await fetchProducts(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
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
          <Link to="/products/stock">
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc SKU..."
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
                <SelectItem value="available">Đang kinh doanh</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {contextCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Thương hiệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                {contextBrands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({totalProducts})</CardTitle>
          {error && (
            <p className="text-sm text-red-600">
              Không thể đồng bộ sản phẩm từ backend: {error}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Đang tải sản phẩm...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Thương hiệu</TableHead>
                    <TableHead className="text-right">Giá bán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Không tìm thấy sản phẩm nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => {
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <ProductThumbnail src={product.primary_image} alt={product.name} />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-gray-500">
                                  {product.sku || ""}
                                  {product.variants && product.variants.length > 0 && (
                                    <span className="text-gray-400"> ({product.variants.length} biến thể)</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category?.name || "-"}</TableCell>
                          <TableCell>{product.brand?.name || "-"}</TableCell>
                          <TableCell className="text-right">
                            {product.price_min != null ? (
                              <span>
                                {formatCurrency(product.price_min)}
                                {product.price_max != null &&
                                  product.price_max !== product.price_min && (
                                    <span className="text-gray-400">
                                      {" "}– {formatCurrency(product.price_max)}
                                    </span>
                                  )}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={product.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/products/variants/${product.id}`}>
                                <Button variant="ghost" size="icon" title="Xem biến thể">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/products/edit/${product.id}`}>
                                <Button variant="ghost" size="icon" title="Chỉnh sửa">
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
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-500">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, totalProducts)} của {totalProducts} sản phẩm
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => (p * limit < totalProducts ? p + 1 : p))}
                    disabled={page * limit >= totalProducts}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"?
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
