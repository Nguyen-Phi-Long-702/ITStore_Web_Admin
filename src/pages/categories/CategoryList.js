import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { generateSlug } from "../../utils/slugUtils";
export function CategoryList() {
    const { categories, products, addCategory, updateCategory, deleteCategory } = useData();
    const { permissions } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });
    const getProductCount = (categoryId) => {
        return products.filter((p) => p.category?.id === categoryId).length;
    };
    const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.category_code || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
    const handleAdd = () => {
        setSelectedCategory(null);
        setFormData({ name: "" });
        setDialogOpen(true);
    };
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
        });
        setDialogOpen(true);
    };
    const handleDelete = (category) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };
    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên danh mục");
            return;
        }
        const slug = generateSlug(formData.name);
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, {
                    name: formData.name,
                    slug: slug,
                });
                toast.success(`Đã cập nhật danh mục "${formData.name}"`);
            }
            else {
                await addCategory({
                    name: formData.name,
                    slug: slug,
                });
                toast.success(`Đã thêm danh mục "${formData.name}"`);
            }
            setDialogOpen(false);
            setFormData({ name: "" });
        }
        catch {
            toast.error("Không thể lưu dữ liệu lên backend");
        }
    };
    const confirmDelete = async () => {
        if (selectedCategory) {
            const productCount = getProductCount(selectedCategory.id);
            if (productCount > 0) {
                toast.error(`Không thể xóa danh mục "${selectedCategory.name}" vì còn ${productCount} sản phẩm`);
                setDeleteDialogOpen(false);
                setSelectedCategory(null);
                return;
            }
            try {
                await deleteCategory(selectedCategory.id);
                toast.success(`Đã xóa danh mục "${selectedCategory.name}"`);
                setDeleteDialogOpen(false);
                setSelectedCategory(null);
            }
            catch {
                toast.error("Không thể xóa danh mục trên backend");
            }
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD danh m\u1EE5c" }), _jsx("p", { className: "text-gray-600", children: "Qu\u1EA3n l\u00FD c\u00E1c danh m\u1EE5c s\u1EA3n ph\u1EA9m" })] }), permissions.canCreateCategory && (_jsxs(Button, { onClick: handleAdd, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Th\u00EAm danh m\u1EE5c"] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: categories.length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "T\u1ED5ng danh m\u1EE5c" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: products.length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "T\u1ED5ng s\u1EA3n ph\u1EA9m" })] }) }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "T\u00ECm ki\u1EBFm theo t\u00EAn ho\u1EB7c m\u00E3 danh m\u1EE5c...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }) }) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Danh s\u00E1ch danh m\u1EE5c (", filteredCategories.length, ")"] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "M\u00E3 danh m\u1EE5c" }), _jsx(TableHead, { children: "Danh m\u1EE5c" }), _jsx(TableHead, { children: "S\u1ED1 s\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: filteredCategories.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, className: "text-center py-8 text-gray-500", children: "Kh\u00F4ng t\u00ECm th\u1EA5y danh m\u1EE5c n\u00E0o" }) })) : (filteredCategories.map((category) => {
                                        const productCount = getProductCount(category.id);
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium text-[#E0872B]", children: category.category_code ||
                                                        `CAT${category.id.toString().padStart(6, "0")}` }), _jsx(TableCell, { children: _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { children: _jsx("p", { className: "font-medium", children: category.name }) }) }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-[#E0872B]", children: productCount }), _jsx("span", { className: "text-gray-500 text-sm", children: "s\u1EA3n ph\u1EA9m" })] }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [permissions.canEditCategory && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleEdit(category), children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), "S\u1EEDa"] })), permissions.canDeleteCategory && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(category), children: [_jsx(Trash2, { className: "h-4 w-4 mr-1 text-red-600" }), "X\u00F3a"] }))] }) })] }, category.id));
                                    })) })] }) })] }), _jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới" }), _jsx(DialogDescription, { children: selectedCategory
                                        ? "Cập nhật thông tin danh mục"
                                        : "Nhập thông tin danh mục mới" })] }), _jsx("div", { className: "space-y-4 py-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "name", children: ["T\u00EAn danh m\u1EE5c ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Input, { id: "name", placeholder: "Nh\u1EADp t\u00EAn danh m\u1EE5c", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { onClick: handleSubmit, children: selectedCategory ? "Cập nhật" : "Thêm" })] })] }) }), _jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "X\u00F3a danh m\u1EE5c" }), _jsxs(AlertDialogDescription, { children: ["B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\u00F3a danh m\u1EE5c \"", selectedCategory?.name, "\"?", selectedCategory && getProductCount(selectedCategory.id) > 0 && (_jsxs("span", { className: "block mt-2 text-red-600 font-semibold", children: ["Danh m\u1EE5c n\u00E0y c\u00F2n ", getProductCount(selectedCategory.id), " s\u1EA3n ph\u1EA9m. Vui l\u00F2ng chuy\u1EC3n s\u1EA3n ph\u1EA9m sang danh m\u1EE5c kh\u00E1c tr\u01B0\u1EDBc khi x\u00F3a."] }))] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "H\u1EE7y" }), _jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-red-600 hover:bg-red-700", children: "X\u00F3a" })] })] }) })] }));
}
