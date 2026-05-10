import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../components/ui/dialog";
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X, Lock, Eye, EyeOff, Trash2, Camera, } from "lucide-react";
import { toast } from "sonner";
const API_BASE_URL = "http://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token";
function buildApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}
function getAuthHeaders(headers) {
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
function formatAddress(address) {
    if (!address) {
        return "Chưa cập nhật";
    }
    const parts = [address.street, address.ward, address.district, address.province]
        .map((value) => value?.trim())
        .filter((value) => Boolean(value));
    return parts.length > 0 ? parts.join(", ") : "Chưa cập nhật";
}
function normalizeAddressList(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (payload && typeof payload === "object") {
        const envelope = payload;
        const candidates = [
            envelope.data,
            envelope.items,
            envelope.result,
            envelope.payload,
        ];
        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return candidate;
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
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const fileInputRef = useRef(null);
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
                    const response = await fetch(buildApiUrl(endpoint), {
                        method: "GET",
                        credentials: "include",
                        headers: getAuthHeaders(),
                    });
                    if (!response.ok) {
                        continue;
                    }
                    const payload = (await response.json().catch(() => null));
                    const addresses = normalizeAddressList(payload);
                    const nextAddress = addresses.find((address) => address.is_default) ??
                        addresses[0] ??
                        null;
                    if (active) {
                        setDefaultAddress(nextAddress);
                    }
                    return;
                }
                catch {
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
    if (!user)
        return null;
    const handleSave = async () => {
        const result = await updateUser(formData);
        if (!result.ok) {
            toast.error(result.message || "Không thể cập nhật thông tin. Vui lòng thử lại!");
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
        if (!passwordForm.oldPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            toast.error("Mật khẩu mới phải có ít nhất 8 ký tự!");
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
        const result = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
        setIsChangingPassword(false);
        if (result.ok) {
            toast.success("Đổi mật khẩu thành công!");
            setIsPasswordDialogOpen(false);
            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }
        else {
            toast.error(result.message || "Không thể đổi mật khẩu. Vui lòng thử lại!");
        }
    };
    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
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
            const base64String = e.target?.result;
            const result = await updateUser({ avatar: base64String });
            if (!result.ok) {
                toast.error(result.message ||
                    "Không thể cập nhật ảnh đại diện. Vui lòng thử lại!");
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
            toast.error(result.message || "Không thể xóa ảnh đại diện. Vui lòng thử lại!");
            return;
        }
        toast.success("Đã xóa ảnh đại diện!");
    };
    const getRoleBadgeColor = (role) => {
        return role === "admin"
            ? "bg-[#FFE0B2] text-[#E0872B]"
            : "bg-[#FFE0B2] text-[#E0872B]";
    };
    const getRoleLabel = (role) => {
        return role === "admin" ? "Quản trị viên" : "Nhân viên";
    };
    const getGenderLabel = (gender) => {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "T\u00E0i kho\u1EA3n c\u1EE7a t\u00F4i" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Qu\u1EA3n l\u00FD th\u00F4ng tin c\u00E1 nh\u00E2n v\u00E0 t\u00E0i kho\u1EA3n" })] }), !isEditing ? (_jsxs(Button, { onClick: () => setIsEditing(true), children: [_jsx(Edit2, { className: "h-4 w-4 mr-2" }), "Ch\u1EC9nh s\u1EEDa"] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", onClick: handleCancel, children: [_jsx(X, { className: "h-4 w-4 mr-2" }), "H\u1EE7y"] }), _jsxs(Button, { onClick: handleSave, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "L\u01B0u"] })] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-1", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin c\u01A1 b\u1EA3n" }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative group", children: [user.avatar ? (_jsx("img", { src: user.avatar, alt: user.full_name, className: "w-32 h-32 rounded-full border-4 border-gray-200 object-cover" })) : (_jsx("div", { className: "w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-400 flex items-center justify-center", children: _jsx(User, { className: "h-16 w-16 text-white" }) })), isEditing && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: [_jsx(Button, { size: "sm", variant: "secondary", className: "h-10 w-10 rounded-full p-0", onClick: handleFileSelect, title: "T\u1EA3i \u1EA3nh l\u00EAn", children: _jsx(Camera, { className: "h-5 w-5" }) }), user.avatar && (_jsx(Button, { size: "sm", variant: "destructive", className: "h-10 w-10 rounded-full p-0", onClick: handleRemoveAvatar, title: "X\u00F3a \u1EA3nh", children: _jsx(Trash2, { className: "h-5 w-5" }) }))] }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: handleFileChange })] }))] }), _jsx("h2", { className: "text-xl font-bold mt-4", children: user.full_name }), _jsxs("p", { className: "text-gray-600", children: ["@", user.username] }), _jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleBadgeColor(user.role)}`, children: getRoleLabel(user.role) })] }), _jsxs("div", { className: "border-t pt-4 space-y-3", children: [_jsxs("div", { className: "flex items-center text-sm", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2 text-gray-500" }), _jsx("span", { className: "text-gray-600", children: "Tham gia:" }), _jsx("span", { className: "ml-auto font-medium", children: new Date(user.created_at).toLocaleDateString("vi-VN") })] }), _jsxs("div", { className: "flex items-center text-sm", children: [_jsx(User, { className: "h-4 w-4 mr-2 text-gray-500" }), _jsx("span", { className: "text-gray-600", children: "ID:" }), _jsxs("span", { className: "ml-auto font-medium", children: ["#", user.id] })] })] })] })] }), _jsxs(Card, { className: "lg:col-span-2", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin chi ti\u1EBFt" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "full_name", children: [_jsx(User, { className: "h-4 w-4 inline mr-2" }), "H\u1ECD v\u00E0 t\u00EAn"] }), isEditing ? (_jsx(Input, { id: "full_name", value: formData.full_name, onChange: (e) => setFormData({ ...formData, full_name: e.target.value }) })) : (_jsx("p", { className: "text-gray-900 font-medium py-2", children: user.full_name }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "email", children: [_jsx(Mail, { className: "h-4 w-4 inline mr-2" }), "Email"] }), _jsx("p", { className: "text-gray-900 font-medium py-2", children: user.email })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "phone", children: [_jsx(Phone, { className: "h-4 w-4 inline mr-2" }), "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"] }), isEditing ? (_jsx(Input, { id: "phone", type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })) : (_jsx("p", { className: "text-gray-900 font-medium py-2", children: user.phone || user.phone_number || "Chưa cập nhật" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "date_of_birth", children: [_jsx(Calendar, { className: "h-4 w-4 inline mr-2" }), "Ng\u00E0y sinh"] }), isEditing ? (_jsx(Input, { id: "date_of_birth", type: "date", value: formData.date_of_birth, onChange: (e) => setFormData({
                                                        ...formData,
                                                        date_of_birth: e.target.value,
                                                    }) })) : (_jsx("p", { className: "text-gray-900 font-medium py-2", children: user.date_of_birth
                                                        ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                                                        : "Chưa cập nhật" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "gender", children: [_jsx(User, { className: "h-4 w-4 inline mr-2" }), "Gi\u1EDBi t\u00EDnh"] }), isEditing ? (_jsxs(Select, { value: formData.gender, onValueChange: (value) => setFormData({ ...formData, gender: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "male", children: "Nam" }), _jsx(SelectItem, { value: "female", children: "N\u1EEF" }), _jsx(SelectItem, { value: "other", children: "Kh\u00E1c" })] })] })) : (_jsx("p", { className: "text-gray-900 font-medium py-2", children: user.gender
                                                        ? getGenderLabel(user.gender)
                                                        : "Chưa cập nhật" }))] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsxs(Label, { htmlFor: "address", children: [_jsx(MapPin, { className: "h-4 w-4 inline mr-2" }), "\u0110\u1ECBa ch\u1EC9"] }), _jsxs("div", { className: "rounded-lg border bg-gray-50 px-3 py-3 min-h-[88px]", children: [_jsx("p", { className: "text-gray-900 font-medium leading-6", children: isAddressLoading ? "Đang tải..." : displayAddress }), defaultAddress && (_jsxs("p", { className: "mt-2 text-xs text-gray-500", children: [defaultAddress.recipient, " \u00B7 ", defaultAddress.phone_number] }))] })] })] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "B\u1EA3o m\u1EADt" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "M\u1EADt kh\u1EA9u" }), _jsx("p", { className: "text-sm text-gray-600", children: "Thay \u0111\u1ED5i m\u1EADt kh\u1EA9u \u0111\u1EC3 b\u1EA3o v\u1EC7 t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n" })] }), _jsxs(Button, { variant: "outline", onClick: () => {
                                        setIsPasswordDialogOpen(true);
                                    }, children: [_jsx(Lock, { className: "h-4 w-4 mr-2" }), "\u0110\u1ED5i m\u1EADt kh\u1EA9u"] })] }) })] }), _jsx(Dialog, { open: isPasswordDialogOpen, onOpenChange: setIsPasswordDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "\u0110\u1ED5i m\u1EADt kh\u1EA9u" }), _jsx(DialogDescription, { children: "Nh\u1EADp m\u1EADt kh\u1EA9u c\u0169 v\u00E0 m\u1EADt kh\u1EA9u m\u1EDBi c\u1EE7a b\u1EA1n" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "oldPassword", children: "M\u1EADt kh\u1EA9u c\u0169" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "oldPassword", type: showOldPassword ? "text" : "password", value: passwordForm.oldPassword, onChange: (e) => setPasswordForm({
                                                        ...passwordForm,
                                                        oldPassword: e.target.value,
                                                    }) }), _jsx("button", { type: "button", className: "absolute right-3 top-3", onClick: () => setShowOldPassword(!showOldPassword), children: showOldPassword ? (_jsx(EyeOff, { className: "h-4 w-4" })) : (_jsx(Eye, { className: "h-4 w-4" })) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "newPassword", children: "M\u1EADt kh\u1EA9u m\u1EDBi" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "newPassword", type: showNewPassword ? "text" : "password", value: passwordForm.newPassword, onChange: (e) => setPasswordForm({
                                                        ...passwordForm,
                                                        newPassword: e.target.value,
                                                    }) }), _jsx("button", { type: "button", className: "absolute right-3 top-3", onClick: () => setShowNewPassword(!showNewPassword), children: showNewPassword ? (_jsx(EyeOff, { className: "h-4 w-4" })) : (_jsx(Eye, { className: "h-4 w-4" })) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "X\u00E1c nh\u1EADn m\u1EADt kh\u1EA9u m\u1EDBi" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "confirmPassword", type: showConfirmPassword ? "text" : "password", value: passwordForm.confirmPassword, onChange: (e) => setPasswordForm({
                                                        ...passwordForm,
                                                        confirmPassword: e.target.value,
                                                    }) }), _jsx("button", { type: "button", className: "absolute right-3 top-3", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-4 w-4" })) : (_jsx(Eye, { className: "h-4 w-4" })) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setIsPasswordDialogOpen(false), children: "H\u1EE7y" }), _jsxs(Button, { onClick: handleChangePassword, disabled: isChangingPassword || !passwordChangeSupported, className: "bg-gray-900 hover:bg-gray-800", children: [isChangingPassword ? (_jsx(Lock, { className: "h-4 w-4 animate-spin" })) : (_jsx(Lock, { className: "h-4 w-4" })), "\u0110\u1ED5i m\u1EADt kh\u1EA9u"] })] })] }) })] }));
}
export function Account() {
    return _jsx(AccountContent, {});
}
