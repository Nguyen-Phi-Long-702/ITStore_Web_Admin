import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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
import { generateSlug } from "../../utils/slugUtils";

export function CategoryList() {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: undefined as number | undefined,
  });
  const [formLoading, setFormLoading] = useState(false);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.category_code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleAdd = () => {
    setSelectedCategory(null);
    setFormData({ name: "", description: "", parent_id: undefined });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parent_id: category.parent_id,
    });
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const slug = generateSlug(formData.name);
    setFormLoading(true);
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, {
          name: formData.name,
          slug: slug,
          description: formData.description,
          parent_id: formData.parent_id,
        });
        toast.success(`Đã cập nhật danh mục "${formData.name}"`);
      } else {
        await addCategory({
          name: formData.name,
          slug: slug,
          description: formData.description,
          parent_id: formData.parent_id,
        });
        toast.success(`Đã thêm danh mục "${formData.name}"`);
      }

      setDialogOpen(false);
      setFormData({ name: "", description: "", parent_id: undefined });
    } catch {
      toast.error("Không thể lưu dữ liệu lên backend");
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      setFormLoading(true);
      try {
        await deleteCategory(selectedCategory.id);
        toast.success(`Đã xóa danh mục "${selectedCategory.name}"`);
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
      } catch {
        toast.error("Không thể xóa danh mục trên backend");
      } finally {
        setFormLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
          <p className="text-gray-600">Quản lý các danh mục sản phẩm</p>
        </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục
          </Button>
      </div>



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

      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách danh mục ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã danh mục</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    Không tìm thấy danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => {
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium text-[#E0872B]">
                        {category.category_code ||
                          `CAT${category.id.toString().padStart(6, "0")}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{category.name}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category)}
                            >
                              <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                              Xóa
                            </Button>
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parent_category">
                Là danh mục con của (Không bắt buộc)
              </Label>
              <Select
                value={formData.parent_id?.toString() || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    parent_id: value === "none" ? undefined : parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có danh mục cha</SelectItem>
                  {categories
                    .filter(c => c.id !== selectedCategory?.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả danh mục
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả danh mục"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={formLoading}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={formLoading}>
              {formLoading ? "Đang xử lý..." : selectedCategory ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={formLoading}
            >
              {formLoading ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
