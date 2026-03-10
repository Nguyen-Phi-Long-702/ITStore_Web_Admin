import { useState } from "react";
import { Search, Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
import { Category } from "../../types";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { generateSlug } from "../../utils/slugUtils";

export function CategoryList() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useData();
  const { permissions } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Count products for each category
  const getProductCount = (categoryId: number) => {
    return products.filter((product) => product.category_id === categoryId).length;
  };

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.category_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedCategory(null);
    setFormData({ name: "" });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
    });
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const slug = generateSlug(formData.name);

    if (selectedCategory) {
      // Edit existing category
      updateCategory(selectedCategory.id, {
        name: formData.name,
        slug: slug,
      });
      toast.success(`Đã cập nhật danh mục "${formData.name}"`);
    } else {
      // Add new category
      addCategory({
        name: formData.name,
        slug: slug,
      });
      toast.success(`Đã thêm danh mục "${formData.name}"`);
    }

    setDialogOpen(false);
    setFormData({ name: "" });
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      const productCount = getProductCount(selectedCategory.id);
      if (productCount > 0) {
        toast.error(
          `Không thể xóa danh mục "${selectedCategory.name}" vì còn ${productCount} sản phẩm`
        );
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
        return;
      }

      deleteCategory(selectedCategory.id);
      toast.success(`Đã xóa danh mục "${selectedCategory.name}"`);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
          <p className="text-gray-600">Quản lý các danh mục sản phẩm</p>
        </div>
        {permissions.canCreateCategory && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {categories.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng danh mục</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {products.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng sản phẩm</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã danh mục</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Số sản phẩm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Không tìm thấy danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => {
                  const productCount = getProductCount(category.id);
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium text-blue-600">
                        {category.category_code || `CAT${category.id.toString().padStart(6, "0")}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{category.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">
                            {productCount}
                          </span>
                          <span className="text-gray-500 text-sm">
                            sản phẩm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {permissions.canEditCategory && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                          )}
                          {permissions.canDeleteCategory && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Cập nhật thông tin danh mục"
                : "Nhập thông tin danh mục mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {selectedCategory ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
              {selectedCategory && getProductCount(selectedCategory.id) > 0 && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Danh mục này còn {getProductCount(selectedCategory.id)} sản phẩm.
                  Vui lòng chuyển sản phẩm sang danh mục khác trước khi xóa.
                </span>
              )}
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