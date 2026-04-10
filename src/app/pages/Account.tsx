import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "react-router";
import type { Address } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

type AddressRecord = Pick<
  Address,
  | "id"
  | "recipient"
  | "phone_number"
  | "province"
  | "district"
  | "ward"
  | "street"
  | "is_default"
>;

const API_BASE_URL = "http://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token";

function getAuthHeaders(headers?: HeadersInit): HeadersInit {
  const rawToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const token = rawToken?.trim();

  if (!token || token === "undefined" || token === "null") {
    if (rawToken) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
    return headers ?? {};
  }

  return {
    ...(headers ?? {}),
    Authorization: `Bearer ${token}`,
  };
}

function formatAddress(address: AddressRecord | null): string {
  if (!address) {
    return "Chưa cập nhật";
  }

  const parts = [address.street, address.ward, address.district, address.province]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return parts.length > 0 ? parts.join(", ") : "Chưa cập nhật";
}

function normalizeAddressList(payload: unknown): AddressRecord[] {
  if (Array.isArray(payload)) {
    return payload as AddressRecord[];
  }

  if (payload && typeof payload === "object") {
    const envelope = payload as {
      data?: unknown;
      items?: unknown;
      result?: unknown;
      payload?: unknown;
    };

    const candidates = [
      envelope.data,
      envelope.items,
      envelope.result,
      envelope.payload,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as AddressRecord[];
      }
    }
  }

  return [];
}

function AccountContent() {
  const { user, updateUser, changePassword } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<AddressRecord | null>(
    null,
  );
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const passwordChangeSupported = true;

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || user?.phone_number || "",
    date_of_birth: user?.date_of_birth || "",
    gender: user?.gender || "other",
  });

  useEffect(() => {
    if (!user?.id) {
      setDefaultAddress(null);
      return;
    }

    let active = true;

    const fetchDefaultAddress = async () => {
      setIsAddressLoading(true);

      const endpoints = ["/api/users/me/addresses", "/users/me/addresses"];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            credentials: "include",
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            continue;
          }

          const payload = (await response.json().catch(() => null)) as unknown;
          const addresses = normalizeAddressList(payload);
          const nextAddress =
            addresses.find((address) => address.is_default) ??
            addresses[0] ??
            null;

          if (active) {
            setDefaultAddress(nextAddress);
          }
          return;
        } catch {
          continue;
        }
      }

      if (active) {
        setDefaultAddress(null);
      }
    };

    fetchDefaultAddress().finally(() => {
      if (active) {
        setIsAddressLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "change-password") {
      setIsPasswordDialogOpen(true);
      setSearchParams({});
    }
  }, [passwordChangeSupported, searchParams, setSearchParams]);

  if (!user) return null;

  const handleSave = async () => {
    const result = await updateUser(formData);
    if (!result.ok) {
      toast.error(
        result.message || "Không thể cập nhật thông tin. Vui lòng thử lại!",
      );
      if (result.message?.includes("đăng nhập lại")) {
        setIsEditing(false);
      }
      return;
    }

    toast.success("Cập nhật thông tin thành công!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      phone: user?.phone || user?.phone_number || "",
      date_of_birth: user?.date_of_birth || "",
      gender: user?.gender || "other",
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu cũ!");
      return;
    }

    setIsChangingPassword(true);
    const result = await changePassword(
      passwordForm.oldPassword,
      passwordForm.newPassword,
    );
    setIsChangingPassword(false);

    if (result.ok) {
      toast.success("Đổi mật khẩu thành công!");
      setIsPasswordDialogOpen(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(
        result.message || "Không thể đổi mật khẩu. Vui lòng thử lại!",
      );
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64String = e.target?.result as string;
      const result = await updateUser({ avatar: base64String });
      if (!result.ok) {
        toast.error(
          result.message ||
            "Không thể cập nhật ảnh đại diện. Vui lòng thử lại!",
        );
        return;
      }

      toast.success("Cập nhật ảnh đại diện thành công!");
    };
    reader.onerror = () => {
      toast.error("Có lỗi xảy ra khi đọc file!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    const result = await updateUser({ avatar: undefined });
    if (!result.ok) {
      toast.error(
        result.message || "Không thể xóa ảnh đại diện. Vui lòng thử lại!",
      );
      return;
    }

    toast.success("Đã xóa ảnh đại diện!");
  };

  const getRoleBadgeColor = (role: string) => {
    return role === "admin"
      ? "bg-[#FFE0B2] text-[#E0872B]"
      : "bg-[#FFE0B2] text-[#E0872B]";
  };

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Quản trị viên" : "Nhân viên";
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const displayAddress = defaultAddress
    ? formatAddress(defaultAddress)
    : user.address || "Chưa cập nhật";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin cá nhân và tài khoản
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.full_name}
                    className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-400 flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
                {isEditing && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={handleFileSelect}
                        title="Tải ảnh lên"
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                      {user.avatar && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-10 w-10 rounded-full p-0"
                          onClick={handleRemoveAvatar}
                          title="Xóa ảnh"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold mt-4">{user.full_name}</h2>
              <p className="text-gray-600">@{user.username}</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleBadgeColor(
                  user.role,
                )}`}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Tham gia:</span>
                <span className="ml-auto font-medium">
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">ID:</span>
                <span className="ml-auto font-medium">#{user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  <User className="h-4 w-4 inline mr-2" />
                  Họ và tên
                </Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {user.full_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <p className="text-gray-900 font-medium py-2">{user.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Số điện thoại
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {user.phone || user.phone_number || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Ngày sinh
                </Label>
                {isEditing ? (
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  <User className="h-4 w-4 inline mr-2" />
                  Giới tính
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {user.gender
                      ? getGenderLabel(user.gender)
                      : "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Địa chỉ
                </Label>
                <div className="rounded-lg border bg-gray-50 px-3 py-3 min-h-[88px]">
                  <p className="text-gray-900 font-medium leading-6">
                    {isAddressLoading ? "Đang tải..." : displayAddress}
                  </p>
                  {defaultAddress && (
                    <p className="mt-2 text-xs text-gray-500">
                      {defaultAddress.recipient} · {defaultAddress.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bảo mật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Mật khẩu</p>
              <p className="text-sm text-gray-600">
                Thay đổi mật khẩu để bảo vệ tài khoản của bạn
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(true);
              }}
            >
              <Lock className="h-4 w-4 mr-2" />
              Đổi mật khẩu
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu cũ và mật khẩu mới của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !passwordChangeSupported}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isChangingPassword ? (
                <Lock className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Đổi mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Account() {
  return <AccountContent />;
}
