import { useState, useRef } from "react";
import { Search, Plus, Edit, Trash2, Upload, X, Image } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
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
import { Brand } from "../../types";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

export function BrandList() {
  const {
    brands,
    products,
    addBrand,
    updateBrand,
    deleteBrand,
    brandFetchError,
  } = useData();
  const { permissions } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    logo_file: undefined as File | undefined,
  });

  const getProductCount = (brandId: number) => {
    return products.filter((product) => product.brand_id === brandId).length;
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.brand_code || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAdd = () => {
    setSelectedBrand(null);
    setFormData({ name: "", logo_url: "", logo_file: undefined });
    setDialogOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      logo_url: brand.logo_url || "",
      logo_file: undefined,
    });
    setDialogOpen(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên thương hiệu");
      return;
    }

    try {
      if (selectedBrand) {
        await updateBrand(selectedBrand.id, {
          name: formData.name,
          logo_file: formData.logo_file,
        });
        toast.success(`Đã cập nhật thương hiệu "${formData.name}"`);
      } else {
        if (!formData.logo_file) {
          toast.error("Vui lòng chọn logo thương hiệu");
          return;
        }

        await addBrand({
          name: formData.name,
          logo_file: formData.logo_file,
        });
        toast.success(`Đã thêm thương hiệu "${formData.name}"`);
      }

      setDialogOpen(false);
      setFormData({ name: "", logo_url: "", logo_file: undefined });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể lưu thương hiệu lên backend";
      toast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (selectedBrand) {
      try {
        await deleteBrand(selectedBrand.id);
        toast.success(`Đã xóa thương hiệu "${selectedBrand.name}"`);
        setDeleteDialogOpen(false);
        setSelectedBrand(null);
      } catch {
        toast.error("Không thể xóa thương hiệu trên backend");
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 2MB!");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData({ ...formData, logo_url: previewUrl, logo_file: file });
    toast.success("Đã tải logo lên thành công!");
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo_url: "", logo_file: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Đã xóa logo!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý thương hiệu
          </h2>
          <p className="text-gray-600">Quản lý các thương hiệu sản phẩm</p>
        </div>
        {permissions.canCreateBrand && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thương hiệu
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#E0872B]">
                {brands.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng thương hiệu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#E0872B]">
                {products.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng sản phẩm</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thương hiệu ({filteredBrands.length})</CardTitle>
          {brandFetchError && (
            <p className="text-sm text-red-600">
              {brandFetchError.toLowerCase().includes("cloud_name")
                ? "Backend lỗi cấu hình ảnh (cloud_name), nên chưa lấy được danh sách thương hiệu"
                : `Không thể đồng bộ thương hiệu từ backend: ${brandFetchError}`}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã thương hiệu</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Số sản phẩm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    Không tìm thấy thương hiệu nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => {
                  const productCount = getProductCount(brand.id);
                  return (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium text-[#E0872B]">
                        {brand.brand_code ||
                          `BRD${brand.id.toString().padStart(6, "0")}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{brand.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {brand.logo_url ? (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">
                            Chưa có
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#E0872B]">
                            {productCount}
                          </span>
                          <span className="text-gray-500 text-sm">
                            sản phẩm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Number.isNaN(new Date(brand.created_at).getTime())
                          ? "-"
                          : new Date(brand.created_at).toLocaleDateString(
                              "vi-VN",
                            )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {permissions.canEditBrand && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(brand)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                          )}
                          {permissions.canDeleteBrand && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(brand)}
                            >
                              <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                              Xóa
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
            </DialogTitle>
            <DialogDescription>
              {selectedBrand
                ? "Cập nhật thông tin thương hiệu"
                : "Nhập thông tin thương hiệu mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên thương hiệu"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL Logo (tùy chọn)</Label>
              <Input
                id="logo_url"
                placeholder="https://example.com/logo.png"
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    logo_url: e.target.value,
                    logo_file: undefined,
                  })
                }
              />
              <p className="text-sm text-gray-500">
                Nhập URL hình ảnh logo của thương hiệu
              </p>
            </div>
            <div className="space-y-2">
              <Label>Logo hiện tại</Label>
              <div className="flex items-center gap-4">
                {formData.logo_url ? (
                  <div className="relative group">
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="h-24 w-24 object-contain border-2 border-gray-200 rounded-lg p-2"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileSelect}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Chọn file từ máy tính
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Chấp nhận: JPG, PNG, GIF. Tối đa 2MB
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {selectedBrand ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thương hiệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thương hiệu "{selectedBrand?.name}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
