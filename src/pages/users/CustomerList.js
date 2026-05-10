import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, User, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../../components/ui/alert-dialog";
import { formatCurrency } from "../../utils/statusUtils";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
export function CustomerList() {
    const { customers, updateCustomer } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const filteredCustomers = customers.filter((customer) => customer.customer_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number?.includes(searchTerm));
    const handleToggleBlock = (customer) => {
        setSelectedCustomer(customer);
        setBlockDialogOpen(true);
    };
    const confirmToggleBlock = async () => {
        if (!selectedCustomer || isUpdatingStatus) {
            return;
        }
        const newActive = !selectedCustomer.is_active;
        setIsUpdatingStatus(true);
        try {
            await updateCustomer(selectedCustomer.id, { is_active: newActive });
            toast.success(`Đã ${!newActive ? "khóa" : "mở khóa"} tài khoản ${selectedCustomer.full_name}`);
            setBlockDialogOpen(false);
            setSelectedCustomer(null);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Không thể cập nhật trạng thái tài khoản";
            toast.error(message);
        }
        finally {
            setIsUpdatingStatus(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD kh\u00E1ch h\u00E0ng" }), _jsx("p", { className: "text-gray-600", children: "Xem v\u00E0 qu\u1EA3n l\u00FD t\u00E0i kho\u1EA3n kh\u00E1ch h\u00E0ng" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-[#E0872B]", children: customers.length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "T\u1ED5ng kh\u00E1ch h\u00E0ng" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-green-600", children: customers.filter((c) => c.is_active).length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "\u0110ang ho\u1EA1t \u0111\u1ED9ng" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-red-600", children: customers.filter((c) => !c.is_active).length }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "\u0110\u00E3 kh\u00F3a" })] }) }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "T\u00ECm ki\u1EBFm theo m\u00E3 KH, t\u00EAn, email ho\u1EB7c S\u0110T...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }) }) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Danh s\u00E1ch kh\u00E1ch h\u00E0ng (", filteredCustomers.length, ")"] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "M\u00E3 KH" }), _jsx(TableHead, { children: "Kh\u00E1ch h\u00E0ng" }), _jsx(TableHead, { children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { className: "text-right", children: "\u0110\u01A1n h\u00E0ng" }), _jsx(TableHead, { className: "text-right", children: "T\u1ED5ng chi ti\u00EAu" }), _jsx(TableHead, { children: "X\u00E1c th\u1EF1c" }), _jsx(TableHead, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: filteredCustomers.map((customer) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium text-[#E0872B]", children: customer.customer_code ||
                                                    `KH${customer.id.toString().padStart(6, "0")}` }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-3", children: [customer.avatar_url ? (_jsx("img", { src: customer.avatar_url, alt: customer.full_name, className: "w-10 h-10 rounded-full object-cover", onError: (e) => {
                                                                e.currentTarget.style.display = "none";
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    const fallback = document.createElement("div");
                                                                    fallback.className =
                                                                        "w-10 h-10 rounded-full bg-[#FFE0B2] flex items-center justify-center";
                                                                    fallback.innerHTML =
                                                                        '<svg class="h-5 w-5 text-[#E0872B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                                                                    parent.insertBefore(fallback, e.currentTarget);
                                                                }
                                                            } })) : (_jsx("div", { className: "w-10 h-10 rounded-full bg-[#FFE0B2] flex items-center justify-center", children: _jsx(User, { className: "h-5 w-5 text-[#E0872B]" }) })), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: customer.full_name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["ID: ", customer.id] })] })] }) }), _jsx(TableCell, { children: customer.phone_number || "-" }), _jsx(TableCell, { children: customer.email }), _jsx(TableCell, { className: "text-right", children: customer.totalOrders ?? 0 }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(customer.totalSpent ?? 0) }), _jsx(TableCell, { children: _jsx(Badge, { className: customer.is_verified
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700", children: customer.is_verified ? "Đã xác thực" : "Chưa xác thực" }) }), _jsx(TableCell, { children: _jsx(Badge, { className: customer.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700", children: customer.is_active ? "Hoạt động" : "Vô hiệu" }) }), _jsx(TableCell, { className: "text-right", children: _jsx("div", { className: "flex justify-end gap-2", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleToggleBlock(customer), children: [customer.is_active ? (_jsx(XCircle, { className: "h-4 w-4 mr-1 text-red-600" })) : (_jsx(CheckCircle, { className: "h-4 w-4 mr-1 text-green-600" })), customer.is_active ? "Vô hiệu hóa" : "Kích hoạt"] }) }) })] }, customer.id))) })] }) })] }), _jsx(AlertDialog, { open: blockDialogOpen, onOpenChange: setBlockDialogOpen, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsxs(AlertDialogTitle, { children: [selectedCustomer?.is_active ? "Khóa" : "Mở khóa", " t\u00E0i kho\u1EA3n"] }), _jsxs(AlertDialogDescription, { children: ["B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n", " ", selectedCustomer?.is_active ? "khóa" : "mở khóa", " t\u00E0i kho\u1EA3n c\u1EE7a \"", selectedCustomer?.full_name, "\"?"] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "H\u1EE7y" }), _jsx(AlertDialogAction, { onClick: confirmToggleBlock, disabled: isUpdatingStatus, children: isUpdatingStatus ? "Đang xử lý..." : "Xác nhận" })] })] }) })] }));
}
