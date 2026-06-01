import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
import { Switch } from "../../components/ui/switch";
import { Banner } from "../../types";
import { bannerService } from "../../services/bannerService";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function BannerList() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  
  const [formData, setFormData] = useState({
    link_url: "",
    is_active: true,
    sort_order: 1,
    end_date: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const is_active = isActiveFilter === "all" ? undefined : isActiveFilter === "true";
      const data = await bannerService.getBanners({ sort: sortOrder, is_active });
      setBanners(data);
    } catch (error) {
      toast.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [sortOrder, isActiveFilter]);

  const handleAdd = () => {
    setSelectedBanner(null);
    setFormData({ link_url: "", is_active: true, sort_order: 1, end_date: "" });
    setFile(null);
    setFilePreview("");
    setDialogOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      link_url: banner.link_url || "",
      is_active: banner.is_active,
      sort_order: banner.sort_order,
      end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : "",
    });
    setFile(null);
    setFilePreview(banner.image_url);
    setDialogOpen(true);
  };

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!selectedBanner && !file) {
      toast.error("Vui lòng chọn ảnh banner");
      return;
    }

    try {
      setFormLoading(true);
      const submitData = new FormData();
      
      if (file) {
        submitData.append("image", file);
      }
      
      if (formData.link_url) {
        submitData.append("link_url", formData.link_url);
      }
      
      submitData.append("is_active", String(formData.is_active));

      if (selectedBanner) {
        submitData.append("sort_order", String(formData.sort_order));
        if (formData.end_date) {
          submitData.append("end_date", new Date(formData.end_date).toISOString());
        }
        await bannerService.updateBanner(selectedBanner.id, submitData);
        toast.success("Cập nhật banner thành công");
      } else {
        if (formData.end_date) {
          submitData.append("end_date", new Date(formData.end_date).toISOString());
        }
        await bannerService.createBanner(submitData);
        toast.success("Thêm banner mới thành công");
      }
      
      setDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBanner) return;
    try {
      setFormLoading(true);
      await bannerService.deleteBanner(selectedBanner.id);
      toast.success("Xóa banner thành công");
      setDeleteDialogOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error("Không thể xóa banner");
    } finally {
      setFormLoading(false);
    }
  };

  const handleActiveToggle = async (banner: Banner, checked: boolean) => {
    try {
      const submitData = new FormData();
      submitData.append("is_active", String(checked));
      await bannerService.updateBanner(banner.id, submitData);
      toast.success(`Đã ${checked ? 'hiển thị' : 'ẩn'} banner`);
      fetchBanners();
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Banner</h2>
            <p className="text-gray-600">Quản lý banner hiển thị trên website</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Danh sách banner</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Thứ tự tăng dần</SelectItem>
                  <SelectItem value="desc">Thứ tự giảm dần</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={isActiveFilter}
                onValueChange={setIsActiveFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="true">Đang hoạt động</SelectItem>
                  <SelectItem value="false">Đã ẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Thứ tự</TableHead>
                  <TableHead className="w-[200px]">Hình ảnh</TableHead>
                  <TableHead>Đường dẫn</TableHead>
                  <TableHead>Ngày hết hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right w-[120px]">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy banner nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="font-medium text-center">
                        {banner.sort_order}
                      </TableCell>
                      <TableCell>
                        <div className="w-full h-20 bg-muted rounded-md overflow-hidden relative border flex items-center justify-center">
                          {banner.image_url ? (
                            <img
                                src={banner.image_url}
                              alt={`Banner ${banner.id}`}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">No image</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {banner.link_url ? (
                          <a href={banner.link_url} target="_blank" rel="noreferrer" className="text-primary hover:underline line-clamp-2">
                            {banner.link_url}
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic">Không có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {banner.end_date ? (
                            <span className="text-sm">{formatDate(banner.end_date)}</span>
                        ) : (
                            <span className="text-muted-foreground italic text-sm">Không có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={banner.is_active}
                            onCheckedChange={(checked) => handleActiveToggle(banner, checked)}
                          />
                          <Badge
                            variant="outline"
                            className={
                                banner.is_active
                                    ? "border-green-200 bg-green-100 text-green-700"
                                    : "border-red-200 bg-red-100 text-red-700"
                            }
                          >
                            {banner.is_active ? "Hiển thị" : "Đã ẩn"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(banner)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(banner)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? "Cập nhật banner" : "Thêm banner mới"}
            </DialogTitle>
            <DialogDescription>
              {selectedBanner
                ? "Thay đổi thông tin cho banner hiện tại."
                : "Điền thông tin và tải ảnh lên để tạo banner mới."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh {selectedBanner ? "" : <span className="text-red-500">*</span>}</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
              {filePreview && (
                <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                        {file ? "Xem trước ảnh mới" : "Ảnh hiện tại"}
                    </p>
                    <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden border">
                        <img
                            src={filePreview}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link_url">Đường dẫn liên kết</Label>
              <Input
                id="link_url"
                placeholder="https://..."
                value={formData.link_url}
                onChange={(e) =>
                  setFormData({ ...formData, link_url: e.target.value })
                }
              />
            </div>
            
            {selectedBanner && (
                <div className="space-y-2">
                    <Label htmlFor="sort_order">Thứ tự hiển thị (Sort Order)</Label>
                    <Input
                        id="sort_order"
                        type="number"
                        min="1"
                        value={formData.sort_order}
                        onChange={(e) =>
                            setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })
                        }
                    />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="end_date">Ngày hết hạn</Label>
                <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                    }
                />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Hoạt động (Hiển thị banner)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={formLoading}
            >
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={formLoading}>
              {formLoading ? "Đang xử lý..." : selectedBanner ? "Lưu thay đổi" : "Tạo mẫu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa banner này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
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
