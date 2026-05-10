import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../../components/ui/alert-dialog";
import { formatCurrency, productStatusConfig } from "../../utils/statusUtils";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
function ProductThumbnail({ src, alt }) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) {
        return (_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0", children: _jsx(Package, { className: "h-6 w-6 text-gray-400" }) }));
    }
    return (_jsx("img", { src: src, alt: alt, className: "w-12 h-12 object-cover rounded flex-shrink-0", onError: () => setFailed(true) }));
}
function StatusBadge({ status }) {
    const config = productStatusConfig[status];
    if (!config) {
        return _jsx(Badge, { variant: "outline", children: status });
    }
    return (_jsx(Badge, { className: `${config.bgColor} ${config.color}`, children: config.label }));
}
export function ProductList() {
    const { products, productFetchError, deleteProduct } = useData();
    const { permissions } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [colorFilter, setColorFilter] = useState("all");
    const [versionFilter, setVersionFilter] = useState("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const categories = Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)));
    const colors = Array.from(new Set(products.flatMap((p) => p.variants?.map((v) => v.color).filter(Boolean) ?? [])));
    const versions = Array.from(new Set(products.flatMap((p) => p.variants?.map((v) => v.version).filter(Boolean) ?? [])));
    const filteredProducts = products.filter((product) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(term) ||
            (product.sku ?? "").toLowerCase().includes(term) ||
            (product.variants?.some((v) => v.sku.toLowerCase().includes(term)) ?? false);
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || product.category?.name === categoryFilter;
        const matchesColor = colorFilter === "all" ||
            (product.variants?.some((v) => v.color === colorFilter) ?? false);
        const matchesVersion = versionFilter === "all" ||
            (product.variants?.some((v) => v.version === versionFilter) ?? false);
        return matchesSearch && matchesStatus && matchesCategory && matchesColor && matchesVersion;
    });
    const handleDelete = (product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };
    const confirmDelete = async (e) => {
        e.preventDefault();
        if (!productToDelete || isDeleting)
            return;
        setIsDeleting(true);
        try {
            await deleteProduct(productToDelete.id);
            setDeleteDialogOpen(false);
            setProductToDelete(null);
            toast.success("Sản phẩm đã được xóa thành công!");
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD s\u1EA3n ph\u1EA9m" }), _jsx("p", { className: "text-gray-600", children: "Qu\u1EA3n l\u00FD th\u00F4ng tin s\u1EA3n ph\u1EA9m v\u00E0 t\u1ED3n kho" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/products/inventory", children: _jsxs(Button, { variant: "outline", children: [_jsx(Package, { className: "h-4 w-4 mr-2" }), "Qu\u1EA3n l\u00FD kho"] }) }), _jsx(Link, { to: "/products/new", children: _jsxs(Button, { children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Th\u00EAm s\u1EA3n ph\u1EA9m"] }) })] })] }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4", children: [_jsxs("div", { className: "md:col-span-2 lg:col-span-2 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "T\u00ECm ki\u1EBFm theo t\u00EAn ho\u1EB7c SKU...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Tr\u1EA1ng th\u00E1i" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i" }), _jsx(SelectItem, { value: "available", children: "\u0110ang kinh doanh" }), _jsx(SelectItem, { value: "out_of_stock", children: "H\u1EBFt h\u00E0ng" }), _jsx(SelectItem, { value: "discontinued", children: "Ng\u1EEBng kinh doanh" })] })] }), _jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Danh m\u1EE5c" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "T\u1EA5t c\u1EA3 danh m\u1EE5c" }), categories.map((category) => (_jsx(SelectItem, { value: category, children: category }, category)))] })] }), _jsxs(Select, { value: colorFilter, onValueChange: setColorFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "M\u00E0u s\u1EAFc" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "T\u1EA5t c\u1EA3 m\u00E0u" }), colors.map((color) => (_jsx(SelectItem, { value: color, children: color }, color)))] })] }), _jsxs(Select, { value: versionFilter, onValueChange: setVersionFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Phi\u00EAn b\u1EA3n" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "T\u1EA5t c\u1EA3 phi\u00EAn b\u1EA3n" }), versions.map((version) => (_jsx(SelectItem, { value: version, children: version }, version)))] })] })] }), (colorFilter !== "all" || versionFilter !== "all") && (_jsxs("div", { className: "flex items-center gap-2 mt-4 pt-4 border-t", children: [_jsx("span", { className: "text-sm text-gray-600", children: "L\u1ECDc theo:" }), colorFilter !== "all" && (_jsxs(Badge, { variant: "outline", className: "bg-[#FFE0B2]", children: ["M\u00E0u: ", colorFilter, _jsx("button", { onClick: () => setColorFilter("all"), className: "ml-2 hover:text-red-600", children: "\u00D7" })] })), versionFilter !== "all" && (_jsxs(Badge, { variant: "outline", className: "bg-green-50", children: ["Phi\u00EAn b\u1EA3n: ", versionFilter, _jsx("button", { onClick: () => setVersionFilter("all"), className: "ml-2 hover:text-red-600", children: "\u00D7" })] }))] }))] }) }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: ["Danh s\u00E1ch s\u1EA3n ph\u1EA9m (", filteredProducts.length, ")"] }), productFetchError && (_jsxs("p", { className: "text-sm text-red-600", children: ["Kh\u00F4ng th\u1EC3 \u0111\u1ED3ng b\u1ED9 s\u1EA3n ph\u1EA9m t\u1EEB backend: ", productFetchError] }))] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "S\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { children: "SKU bi\u1EBFn th\u1EC3" }), _jsx(TableHead, { children: "M\u00E0u s\u1EAFc" }), _jsx(TableHead, { children: "Phi\u00EAn b\u1EA3n" }), _jsx(TableHead, { children: "Danh m\u1EE5c" }), _jsx(TableHead, { children: "Th\u01B0\u01A1ng hi\u1EC7u" }), _jsx(TableHead, { className: "text-right", children: "Gi\u00E1 b\u00E1n" }), _jsx(TableHead, { className: "text-right", children: "T\u1ED3n kho" }), _jsx(TableHead, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: filteredProducts.map((product) => {
                                        const variants = product.variants ?? [];
                                        if (variants.length === 0) {
                                            return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ProductThumbnail, { src: product.primary_image, alt: product.name }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: product.name }), _jsx("p", { className: "text-xs text-gray-500", children: product.sku || "" })] })] }) }), _jsx(TableCell, { className: "text-gray-400", children: "-" }), _jsx(TableCell, { className: "text-gray-400", children: "-" }), _jsx(TableCell, { className: "text-gray-400", children: "-" }), _jsx(TableCell, { children: product.category?.name || "-" }), _jsx(TableCell, { children: product.brand?.name || "-" }), _jsx(TableCell, { className: "text-right", children: product.price_min != null ? (_jsxs("span", { children: [formatCurrency(product.price_min), product.price_max != null &&
                                                                    product.price_max !== product.price_min && (_jsxs("span", { className: "text-gray-400", children: [" ", "\u2013 ", formatCurrency(product.price_max)] }))] })) : (_jsx("span", { className: "text-gray-400", children: "-" })) }), _jsx(TableCell, { className: "text-right text-gray-400", children: "-" }), _jsx(TableCell, { children: _jsx(StatusBadge, { status: product.status }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/products/variants/${product.id}`, children: _jsx(Button, { variant: "ghost", size: "icon", title: "Xem bi\u1EBFn th\u1EC3", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), permissions.canEditProduct && (_jsx(Link, { to: `/products/edit/${product.id}`, children: _jsx(Button, { variant: "ghost", size: "icon", title: "Ch\u1EC9nh s\u1EEDa", children: _jsx(Edit, { className: "h-4 w-4" }) }) })), permissions.canDeleteProduct && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(product), title: "X\u00F3a", children: _jsx(Trash2, { className: "h-4 w-4 text-red-600" }) }))] }) })] }, `${product.id}-empty`));
                                        }
                                        return variants.map((variant, index) => (_jsxs(TableRow, { children: [index === 0 && (_jsx(TableCell, { rowSpan: variants.length, className: "align-top", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ProductThumbnail, { src: product.primary_image, alt: product.name }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: product.name }), _jsxs("p", { className: "text-xs text-gray-500", children: [variants.length, " bi\u1EBFn th\u1EC3"] })] })] }) })), _jsx(TableCell, { children: _jsx(Badge, { variant: "outline", className: "text-xs font-mono", children: variant.sku }) }), _jsx(TableCell, { children: variant.color ? (_jsx("span", { className: "text-sm", children: variant.color })) : (_jsx("span", { className: "text-sm text-gray-400", children: "-" })) }), _jsx(TableCell, { children: variant.version ? (_jsx(Badge, { variant: "outline", className: "text-xs", children: variant.version })) : (_jsx("span", { className: "text-sm text-gray-400", children: "-" })) }), index === 0 && (_jsx(TableCell, { rowSpan: variants.length, className: "align-top", children: product.category?.name || "-" })), index === 0 && (_jsx(TableCell, { rowSpan: variants.length, className: "align-top", children: product.brand?.name || "-" })), _jsx(TableCell, { className: "text-right", children: formatCurrency(variant.price) }), _jsx(TableCell, { className: "text-right", children: _jsx("span", { className: variant.stock < 10 ? "text-red-600 font-semibold" : "", children: variant.stock }) }), index === 0 && (_jsx(TableCell, { rowSpan: variants.length, className: "align-top", children: _jsx(StatusBadge, { status: product.status }) })), index === 0 && (_jsx(TableCell, { className: "text-right align-top", rowSpan: variants.length, children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/products/variants/${product.id}`, children: _jsx(Button, { variant: "ghost", size: "icon", title: "Xem bi\u1EBFn th\u1EC3", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), permissions.canEditProduct && (_jsx(Link, { to: `/products/edit/${product.id}`, children: _jsx(Button, { variant: "ghost", size: "icon", title: "Ch\u1EC9nh s\u1EEDa", children: _jsx(Edit, { className: "h-4 w-4" }) }) })), permissions.canDeleteProduct && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(product), title: "X\u00F3a", children: _jsx(Trash2, { className: "h-4 w-4 text-red-600" }) }))] }) }))] }, `${product.id}-${variant.id}`)));
                                    }) })] }) })] }), _jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "X\u00E1c nh\u1EADn x\u00F3a s\u1EA3n ph\u1EA9m" }), _jsxs(AlertDialogDescription, { children: ["B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\u00F3a s\u1EA3n ph\u1EA9m \"", productToDelete?.name, "\"? H\u00E0nh \u0111\u1ED9ng n\u00E0y kh\u00F4ng th\u1EC3 ho\u00E0n t\u00E1c."] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { disabled: isDeleting, children: "H\u1EE7y" }), _jsx(AlertDialogAction, { onClick: confirmDelete, disabled: isDeleting, children: isDeleting ? "Đang xóa..." : "Xóa" })] })] }) })] }));
}
