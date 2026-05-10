import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { formatCurrency, formatDateOnly } from "../../utils/statusUtils";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
export function PromotionList() {
    const { coupons, deleteCoupon } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCoupons = coupons.filter((coupon) => coupon.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleDelete = (id, code) => {
        if (confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${code}"?`)) {
            deleteCoupon(id);
            toast.success("Đã xóa mã giảm giá");
        }
    };
    const isExpired = (promotion) => {
        return !!(promotion.expires_at && new Date(promotion.expires_at) < new Date());
    };
    const isOutOfUses = (promotion) => {
        return !!(promotion.max_uses !== undefined &&
            promotion.max_uses !== null &&
            promotion.max_uses > 0 &&
            (promotion.used_count || 0) >= promotion.max_uses);
    };
    const getStatusBadge = (promotion) => {
        if (isExpired(promotion)) {
            return _jsx(Badge, { className: "bg-rose-100 text-rose-700", children: "\u0110\u00E3 h\u1EBFt h\u1EA1n" });
        }
        if (isOutOfUses(promotion)) {
            return (_jsx(Badge, { className: "bg-orange-100 text-orange-700", children: "\u0110\u00E3 h\u1EBFt l\u01B0\u1EE3t" }));
        }
        if (!promotion.is_active) {
            return _jsx(Badge, { className: "bg-slate-100 text-slate-700", children: "T\u1EA1m d\u1EEBng" });
        }
        return _jsx(Badge, { className: "bg-emerald-100 text-emerald-700", children: "\u0110ang ch\u1EA1y" });
    };
    const getStatusOrder = (promotion) => {
        if (isExpired(promotion))
            return 3;
        if (isOutOfUses(promotion))
            return 2;
        if (!promotion.is_active)
            return 1;
        return 0;
    };
    const isActuallyActive = (promotion) => {
        if (isExpired(promotion))
            return false;
        if (isOutOfUses(promotion))
            return false;
        if (!promotion.is_active)
            return false;
        return true;
    };
    const sortedCoupons = [...filteredCoupons].sort((a, b) => {
        const statusOrderDiff = getStatusOrder(a) - getStatusOrder(b);
        if (statusOrderDiff !== 0) {
            return statusOrderDiff;
        }
        const aCreatedAt = new Date(a.created_at).getTime();
        const bCreatedAt = new Date(b.created_at).getTime();
        return bCreatedAt - aCreatedAt;
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD khuy\u1EBFn m\u00E3i" }), _jsx("p", { className: "text-gray-600", children: "T\u1EA1o v\u00E0 qu\u1EA3n l\u00FD m\u00E3 gi\u1EA3m gi\u00E1" })] }), _jsx(Link, { to: "/promotions/new", children: _jsxs(Button, { children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "T\u1EA1o m\u00E3 gi\u1EA3m gi\u00E1"] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-green-600", children: coupons.filter((c) => isActuallyActive(c)).length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "\u0110ang ch\u1EA1y" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: coupons.reduce((sum, c) => sum + (c.used_count || 0), 0) }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "L\u01B0\u1EE3t s\u1EED d\u1EE5ng" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: coupons
                                            .filter((c) => isActuallyActive(c))
                                            .reduce((sum, c) => sum +
                                            (c.max_uses && c.max_uses > 0
                                                ? Math.max(0, c.max_uses - (c.used_count || 0))
                                                : 0), 0) }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "C\u00F2n kh\u1EA3 d\u1EE5ng" })] }) }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "T\u00ECm ki\u1EBFm theo m\u00E3 gi\u1EA3m gi\u00E1...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }) }) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Danh s\u00E1ch m\u00E3 gi\u1EA3m gi\u00E1 (", filteredCoupons.length, ")"] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "M\u00E3 gi\u1EA3m gi\u00E1" }), _jsx(TableHead, { children: "Lo\u1EA1i" }), _jsx(TableHead, { children: "Gi\u00E1 tr\u1ECB" }), _jsx(TableHead, { children: "\u0110\u01A1n t\u1ED1i thi\u1EC3u" }), _jsx(TableHead, { children: "S\u1EED d\u1EE5ng" }), _jsx(TableHead, { children: "H\u1EBFt h\u1EA1n" }), _jsx(TableHead, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: sortedCoupons.map((promotion) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("p", { className: "font-medium font-mono", children: promotion.code }) }), _jsx(TableCell, { children: promotion.discount_type === "percent"
                                                    ? "Phần trăm"
                                                    : "Cố định" }), _jsx(TableCell, { className: "font-medium", children: promotion.discount_type === "percent"
                                                    ? `${promotion.discount_value}%`
                                                    : formatCurrency(promotion.discount_value) }), _jsx(TableCell, { children: promotion.min_order_value
                                                    ? formatCurrency(promotion.min_order_value)
                                                    : "-" }), _jsx(TableCell, { children: _jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [promotion.used_count || 0, " /", " ", promotion.max_uses || "∞"] }), promotion.max_uses && (_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-1", children: _jsx("div", { className: "bg-[#E0872B] h-2 rounded-full", style: {
                                                                    width: `${Math.min(100, Math.max(0, ((promotion.used_count || 0) /
                                                                        promotion.max_uses) *
                                                                        100))}%`,
                                                                } }) }))] }) }), _jsx(TableCell, { children: promotion.expires_at
                                                    ? formatDateOnly(promotion.expires_at)
                                                    : "Không giới hạn" }), _jsx(TableCell, { children: getStatusBadge(promotion) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/promotions/edit/${promotion.id}`, children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(promotion.id, promotion.code), children: _jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })] }) })] }, promotion.id))) })] }) })] })] }));
}
