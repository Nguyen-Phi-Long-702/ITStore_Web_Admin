import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select";
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
    const hydratedCouponIdRef = useRef(null);
    const [formData, setFormData] = useState({
        code: existingCoupon?.code || "",
        discount_type: existingCoupon?.discount_type || "percent",
        discount_value: existingCoupon?.discount_value || 0,
        min_order_value: existingCoupon?.min_order_value || 0,
        max_uses: existingCoupon?.max_uses || 100,
        expires_at: existingCoupon?.expires_at || "",
        is_active: existingCoupon?.is_active ?? true,
    });
    useEffect(() => {
        if (!isEdit) {
            hydratedCouponIdRef.current = null;
            return;
        }
        if (existingCoupon &&
            hydratedCouponIdRef.current !== existingCoupon.id.toString()) {
            setFormData({
                code: existingCoupon.code,
                discount_type: existingCoupon.discount_type,
                discount_value: existingCoupon.discount_value,
                min_order_value: existingCoupon.min_order_value || 0,
                max_uses: existingCoupon.max_uses || 100,
                expires_at: existingCoupon.expires_at || "",
                is_active: existingCoupon.is_active,
            });
            hydratedCouponIdRef.current = existingCoupon.id.toString();
        }
    }, [isEdit, existingCoupon]);
    const normalizeExpiresAt = (value) => {
        if (!value) {
            return undefined;
        }
        if (/Z$|[+-]\d{2}:\d{2}$/.test(value)) {
            return value;
        }
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
            return `${value}:00`;
        }
        return value;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.code || !formData.discount_value) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }
        const normalizedPayload = {
            ...formData,
            code: formData.code.trim().toUpperCase(),
            discount_value: Number(formData.discount_value),
            min_order_value: Number(formData.min_order_value) || 0,
            max_uses: Number(formData.max_uses) || 0,
            expires_at: normalizeExpiresAt(formData.expires_at) || "",
        };
        try {
            if (isEdit && existingCoupon) {
                await updateCoupon(existingCoupon.id, {
                    ...normalizedPayload,
                    used_count: existingCoupon.used_count || 0,
                });
                toast.success("Cập nhật mã giảm giá thành công");
            }
            else {
                await addCoupon({
                    ...normalizedPayload,
                    used_count: 0,
                });
                toast.success("Tạo mã giảm giá mới thành công");
            }
            navigate("/promotions");
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Không thể lưu mã giảm giá lên backend";
            toast.error(message);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/promotions"), children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới" }), _jsx("p", { className: "text-gray-600", children: isEdit
                                    ? "Cập nhật thông tin mã giảm giá"
                                    : "Tạo mã giảm giá hoặc coupon mới" })] })] }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin c\u01A1 b\u1EA3n" }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "code", children: "M\u00E3 gi\u1EA3m gi\u00E1 *" }), _jsx(Input, { id: "code", value: formData.code, onChange: (e) => setFormData({
                                                                    ...formData,
                                                                    code: e.target.value.toUpperCase(),
                                                                }), placeholder: "FREESHIP", className: "font-mono", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "discount_type", children: "Lo\u1EA1i gi\u1EA3m gi\u00E1" }), _jsxs(Select, { value: formData.discount_type, onValueChange: (value) => setFormData({ ...formData, discount_type: value }), children: [_jsx(SelectTrigger, { id: "discount_type", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "percent", children: "Gi\u1EA3m theo ph\u1EA7n tr\u0103m (%)" }), _jsx(SelectItem, { value: "fixed", children: "Gi\u1EA3m c\u1ED1 \u0111\u1ECBnh (VN\u0110)" })] })] })] }), _jsxs("div", { children: [_jsxs(Label, { htmlFor: "discount_value", children: ["Gi\u00E1 tr\u1ECB *", " ", formData.discount_type === "percent" ? "(%)" : "(VNĐ)"] }), _jsx(Input, { id: "discount_value", type: "number", value: formData.discount_value, onChange: (e) => setFormData({
                                                                    ...formData,
                                                                    discount_value: Number(e.target.value),
                                                                }), placeholder: formData.discount_type === "percent" ? "10" : "50000", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "min_order_value", children: "Gi\u00E1 tr\u1ECB \u0111\u01A1n t\u1ED1i thi\u1EC3u (VN\u0110)" }), _jsx(Input, { id: "min_order_value", type: "number", value: formData.min_order_value || "", onChange: (e) => setFormData({
                                                                    ...formData,
                                                                    min_order_value: Number(e.target.value),
                                                                }), placeholder: "0" })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u1EDDi gian v\u00E0 gi\u1EDBi h\u1EA1n" }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "expires_at", children: "Ng\u00E0y h\u1EBFt h\u1EA1n" }), _jsx(Input, { id: "expires_at", type: "datetime-local", value: formData.expires_at
                                                                    ? formData.expires_at.slice(0, 16)
                                                                    : "", onChange: (e) => setFormData({ ...formData, expires_at: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "max_uses", children: "Gi\u1EDBi h\u1EA1n s\u1ED1 l\u1EA7n s\u1EED d\u1EE5ng" }), _jsx(Input, { id: "max_uses", type: "number", value: formData.max_uses || "", onChange: (e) => setFormData({
                                                                    ...formData,
                                                                    max_uses: Number(e.target.value),
                                                                }), placeholder: "100" })] })] }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Tr\u1EA1ng th\u00E1i" }) }), _jsxs(CardContent, { children: [_jsx(Label, { htmlFor: "is_active", children: "Tr\u1EA1ng th\u00E1i m\u00E3" }), _jsxs(Select, { value: formData.is_active ? "active" : "inactive", onValueChange: (value) => setFormData({ ...formData, is_active: value === "active" }), children: [_jsx(SelectTrigger, { id: "is_active", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "active", children: "\u0110ang ch\u1EA1y" }), _jsx(SelectItem, { value: "inactive", children: "T\u1EA1m d\u1EEBng" })] })] })] })] }), formData.discount_value > 0 && (_jsxs(Card, { className: "bg-[#FFE0B2] border-[#E0872B]", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-[#E0872B]", children: "Xem tr\u01B0\u1EDBc" }) }), _jsxs(CardContent, { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[#E0872B]", children: "M\u00E3:" }), " ", _jsx("span", { className: "font-mono font-bold", children: formData.code })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[#E0872B]", children: "Gi\u1EA3m:" }), " ", formData.discount_type === "percent"
                                                            ? `${formData.discount_value}%`
                                                            : `${formData.discount_value.toLocaleString("vi-VN")}đ`] }), formData.min_order_value && formData.min_order_value > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-[#E0872B]", children: "\u0110\u01A1n t\u1ED1i thi\u1EC3u:" }), " ", formData.min_order_value.toLocaleString("vi-VN"), "\u0111"] }))] })] })), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs(Button, { type: "submit", className: "w-full", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), isEdit ? "Cập nhật" : "Tạo mới"] }), _jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: () => navigate("/promotions"), children: "H\u1EE7y" })] })] })] }) })] }));
}
