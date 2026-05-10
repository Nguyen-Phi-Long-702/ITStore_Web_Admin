import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Filter, ArrowUpDown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { formatCurrency, formatDate } from "../../utils/statusUtils";
import { useData } from "../../contexts/DataContext";
const returnStatusConfig = {
    pending: {
        label: "Chờ duyệt",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
    },
    approved: {
        label: "Đã chấp nhận",
        color: "text-[#E0872B]",
        bgColor: "bg-[#FFE0B2]",
    },
    rejected: { label: "Từ chối", color: "text-red-700", bgColor: "bg-red-100" },
    received: {
        label: "Đã nhận hàng",
        color: "text-[#E0872B]",
        bgColor: "bg-[#FFE0B2]",
    },
    completed: {
        label: "Hoàn thành",
        color: "text-green-700",
        bgColor: "bg-green-100",
    },
};
export function ReturnList() {
    const navigate = useNavigate();
    const { returnRequests } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    let filteredReturns = returnRequests.filter((returnRequest) => {
        const returnCode = `YC${returnRequest.id.toString().padStart(6, "0")}`;
        const orderCode = returnRequest.order_id
            ? `DH${returnRequest.order_id.toString().padStart(6, "0")}`
            : "";
        const customerName = (returnRequest.user?.full_name || "").toLowerCase();
        const matchesSearch = returnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || returnRequest.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    filteredReturns.sort((a, b) => {
        if (sortBy === "date") {
            return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        else {
            return (b.refund_amount || 0) - (a.refund_amount || 0);
        }
    });
    const stats = {
        total: returnRequests.length,
        pending: returnRequests.filter((r) => r.status === "pending").length,
        approved: returnRequests.filter((r) => r.status === "approved").length,
        completed: returnRequests.filter((r) => r.status === "completed").length,
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD tr\u1EA3 h\u00E0ng" }), _jsx("p", { className: "text-gray-600", children: "X\u1EED l\u00FD y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng v\u00E0 ho\u00E0n ti\u1EC1n" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold", children: stats.total }), _jsx("p", { className: "text-sm text-gray-600", children: "T\u1ED5ng y\u00EAu c\u1EA7u" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600", children: stats.pending }), _jsx("p", { className: "text-sm text-gray-600", children: "Ch\u1EDD duy\u1EC7t" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold text-[#E0872B]", children: stats.approved }), _jsx("p", { className: "text-sm text-gray-600", children: "\u0110\u00E3 ch\u1EA5p nh\u1EADn" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.completed }), _jsx("p", { className: "text-sm text-gray-600", children: "Ho\u00E0n th\u00E0nh" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Danh s\u00E1ch y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-6", children: [_jsx(Input, { placeholder: "T\u00ECm ki\u1EBFm theo m\u00E3 y\u00EAu c\u1EA7u ho\u1EB7c m\u00E3 \u0111\u01A1n h\u00E0ng...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "md:w-96" }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsxs(SelectTrigger, { className: "md:w-48", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), _jsx(SelectValue, { placeholder: "Tr\u1EA1ng th\u00E1i" })] }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i" }), _jsx(SelectItem, { value: "pending", children: "Ch\u1EDD duy\u1EC7t" }), _jsx(SelectItem, { value: "approved", children: "\u0110\u00E3 ch\u1EA5p nh\u1EADn" }), _jsx(SelectItem, { value: "rejected", children: "T\u1EEB ch\u1ED1i" }), _jsx(SelectItem, { value: "received", children: "\u0110\u00E3 nh\u1EADn h\u00E0ng" }), _jsx(SelectItem, { value: "completed", children: "Ho\u00E0n th\u00E0nh" })] })] }), _jsxs(Select, { value: sortBy, onValueChange: (v) => setSortBy(v), children: [_jsxs(SelectTrigger, { className: "md:w-48", children: [_jsx(ArrowUpDown, { className: "h-4 w-4 mr-2" }), _jsx(SelectValue, {})] }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "date", children: "S\u1EAFp x\u1EBFp theo ng\u00E0y" }), _jsx(SelectItem, { value: "amount", children: "S\u1EAFp x\u1EBFp theo s\u1ED1 ti\u1EC1n" })] })] })] }), _jsx("div", { className: "border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "M\u00E3 y\u00EAu c\u1EA7u" }), _jsx(TableHead, { children: "M\u00E3 \u0111\u01A1n h\u00E0ng" }), _jsx(TableHead, { children: "Kh\u00E1ch h\u00E0ng" }), _jsx(TableHead, { children: "L\u00FD do" }), _jsx(TableHead, { children: "S\u1ED1 ti\u1EC1n ho\u00E0n" }), _jsx(TableHead, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(TableHead, { children: "Ng\u00E0y t\u1EA1o" }), _jsx(TableHead, { className: "text-right", children: "Thao t\u00E1c" })] }) }), _jsx(TableBody, { children: filteredReturns.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, className: "text-center py-8 text-gray-500", children: "Kh\u00F4ng t\u00ECm th\u1EA5y y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng n\u00E0o" }) })) : (filteredReturns.map((returnRequest) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "font-medium text-[#E0872B]", children: ["YC", returnRequest.id.toString().padStart(6, "0")] }), _jsx(TableCell, { children: _jsxs("button", { onClick: () => navigate(`/orders/${returnRequest.order_id}`), className: "text-[#E0872B] hover:underline", children: ["DH", returnRequest.order_id.toString().padStart(6, "0")] }) }), _jsx(TableCell, { children: returnRequest.user?.full_name }), _jsx(TableCell, { className: "max-w-xs", children: _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "truncate", children: returnRequest.reason }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [_jsxs("span", { children: [returnRequest.items?.length || 0, " s\u1EA3n ph\u1EA9m"] }), returnRequest.images &&
                                                                            returnRequest.images.length > 0 && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsxs("span", { children: [returnRequest.images.length, " \u1EA3nh"] })] }))] })] }) }), _jsx(TableCell, { children: returnRequest.refund_amount
                                                            ? formatCurrency(returnRequest.refund_amount)
                                                            : "-" }), _jsx(TableCell, { children: _jsx(Badge, { className: `${returnStatusConfig[returnRequest.status].bgColor} ${returnStatusConfig[returnRequest.status].color}`, children: returnStatusConfig[returnRequest.status].label }) }), _jsx(TableCell, { children: formatDate(returnRequest.created_at) }), _jsx(TableCell, { className: "text-right", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/returns/${returnRequest.id}`), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Chi ti\u1EBFt"] }) })] }, returnRequest.id)))) })] }) })] })] })] }));
}
