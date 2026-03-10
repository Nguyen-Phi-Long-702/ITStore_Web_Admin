import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

export function PromotionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coupons, addCoupon, updateCoupon } = useData();
  const isEdit = !!id;

  const existingCoupon = isEdit
    ? coupons.find((c) => c.id.toString() === id)
    : null;

  const [formData, setFormData] = useState({
    code: existingCoupon?.code || "",
    discount_type: existingCoupon?.discount_type || "percent",
    discount_value: existingCoupon?.discount_value || 0,
    min_order_value: existingCoupon?.min_order_value || 0,
    max_uses: existingCoupon?.max_uses || 100,
    expires_at: existingCoupon?.expires_at || "",
    is_active: existingCoupon?.is_active ?? true,
  });

  // Update form data when existingCoupon changes
  useEffect(() => {
    if (existingCoupon) {
      setFormData({
        code: existingCoupon.code,
        discount_type: existingCoupon.discount_type,
        discount_value: existingCoupon.discount_value,
        min_order_value: existingCoupon.min_order_value || 0,
        max_uses: existingCoupon.max_uses || 100,
        expires_at: existingCoupon.expires_at || "",
        is_active: existingCoupon.is_active,
      });
    }
  }, [existingCoupon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discount_value) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (isEdit && existingCoupon) {
      updateCoupon(existingCoupon.id, formData);
      toast.success("Cập nhật mã giảm giá thành công");
    } else {
      addCoupon(formData);
      toast.success("Tạo mã giảm giá mới thành công");
    }

    navigate("/promotions");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/promotions")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
          </h2>
          <p className="text-gray-600">
            {isEdit
              ? "Cập nhật thông tin mã giảm giá"
              : "Tạo mã giảm giá hoặc coupon mới"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Mã giảm giá *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="FREESHIP"
                      className="font-mono"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount_type">Loại giảm giá</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value: "percent" | "fixed") =>
                        setFormData({ ...formData, discount_type: value })
                      }
                    >
                      <SelectTrigger id="discount_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">
                          Giảm theo phần trăm (%)
                        </SelectItem>
                        <SelectItem value="fixed">
                          Giảm cố định (VNĐ)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discount_value">
                      Giá trị *{" "}
                      {formData.discount_type === "percent" ? "(%)" : "(VNĐ)"}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_value: Number(e.target.value),
                        })
                      }
                      placeholder={
                        formData.discount_type === "percent" ? "10" : "50000"
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="min_order_value">
                      Giá trị đơn tối thiểu (VNĐ)
                    </Label>
                    <Input
                      id="min_order_value"
                      type="number"
                      value={formData.min_order_value || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_order_value: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thời gian và giới hạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expires_at">Ngày hết hạn</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={
                        formData.expires_at
                          ? formData.expires_at.slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, expires_at: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_uses">Giới hạn số lần sử dụng</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={formData.max_uses || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_uses: Number(e.target.value),
                        })
                      }
                      placeholder="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="is_active">Trạng thái mã</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_active: value === "active" })
                  }
                >
                  <SelectTrigger id="is_active">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang chạy</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {formData.discount_value > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Xem trước</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700">Mã:</span>{" "}
                    <span className="font-mono font-bold">{formData.code}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Giảm:</span>{" "}
                    {formData.discount_type === "percent"
                      ? `${formData.discount_value}%`
                      : `${formData.discount_value.toLocaleString("vi-VN")}đ`}
                  </div>
                  {formData.min_order_value && formData.min_order_value > 0 && (
                    <div>
                      <span className="text-blue-700">Đơn tối thiểu:</span>{" "}
                      {formData.min_order_value.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/promotions")}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}