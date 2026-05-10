import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Search, Plus, Edit, Trash2, Upload, X, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
export function BrandList() {
    const { brands, products, addBrand, updateBrand, deleteBrand, brandFetchError, } = useData();
    const { permissions } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        logo_url: "",
        logo_file: undefined,
    });
    const getProductCount = (brandId) => {
        return products.filter((p) => p.brand?.id === brandId).length;
    };
    const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.brand_code || "").toLowerCase().includes(searchTerm.toLowerCase()));
    const handleAdd = () => {
        setSelectedBrand(null);
        setFormData({ name: "", logo_url: "", logo_file: undefined });
        setDialogOpen(true);
    };
    const handleEdit = (brand) => {
        setSelectedBrand(brand);
        setFormData({
            name: brand.name,
            logo_url: brand.logo_url || "",
            logo_file: undefined,
        });
        setDialogOpen(true);
    };
    const handleDelete = (brand) => {
        setSelectedBrand(brand);
        setDeleteDialogOpen(true);
    };
    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên thương hiệu");
            return;
        }
        try {
            if (selectedBrand) {
                await updateBrand(selectedBrand.id, {
                    name: formData.name,
                    logo_file: formData.logo_file,
                });
                toast.success(`Đã cập nhật thương hiệu "${formData.name}"`);
            }
            else {
                if (!formData.logo_file) {
                    toast.error("Vui lòng chọn logo thương hiệu");
                    return;
                }
                await addBrand({
                    name: formData.name,
                    logo_file: formData.logo_file,
                });
                toast.success(`Đã thêm thương hiệu "${formData.name}"`);
            }
            setDialogOpen(false);
            setFormData({ name: "", logo_url: "", logo_file: undefined });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Không thể lưu thương hiệu lên backend";
            toast.error(message);
        }
    };
    const confirmDelete = async () => {
        if (selectedBrand) {
            try {
                await deleteBrand(selectedBrand.id);
                toast.success(`Đã xóa thương hiệu "${selectedBrand.name}"`);
                setDeleteDialogOpen(false);
                setSelectedBrand(null);
            }
            catch {
                toast.error("Không thể xóa thương hiệu trên backend");
            }
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
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Kích thước ảnh không được vượt quá 2MB!");
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setFormData({ ...formData, logo_url: previewUrl, logo_file: file });
        toast.success("Đã tải logo lên thành công!");
    };
    const handleRemoveLogo = () => {
        setFormData({ ...formData, logo_url: "", logo_file: undefined });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast.success("Đã xóa logo!");
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD th\u01B0\u01A1ng hi\u1EC7u" }), _jsx("p", { className: "text-gray-600", children: "Qu\u1EA3n l\u00FD c\u00E1c th\u01B0\u01A1ng hi\u1EC7u s\u1EA3n ph\u1EA9m" })] }), permissions.canCreateBrand && (_jsxs(Button, { onClick: handleAdd, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Th\u00EAm th\u01B0\u01A1ng hi\u1EC7u"] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: brands.length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "T\u1ED5ng th\u01B0\u01A1ng hi\u1EC7u" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: products.length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "T\u1ED5ng s\u1EA3n ph\u1EA9m" })] }) }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "T\u00ECm ki\u1EBFm theo t\u00EAn ho\u1EB7c m\u00E3 th\u01B0\u01A1ng hi\u1EC7u...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }) }) }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: ["Danh s\u00E1ch th\u01B0\u01A1ng hi\u1EC7u (", filteredBrands.length, ")"] }), brandFetchError && (_jsx("p", { className: "text-sm text-red-600", children: brandFetchError.toLowerCase().includes("cloud_name")
                                    ? "Backend lỗi cấu hình ảnh (cloud_name), nên chưa lấy được danh sách thương hiệu"
                                    : `Không thể đồng bộ thương hiệu từ backend: ${brandFetchError}` }))] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "M\u00E3 th\u01B0\u01A1ng hi\u1EC7u" }), _jsx(TableHead, { children: "Th\u01B0\u01A1ng hi\u1EC7u" }), _jsx(TableHead, { children: "Logo" }), _jsx(TableHead, { children: "S\u1ED1 s\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: filteredBrands.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-gray-500", children: "Kh\u00F4ng t\u00ECm th\u1EA5y th\u01B0\u01A1ng hi\u1EC7u n\u00E0o" }) })) : (filteredBrands.map((brand) => {
                                        const productCount = getProductCount(brand.id);
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium text-[#E0872B]", children: brand.brand_code ||
                                                        `BRD${brand.id.toString().padStart(6, "0")}` }), _jsx(TableCell, { children: _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { children: _jsx("p", { className: "font-medium", children: brand.name }) }) }) }), _jsx(TableCell, { children: brand.logo_url ? (_jsx("img", { src: brand.logo_url, alt: brand.name, className: "h-8 w-8 object-contain", onError: (e) => {
                                                            e.currentTarget.style.display = "none";
                                                        } })) : (_jsx(Badge, { className: "bg-gray-100 text-gray-700", children: "Ch\u01B0a c\u00F3" })) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-[#E0872B]", children: productCount }), _jsx("span", { className: "text-gray-500 text-sm", children: "s\u1EA3n ph\u1EA9m" })] }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [permissions.canEditBrand && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleEdit(brand), children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), "S\u1EEDa"] })), permissions.canDeleteBrand && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(brand), children: [_jsx(Trash2, { className: "h-4 w-4 mr-1 text-red-600" }), "X\u00F3a"] }))] }) })] }, brand.id));
                                    })) })] }) })] }), _jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: selectedBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới" }), _jsx(DialogDescription, { children: selectedBrand
                                        ? "Cập nhật thông tin thương hiệu"
                                        : "Nhập thông tin thương hiệu mới" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "name", children: ["T\u00EAn th\u01B0\u01A1ng hi\u1EC7u ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Input, { id: "name", placeholder: "Nh\u1EADp t\u00EAn th\u01B0\u01A1ng hi\u1EC7u", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "logo_url", children: "URL Logo (t\u00F9y ch\u1ECDn)" }), _jsx(Input, { id: "logo_url", placeholder: "https://ten-thuong-hieu.com/logo.png", value: formData.logo_url, onChange: (e) => setFormData({
                                                ...formData,
                                                logo_url: e.target.value,
                                                logo_file: undefined,
                                            }) }), _jsx("p", { className: "text-sm text-gray-500", children: "Nh\u1EADp URL h\u00ECnh \u1EA3nh logo c\u1EE7a th\u01B0\u01A1ng hi\u1EC7u" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Logo hi\u1EC7n t\u1EA1i" }), _jsxs("div", { className: "flex items-center gap-4", children: [formData.logo_url ? (_jsxs("div", { className: "relative group", children: [_jsx("img", { src: formData.logo_url, alt: "Logo preview", className: "h-24 w-24 object-contain border-2 border-gray-200 rounded-lg p-2", onError: (e) => {
                                                                e.currentTarget.src = "";
                                                                e.currentTarget.style.display = "none";
                                                            } }), _jsx(Button, { variant: "destructive", size: "icon", className: "absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", onClick: handleRemoveLogo, children: _jsx(X, { className: "h-3 w-3" }) })] })) : (_jsx("div", { className: "h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50", children: _jsx(Image, { className: "h-8 w-8 text-gray-400" }) })), _jsxs("div", { className: "flex-1", children: [_jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: handleFileSelect, className: "w-full", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Ch\u1ECDn file t\u1EEB m\u00E1y t\u00EDnh"] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Ch\u1EA5p nh\u1EADn: JPG, PNG, GIF. T\u1ED1i \u0111a 2MB" }), _jsx("input", { type: "file", ref: fileInputRef, accept: "image/*", className: "hidden", onChange: handleFileChange })] })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { onClick: handleSubmit, children: selectedBrand ? "Cập nhật" : "Thêm" })] })] }) }), _jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "X\u00F3a th\u01B0\u01A1ng hi\u1EC7u" }), _jsxs(AlertDialogDescription, { children: ["B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\u00F3a th\u01B0\u01A1ng hi\u1EC7u \"", selectedBrand?.name, "\"? H\u00E0nh \u0111\u1ED9ng n\u00E0y kh\u00F4ng th\u1EC3 ho\u00E0n t\u00E1c."] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "H\u1EE7y" }), _jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-red-600 hover:bg-red-700", children: "X\u00F3a" })] })] }) })] }));
}
