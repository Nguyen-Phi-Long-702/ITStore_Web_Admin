import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeft, Plus, AlertTriangle, Package, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select";
import { formatCurrency } from "../../utils/statusUtils";
import { ColorSwatch } from "../../components/products/ColorSwatch";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
export function InventoryManagement() {
    const navigate = useNavigate();
    const { products, updateProductVariant } = useData();
    const [stockInDialogOpen, setStockInDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [note, setNote] = useState("");
    const lowStockProducts = products.filter((p) => p.variants && p.variants.some((v) => v.stock > 0 && v.stock < 10));
    const handleStockIn = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(product.variants?.[0]?.id.toString() || "");
        setQuantity(0);
        setNote("");
        setStockInDialogOpen(true);
    };
    const confirmStockIn = () => {
        if (!quantity || quantity <= 0) {
            toast.error("Vui lòng nhập số lượng hợp lệ");
            return;
        }
        if (!selectedVariant) {
            toast.error("Vui lòng chọn biến thể");
            return;
        }
        const variant = selectedProduct?.variants?.find((v) => v.id.toString() === selectedVariant);
        if (variant) {
            updateProductVariant(variant.id, {
                stock: variant.stock + quantity,
            });
            toast.success(`Đã nhập ${quantity} ${selectedProduct?.name}${variant?.color ? ` - ${variant.color}` : ""}${variant?.version ? ` - ${variant.version}` : ""} vào kho`);
        }
        setStockInDialogOpen(false);
        setSelectedProduct(null);
        setSelectedVariant("");
        setQuantity(0);
        setNote("");
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/products"), children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD t\u1ED3n kho" }), _jsx("p", { className: "text-gray-600", children: "Nh\u1EADp h\u00E0ng v\u00E0 theo d\u00F5i c\u1EA3nh b\u00E1o t\u1ED3n kho" })] })] }), lowStockProducts.length > 0 && (_jsxs(Card, { className: "border-red-200 bg-red-50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-red-700", children: [_jsx(AlertTriangle, { className: "h-5 w-5" }), "C\u1EA3nh b\u00E1o: ", lowStockProducts.length, " s\u1EA3n ph\u1EA9m s\u1EAFp h\u1EBFt h\u00E0ng"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: lowStockProducts.map((product) => {
                                const lowStockVariants = product.variants?.filter((v) => v.stock > 0 && v.stock < 10);
                                const totalStock = product.variants
                                    ? product.variants.reduce((sum, v) => sum + v.stock, 0)
                                    : 0;
                                return (_jsxs("div", { className: "bg-white p-3 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center", children: _jsx(Package, { className: "h-6 w-6 text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: product.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [lowStockVariants?.length, " bi\u1EBFn th\u1EC3 s\u1EAFp h\u1EBFt"] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-right", children: _jsxs("p", { className: "text-red-600 font-medium", children: ["C\u00F2n ", totalStock] }) }), _jsxs(Button, { onClick: () => handleStockIn(product), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Nh\u1EADp h\u00E0ng"] })] })] }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: lowStockVariants?.map((variant) => (_jsxs("div", { className: "flex items-center gap-2 bg-red-50 px-2 py-1 rounded text-sm", children: [variant.color_hex && (_jsx(ColorSwatch, { color: variant.color, colorHex: variant.color_hex, size: "sm" })), _jsx("span", { className: "text-gray-700", children: variant.color || variant.version || variant.sku }), _jsxs("span", { className: "font-bold text-red-600", children: ["(", variant.stock, ")"] })] }, variant.id))) })] }, product.id));
                            }) }) })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "T\u1ED3n kho t\u1EA5t c\u1EA3 s\u1EA3n ph\u1EA9m" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "M\u00E3 s\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { children: "T\u00EAn s\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { children: "SKU" }), _jsx(TableHead, { children: "M\u00E0u s\u1EAFc" }), _jsx(TableHead, { children: "Phi\u00EAn b\u1EA3n" }), _jsx(TableHead, { children: "Danh m\u1EE5c" }), _jsx(TableHead, { children: "Th\u01B0\u01A1ng hi\u1EC7u" }), _jsx(TableHead, { className: "text-right", children: "Gi\u00E1" }), _jsx(TableHead, { className: "text-right", children: "T\u1ED3n kho" }), _jsx(TableHead, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: products.flatMap((product) => {
                                        const variants = product.variants || [];
                                        if (variants.length === 0)
                                            return null;
                                        return variants.map((variant, variantIndex) => {
                                            const isFirstVariant = variantIndex === 0;
                                            const stockStatus = variant.stock < 10
                                                ? "low"
                                                : variant.stock < 20
                                                    ? "medium"
                                                    : "ok";
                                            return (_jsxs(TableRow, { children: [isFirstVariant && (_jsx(TableCell, { rowSpan: variants.length, className: "font-medium text-[#E0872B]", children: product.product_code ||
                                                            `SP${product.id.toString().padStart(6, "0")}` })), isFirstVariant && (_jsx(TableCell, { rowSpan: variants.length, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gray-100 rounded flex items-center justify-center", children: _jsx(Package, { className: "h-5 w-5 text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: product.name }), _jsxs("p", { className: "text-sm text-gray-500", children: [variants.length, " bi\u1EBFn th\u1EC3"] })] })] }) })), _jsx(TableCell, { children: _jsx("code", { className: "text-sm bg-gray-100 px-2 py-1 rounded", children: variant.sku }) }), _jsx(TableCell, { children: variant.color ? (_jsxs("div", { className: "flex items-center gap-2", children: [variant.color_hex && (_jsx(ColorSwatch, { color: variant.color, colorHex: variant.color_hex, size: "sm" })), _jsx("span", { className: "text-sm", children: variant.color })] })) : (_jsx("span", { className: "text-sm text-gray-400", children: "-" })) }), _jsx(TableCell, { children: variant.version ? (_jsx(Badge, { variant: "outline", className: "text-xs", children: variant.version })) : (_jsx("span", { className: "text-sm text-gray-400", children: "-" })) }), isFirstVariant && (_jsx(TableCell, { rowSpan: variants.length, children: _jsx(Badge, { variant: "outline", children: product.category?.name || "-" }) })), isFirstVariant && (_jsx(TableCell, { rowSpan: variants.length, children: _jsxs("div", { className: "flex items-center gap-2", children: [product.brand?.logo_url ? (_jsx("img", { src: product.brand.logo_url, alt: product.brand.name, className: "h-6 w-6 object-contain" })) : null, _jsx("span", { className: "text-sm", children: product.brand?.name || "-" })] }) })), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-[#E0872B]", children: formatCurrency(variant.price) }), variant.compare_at_price &&
                                                                    variant.compare_at_price > variant.price && (_jsx("p", { className: "text-xs text-gray-400 line-through", children: formatCurrency(variant.compare_at_price) }))] }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { children: [_jsx("p", { className: `font-bold ${stockStatus === "low"
                                                                        ? "text-red-600"
                                                                        : stockStatus === "medium"
                                                                            ? "text-yellow-600"
                                                                            : "text-green-600"}`, children: variant.stock }), _jsx("p", { className: "text-xs text-gray-500", children: "T\u1ED1i thi\u1EC3u: 10" })] }) }), _jsx(TableCell, { children: variant.stock === 0 ? (_jsx(Badge, { className: "bg-red-100 text-red-700", children: "H\u1EBFt h\u00E0ng" })) : variant.stock < 10 ? (_jsx(Badge, { className: "bg-red-100 text-red-700", children: "C\u1EA7n nh\u1EADp" })) : variant.stock < 20 ? (_jsx(Badge, { className: "bg-yellow-100 text-yellow-700", children: "S\u1EAFp h\u1EBFt" })) : (_jsx(Badge, { className: "bg-green-100 text-green-700", children: "\u0110\u1EE7 h\u00E0ng" })) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/products/variants/${product.id}`, children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => {
                                                                        setSelectedProduct(product);
                                                                        setSelectedVariant(variant.id.toString());
                                                                        setQuantity(0);
                                                                        setNote("");
                                                                        setStockInDialogOpen(true);
                                                                    }, children: _jsx(Plus, { className: "h-4 w-4" }) })] }) })] }, `${product.id}-${variant.id}`));
                                        });
                                    }) })] }) })] }), _jsx(Dialog, { open: stockInDialogOpen, onOpenChange: setStockInDialogOpen, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Nh\u1EADp h\u00E0ng v\u00E0o kho" }), _jsx(DialogDescription, { children: "Nh\u1EADp th\u00F4ng tin phi\u1EBFu nh\u1EADp kho cho s\u1EA3n ph\u1EA9m \u0111\u00E3 ch\u1ECDn." })] }), selectedProduct && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded flex items-center justify-center", children: _jsx(Package, { className: "h-8 w-8 text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: selectedProduct.name }), _jsx("p", { className: "text-sm text-gray-600", children: selectedProduct.category?.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["T\u1ED5ng t\u1ED3n kho hi\u1EC7n t\u1EA1i:", " ", selectedProduct.variants
                                                            ? selectedProduct.variants.reduce((sum, v) => sum + v.stock, 0)
                                                            : 0] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "variant", children: "Ch\u1ECDn bi\u1EBFn th\u1EC3 *" }), _jsxs(Select, { value: selectedVariant, onValueChange: setSelectedVariant, children: [_jsx(SelectTrigger, { id: "variant", children: _jsx(SelectValue, { placeholder: "Ch\u1ECDn bi\u1EBFn th\u1EC3 \u0111\u1EC3 nh\u1EADp h\u00E0ng" }) }), _jsx(SelectContent, { children: selectedProduct.variants?.map((variant) => (_jsx(SelectItem, { value: variant.id.toString(), children: _jsxs("div", { className: "flex items-center gap-2", children: [variant.color_hex && (_jsx("div", { className: "w-4 h-4 rounded-full border", style: { backgroundColor: variant.color_hex } })), _jsxs("span", { children: [variant.sku, variant.color && ` - ${variant.color}`, variant.version && ` - ${variant.version}`, " (Tồn: " + variant.stock + ")"] })] }) }, variant.id))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "quantity", children: "S\u1ED1 l\u01B0\u1EE3ng nh\u1EADp *" }), _jsx(Input, { id: "quantity", type: "number", min: "1", value: quantity, onChange: (e) => setQuantity(Number(e.target.value)), placeholder: "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "note", children: "Ghi ch\u00FA" }), _jsx(Textarea, { id: "note", value: note, onChange: (e) => setNote(e.target.value), placeholder: "Nh\u1EADp kho t\u1EEB nh\u00E0 cung c\u1EA5p...", rows: 3 })] }), quantity > 0 && selectedVariant && (_jsx("div", { className: "p-3 bg-[#FFE0B2] rounded-lg", children: (() => {
                                        const variant = selectedProduct.variants?.find((v) => v.id.toString() === selectedVariant);
                                        return (_jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-sm text-[#E0872B]", children: ["T\u1ED3n kho sau khi nh\u1EADp:", " ", (variant?.stock || 0) + quantity] }), _jsxs("p", { className: "text-sm text-[#E0872B]", children: ["Gi\u00E1 tr\u1ECB nh\u1EADp:", " ", formatCurrency((variant?.price || 0) * quantity)] })] }));
                                    })() }))] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setStockInDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { onClick: confirmStockIn, children: "X\u00E1c nh\u1EADn nh\u1EADp kho" })] })] }) })] }));
}
