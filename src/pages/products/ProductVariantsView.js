import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit, Package, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { formatCurrency } from "../../utils/statusUtils";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
export function ProductVariantsView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, updateProductVariant } = useData();
    const product = products.find((p) => p.id.toString() === id);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [stockChange, setStockChange] = useState(0);
    const [stockNote, setStockNote] = useState("");
    if (!product) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-600", children: "Kh\u00F4ng t\u00ECm th\u1EA5y s\u1EA3n ph\u1EA9m" }), _jsx(Button, { onClick: () => navigate("/products"), className: "mt-4", children: "Quay l\u1EA1i danh s\u00E1ch" })] }));
    }
    const handleStockUpdate = (variant) => {
        setSelectedVariant(variant);
        setStockChange(0);
        setStockNote("");
        setStockDialogOpen(true);
    };
    const confirmStockUpdate = () => {
        if (stockChange === 0) {
            toast.error("Vui lòng nhập số lượng thay đổi");
            return;
        }
        const newStock = selectedVariant.stock + stockChange;
        if (newStock < 0) {
            toast.error("Số lượng tồn kho không thể âm");
            return;
        }
        toast.success(`Đã ${stockChange > 0 ? "nhập" : "xuất"} ${Math.abs(stockChange)} sản phẩm`);
        setStockDialogOpen(false);
        updateProductVariant(selectedVariant.id, {
            ...selectedVariant,
            stock: newStock,
        });
    };
    const variantsByColor = product.variants?.reduce((acc, variant) => {
        const key = variant.color || "Không phân loại";
        if (!acc[key])
            acc[key] = [];
        acc[key].push(variant);
        return acc;
    }, {});
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    const totalValue = product.variants?.reduce((sum, v) => sum + v.stock * v.price, 0) || 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/products"), children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: product.name }), _jsx("p", { className: "text-gray-600", children: "Qu\u1EA3n l\u00FD bi\u1EBFn th\u1EC3 v\u00E0 t\u1ED3n kho theo m\u00E0u s\u1EAFc, phi\u00EAn b\u1EA3n" })] })] }), _jsxs(Button, { onClick: () => navigate(`/products/edit/${product.id}`), children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Ch\u1EC9nh s\u1EEDa s\u1EA3n ph\u1EA9m"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold", children: product.variants?.length || 0 }), _jsx("p", { className: "text-sm text-gray-600", children: "T\u1ED5ng bi\u1EBFn th\u1EC3" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold text-[#E0872B]", children: totalStock }), _jsx("p", { className: "text-sm text-gray-600", children: "T\u1ED5ng t\u1ED3n kho" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: formatCurrency(totalValue) }), _jsx("p", { className: "text-sm text-gray-600", children: "Gi\u00E1 tr\u1ECB kho" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: Object.keys(variantsByColor || {}).length }), _jsx("p", { className: "text-sm text-gray-600", children: "M\u00E0u s\u1EAFc" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "T\u1EA5t c\u1EA3 bi\u1EBFn th\u1EC3" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "SKU" }), _jsx(TableHead, { children: "M\u00E0u s\u1EAFc" }), _jsx(TableHead, { children: "Phi\u00EAn b\u1EA3n" }), _jsx(TableHead, { className: "text-right", children: "Gi\u00E1 b\u00E1n" }), _jsx(TableHead, { className: "text-right", children: "Gi\u00E1 g\u1ED1c" }), _jsx(TableHead, { className: "text-right", children: "T\u1ED3n kho" }), _jsx(TableHead, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: product.variants?.map((variant) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-mono text-sm", children: variant.sku }), _jsx(TableCell, { children: variant.color ? (_jsx("span", { className: "text-sm", children: variant.color })) : ("-") }), _jsx(TableCell, { children: variant.version || "-" }), _jsx(TableCell, { className: "text-right font-semibold text-green-600", children: formatCurrency(variant.price) }), _jsx(TableCell, { className: "text-right text-gray-500", children: variant.compare_at_price
                                                    ? formatCurrency(variant.compare_at_price)
                                                    : "-" }), _jsx(TableCell, { className: "text-right", children: _jsx("span", { className: `font-bold ${variant.stock < 10
                                                        ? "text-red-600"
                                                        : variant.stock < 20
                                                            ? "text-yellow-600"
                                                            : "text-gray-900"}`, children: variant.stock }) }), _jsx(TableCell, { children: variant.is_active ? (_jsx(Badge, { className: "bg-green-100 text-green-700", children: "Ho\u1EA1t \u0111\u1ED9ng" })) : (_jsx(Badge, { className: "bg-gray-100 text-gray-700", children: "T\u1EA1m d\u1EEBng" })) }), _jsx(TableCell, { className: "text-right", children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleStockUpdate(variant), children: [_jsx(Package, { className: "h-4 w-4 mr-1" }), "C\u1EADp nh\u1EADt kho"] }) })] }, variant.id))) })] }) })] }), _jsx(Dialog, { open: stockDialogOpen, onOpenChange: setStockDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "C\u1EADp nh\u1EADt t\u1ED3n kho" }), _jsx(DialogDescription, { children: "\u0110i\u1EC1u ch\u1EC9nh s\u1ED1 l\u01B0\u1EE3ng t\u1ED3n kho cho bi\u1EBFn th\u1EC3 \u0111\u00E3 ch\u1ECDn." })] }), selectedVariant && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: product.name }), _jsx("p", { className: "text-sm text-gray-600", children: selectedVariant.sku }), selectedVariant.color && (_jsxs("p", { className: "text-xs text-gray-500", children: ["M\u00E0u: ", selectedVariant.color] })), selectedVariant.version && (_jsxs("p", { className: "text-xs text-gray-500", children: ["Phi\u00EAn b\u1EA3n: ", selectedVariant.version] }))] }), _jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t", children: [_jsx("span", { className: "text-sm text-gray-600", children: "T\u1ED3n kho hi\u1EC7n t\u1EA1i:" }), _jsx("span", { className: "font-bold", children: selectedVariant.stock })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "stockChange", children: "Thay \u0111\u1ED5i s\u1ED1 l\u01B0\u1EE3ng (d\u01B0\u01A1ng: nh\u1EADp, \u00E2m: xu\u1EA5t) *" }), _jsx(Input, { id: "stockChange", type: "number", value: stockChange, onChange: (e) => setStockChange(Number(e.target.value)), placeholder: "+10 ho\u1EB7c -5" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "stockNote", children: "Ghi ch\u00FA" }), _jsx(Input, { id: "stockNote", value: stockNote, onChange: (e) => setStockNote(e.target.value), placeholder: "L\u00FD do thay \u0111\u1ED5i..." })] }), stockChange !== 0 && (_jsx("div", { className: `p-3 rounded-lg ${selectedVariant.stock + stockChange < 0
                                        ? "bg-red-50"
                                        : "bg-[#FFE0B2]"}`, children: selectedVariant.stock + stockChange < 0 ? (_jsxs("div", { className: "flex items-center gap-2 text-red-700", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx("p", { className: "text-sm", children: "L\u1ED7i: S\u1ED1 l\u01B0\u1EE3ng t\u1ED3n kho kh\u00F4ng th\u1EC3 \u00E2m" })] })) : (_jsxs("p", { className: "text-sm text-[#E0872B]", children: ["T\u1ED3n kho sau khi ", stockChange > 0 ? "nhập" : "xuất", ":", " ", _jsx("span", { className: "font-bold", children: selectedVariant.stock + stockChange })] })) }))] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setStockDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { onClick: confirmStockUpdate, children: "X\u00E1c nh\u1EADn" })] })] }) })] }));
}
