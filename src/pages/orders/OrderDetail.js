import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Package, User, MapPin, FileText, XCircle, CheckCircle, Truck, RotateCcw, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { formatCurrency, formatDate, orderStatusConfig, paymentStatusConfig, paymentMethodLabels, } from "../../utils/statusUtils";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { orderService } from "../../services/orderService";
export function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orders, returnRequests, updateOrder } = useData();
    const order = orders.find((o) => o.id.toString() === id);
    const [detailOrder, setDetailOrder] = useState(order);
    useEffect(() => {
        if (!id)
            return;
        orderService.getDetail(Number(id))
            .then((data) => setDetailOrder(data))
            .catch(() => { });
    }, [id]);
    const displayOrder = detailOrder || order;
    const [orderStatus, setOrderStatus] = useState(order?.order_status || "pending");
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [returnReason, setReturnReason] = useState("");
    if (!order) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-600", children: "Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u01A1n h\u00E0ng" }), _jsx(Button, { onClick: () => navigate("/orders"), className: "mt-4", children: "Quay l\u1EA1i danh s\u00E1ch" })] }));
    }
    const orderNumber = `DH${order.id.toString().padStart(6, "0")}`;
    const hasReturnRequest = returnRequests.some((r) => r.order_id === order.id);
    const handleUpdateStatus = async (newStatus) => {
        try {
            await updateOrder(order.id, { order_status: newStatus });
            setOrderStatus(newStatus);
            toast.success(`Đã cập nhật trạng thái: ${orderStatusConfig[newStatus].label}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
            toast.error(message);
        }
    };
    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng nhập lý do hủy đơn");
            return;
        }
        try {
            await updateOrder(order.id, {
                order_status: "cancelled",
                cancel_reason: cancelReason.trim(),
            });
            setOrderStatus("cancelled");
            toast.success("Đã hủy đơn hàng");
            setCancelDialogOpen(false);
            setCancelReason("");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Không thể hủy đơn hàng";
            toast.error(message);
        }
    };
    const handleRefund = () => {
        updateOrder(order.id, { payment_status: "refunded" });
        toast.success(`Đã hoàn tiền ${formatCurrency(order.total)} cho khách hàng`);
        setRefundDialogOpen(false);
    };
    const handleCreateReturnRequest = () => {
        if (!returnReason.trim()) {
            toast.error("Vui lòng nhập lý do trả hàng");
            return;
        }
        toast.success("Đã tạo yêu cầu trả hàng");
        setReturnDialogOpen(false);
        setTimeout(() => {
            navigate("/returns");
        }, 1000);
    };
    const handlePrint = () => {
        window.print();
    };
    const orderTimeline = [
        { status: "pending", label: "Chờ xác nhận", completed: true },
        {
            status: "confirmed",
            label: "Đã xác nhận",
            completed: [
                "confirmed",
                "preparing",
                "packed",
                "shipping",
                "delivered",
            ].includes(orderStatus),
        },
        {
            status: "preparing",
            label: "Chuẩn bị hàng",
            completed: ["preparing", "packed", "shipping", "delivered"].includes(orderStatus),
        },
        {
            status: "packed",
            label: "Đã đóng gói",
            completed: ["packed", "shipping", "delivered"].includes(orderStatus),
        },
        {
            status: "shipping",
            label: "Đang giao",
            completed: ["shipping", "delivered"].includes(orderStatus),
        },
        {
            status: "delivered",
            label: "Hoàn thành",
            completed: orderStatus === "delivered",
        },
    ];
    const shippingAddress = order.address
        ? `${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`
        : "Chưa có địa chỉ";
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @media print {
            @page { size: A6 portrait; margin: 3mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; font-size: 11px; }
            aside, header { display: none !important; }
            main { overflow: visible !important; padding: 0 !important; }
            #root, .h-screen, .flex-1 { height: auto !important; overflow: visible !important; display: block !important; }
          }
        ` }), _jsxs("div", { className: "space-y-6 print:hidden", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/orders"), children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Chi ti\u1EBFt \u0111\u01A1n h\u00E0ng" }), _jsx("p", { className: "text-gray-600", children: orderNumber })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", onClick: handlePrint, children: [_jsx(FileText, { className: "h-4 w-4 mr-2" }), "In phi\u1EBFu"] }), hasReturnRequest && (_jsxs(Button, { variant: "outline", onClick: () => {
                                            const returnReq = returnRequests.find((r) => r.order_id === order.id);
                                            if (returnReq)
                                                navigate(`/returns/${returnReq.id}`);
                                        }, children: [_jsx(RotateCcw, { className: "h-4 w-4 mr-2" }), "Xem y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng"] })), orderStatus !== "cancelled" && orderStatus !== "delivered" && (_jsxs(Button, { variant: "destructive", onClick: () => setCancelDialogOpen(true), children: [_jsx(XCircle, { className: "h-4 w-4 mr-2" }), "H\u1EE7y \u0111\u01A1n"] }))] })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "flex items-center justify-between", children: orderTimeline.map((step, index) => (_jsxs("div", { className: "flex items-center flex-1", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-200 text-gray-500"}`, children: step.completed ? (_jsx(CheckCircle, { className: "h-5 w-5" })) : (_jsx("div", { className: "w-3 h-3 rounded-full bg-gray-400" })) }), _jsx("p", { className: `text-sm mt-2 text-center ${step.completed ? "font-medium" : "text-gray-500"}`, children: step.label })] }), index < orderTimeline.length - 1 && (_jsx("div", { className: `flex-1 h-1 mx-2 ${step.completed ? "bg-green-500" : "bg-gray-200"}` }))] }, step.status))) }) }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "S\u1EA3n ph\u1EA9m \u0111\u00E3 \u0111\u1EB7t" }) }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "S\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { className: "text-right", children: "\u0110\u01A1n gi\u00E1" }), _jsx(TableHead, { className: "text-right", children: "S\u1ED1 l\u01B0\u1EE3ng" }), _jsx(TableHead, { className: "text-right", children: "Th\u00E0nh ti\u1EC1n" })] }) }), _jsx(TableBody, { children: displayOrder?.items?.map((item) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center", children: _jsx(Package, { className: "h-6 w-6 text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: item.variant?.product?.name }), _jsx("p", { className: "text-sm text-gray-600", children: item.variant?.sku })] })] }) }), _jsx(TableCell, { className: "text-right", children: formatCurrency(item.unit_price) }), _jsx(TableCell, { className: "text-right", children: item.quantity }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(item.subtotal) })] }, item.id))) })] }), _jsxs("div", { className: "mt-4 space-y-2 border-t pt-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "T\u1EA1m t\u00EDnh:" }), _jsx("span", { children: formatCurrency(order.subtotal) })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Ph\u00ED v\u1EADn chuy\u1EC3n:" }), _jsx("span", { children: formatCurrency(order.shipping_fee) })] }), order.discount_amount > 0 && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Gi\u1EA3m gi\u00E1:" }), _jsxs("span", { className: "text-red-600", children: ["-", formatCurrency(order.discount_amount)] })] })), _jsxs("div", { className: "flex justify-between text-lg font-bold border-t pt-2", children: [_jsx("span", { children: "T\u1ED5ng c\u1ED9ng:" }), _jsx("span", { className: "text-[#E0872B]", children: formatCurrency(order.total) })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin kh\u00E1ch h\u00E0ng" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(User, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "T\u00EAn kh\u00E1ch h\u00E0ng" }), _jsx("p", { className: "font-medium", children: order.user?.full_name })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "\u0110\u1ECBa ch\u1EC9 giao h\u00E0ng" }), _jsx("p", { className: "font-medium", children: shippingAddress })] })] }), order.note && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Package, { className: "h-5 w-5 text-gray-400 mt-1" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Ghi ch\u00FA" }), _jsx("p", { className: "font-medium", children: order.note })] })] }))] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "C\u1EADp nh\u1EADt tr\u1EA1ng th\u00E1i" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Tr\u1EA1ng th\u00E1i hi\u1EC7n t\u1EA1i" }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { className: `${orderStatusConfig[orderStatus].bgColor} ${orderStatusConfig[orderStatus].color}`, children: orderStatusConfig[orderStatus].label }) })] }), orderStatus === "pending" && (_jsx("div", { className: "space-y-2", children: _jsxs(Button, { className: "w-full", onClick: () => handleUpdateStatus("confirmed"), children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "X\u00E1c nh\u1EADn \u0111\u01A1n h\u00E0ng"] }) })), orderStatus === "confirmed" && (_jsxs(Button, { className: "w-full", onClick: () => handleUpdateStatus("preparing"), children: [_jsx(Package, { className: "h-4 w-4 mr-2" }), "B\u1EAFt \u0111\u1EA7u chu\u1EA9n b\u1ECB h\u00E0ng"] })), orderStatus === "preparing" && (_jsxs(Button, { className: "w-full", onClick: () => handleUpdateStatus("packed"), children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "\u0110\u00E3 \u0111\u00F3ng g\u00F3i xong"] })), orderStatus === "packed" && (_jsxs(Button, { className: "w-full", onClick: () => handleUpdateStatus("shipping"), children: [_jsx(Truck, { className: "h-4 w-4 mr-2" }), "Giao cho \u0111\u01A1n v\u1ECB v\u1EADn chuy\u1EC3n"] })), orderStatus === "shipping" && (_jsxs(Button, { className: "w-full", onClick: () => handleUpdateStatus("delivered"), children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Giao h\u00E0ng th\u00E0nh c\u00F4ng"] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Thanh to\u00E1n" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Ph\u01B0\u01A1ng th\u1EE9c" }), _jsx("p", { className: "font-medium", children: paymentMethodLabels[order.payment_method] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Tr\u1EA1ng th\u00E1i" }), _jsx(Badge, { className: `${paymentStatusConfig[order.payment_status].bgColor} ${paymentStatusConfig[order.payment_status].color}`, children: paymentStatusConfig[order.payment_status].label })] }), order.payment_status === "paid" &&
                                                        (orderStatus === "cancelled" || orderStatus === "failed") && (_jsx(Button, { variant: "outline", className: "w-full", onClick: () => setRefundDialogOpen(true), children: "Ho\u00E0n ti\u1EC1n" }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin \u0111\u01A1n h\u00E0ng" }) }), _jsxs(CardContent, { className: "space-y-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Ng\u00E0y \u0111\u1EB7t" }), _jsx("p", { className: "font-medium", children: formatDate(order.created_at) })] }), order.updated_at && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "C\u1EADp nh\u1EADt l\u1EA7n cu\u1ED1i" }), _jsx("p", { className: "font-medium", children: formatDate(order.updated_at) })] }))] })] })] })] }), _jsx(Dialog, { open: cancelDialogOpen, onOpenChange: setCancelDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "H\u1EE7y \u0111\u01A1n h\u00E0ng" }), _jsx(DialogDescription, { children: "Vui l\u00F2ng nh\u1EADp l\u00FD do h\u1EE7y \u0111\u01A1n h\u00E0ng. Th\u00F4ng tin n\u00E0y s\u1EBD \u0111\u01B0\u1EE3c g\u1EEDi \u0111\u1EBFn kh\u00E1ch h\u00E0ng." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Vui l\u00F2ng nh\u1EADp l\u00FD do h\u1EE7y \u0111\u01A1n h\u00E0ng" }), _jsx(Textarea, { value: cancelReason, onChange: (e) => setCancelReason(e.target.value), placeholder: "V\u00ED d\u1EE5: S\u1EA3n ph\u1EA9m h\u1EBFt h\u00E0ng, kh\u00E1ch h\u00E0ng y\u00EAu c\u1EA7u h\u1EE7y...", rows: 4 })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setCancelDialogOpen(false), children: "\u0110\u00F3ng" }), _jsx(Button, { variant: "destructive", onClick: handleCancelOrder, children: "X\u00E1c nh\u1EADn h\u1EE7y" })] })] }) }), _jsx(Dialog, { open: refundDialogOpen, onOpenChange: setRefundDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "X\u00E1c nh\u1EADn ho\u00E0n ti\u1EC1n" }), _jsx(DialogDescription, { children: "X\u00E1c nh\u1EADn ho\u00E0n ti\u1EC1n cho kh\u00E1ch h\u00E0ng qua ph\u01B0\u01A1ng th\u1EE9c thanh to\u00E1n \u0111\u00E3 s\u1EED d\u1EE5ng." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["X\u00E1c nh\u1EADn ho\u00E0n ti\u1EC1n ", formatCurrency(order.total), " cho kh\u00E1ch h\u00E0ng?"] }), _jsx("div", { className: "p-4 bg-[#FFE0B2] rounded-lg", children: _jsxs("p", { className: "text-sm text-[#E0872B]", children: ["S\u1ED1 ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c ho\u00E0n l\u1EA1i qua ph\u01B0\u01A1ng th\u1EE9c thanh to\u00E1n:", " ", paymentMethodLabels[order.payment_method]] }) })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setRefundDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { onClick: handleRefund, children: "X\u00E1c nh\u1EADn ho\u00E0n ti\u1EC1n" })] })] }) }), _jsx(Dialog, { open: returnDialogOpen, onOpenChange: setReturnDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "T\u1EA1o y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng" }), _jsx(DialogDescription, { children: "Nh\u1EADp l\u00FD do tr\u1EA3 h\u00E0ng \u0111\u1EC3 t\u1EA1o y\u00EAu c\u1EA7u m\u1EDBi trong h\u1EC7 th\u1ED1ng." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Vui l\u00F2ng nh\u1EADp l\u00FD do tr\u1EA3 h\u00E0ng" }), _jsx(Textarea, { value: returnReason, onChange: (e) => setReturnReason(e.target.value), placeholder: "V\u00ED d\u1EE5: S\u1EA3n ph\u1EA9m kh\u00F4ng \u0111\u00FAng, kh\u00E1ch h\u00E0ng y\u00EAu c\u1EA7u tr\u1EA3 l\u1EA1i...", rows: 4 })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setReturnDialogOpen(false), children: "\u0110\u00F3ng" }), _jsx(Button, { onClick: handleCreateReturnRequest, children: "X\u00E1c nh\u1EADn t\u1EA1o y\u00EAu c\u1EA7u" })] })] }) })] }), _jsxs("div", { className: "hidden print:block p-2 bg-white text-black font-sans max-w-[105mm] mx-auto text-xs", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("div", { className: "flex-1 flex justify-start", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-8 h-8 bg-[#E0872B] rounded flex items-center justify-center text-white font-bold text-base", children: "I" }), _jsx("span", { className: "font-bold text-base whitespace-nowrap", children: "IT Store" })] }) }), _jsxs("div", { className: "text-center flex-[2]", children: [_jsx("h1", { className: "text-lg font-bold uppercase mb-1 whitespace-nowrap", children: "Phi\u1EBFu Giao H\u00E0ng" }), _jsxs("p", { className: "text-[10px] text-gray-600", children: ["M\u00E3 \u0111\u01A1n h\u00E0ng: ", _jsx("span", { className: "font-medium text-black", children: orderNumber })] }), _jsxs("p", { className: "text-[10px] text-gray-600", children: ["Ng\u00E0y \u0111\u1EB7t: ", _jsx("span", { className: "font-medium text-black", children: formatDate(order.created_at) })] })] }), _jsx("div", { className: "flex-1" })] }), _jsxs("div", { className: "mb-4 border-b border-dashed border-gray-300 pb-3", children: [_jsx("h2", { className: "font-bold text-sm mb-2 text-gray-800", children: "Th\u00F4ng tin ng\u01B0\u1EDDi nh\u1EADn" }), _jsxs("div", { className: "space-y-1 text-[11px]", children: [_jsxs("p", { className: "flex", children: [_jsx("span", { className: "text-gray-600 w-16 flex-shrink-0", children: "Kh\u00E1ch h\u00E0ng:" }), " ", _jsx("span", { className: "font-medium", children: order.user?.full_name })] }), _jsxs("p", { className: "flex", children: [_jsx("span", { className: "text-gray-600 w-16 flex-shrink-0", children: "\u0110\u1ECBa ch\u1EC9:" }), " ", _jsx("span", { className: "font-medium", children: shippingAddress })] }), order.note && _jsxs("p", { className: "flex", children: [_jsx("span", { className: "text-gray-600 w-16 flex-shrink-0", children: "Ghi ch\u00FA:" }), " ", _jsx("span", { className: "font-medium", children: order.note })] }), _jsxs("p", { className: "flex", children: [_jsx("span", { className: "text-gray-600 w-16 flex-shrink-0", children: "Thanh to\u00E1n:" }), " ", _jsx("span", { className: "font-medium whitespace-nowrap", children: paymentMethodLabels[order.payment_method] })] })] })] }), _jsxs("table", { className: "w-full mb-4 border-collapse text-[10px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-800", children: [_jsx("th", { className: "text-left py-1 font-bold", children: "S\u1EA3n ph\u1EA9m" }), _jsx("th", { className: "text-center py-1 font-bold w-6", children: "SL" }), _jsx("th", { className: "text-right py-1 font-bold w-14", children: "\u0110\u01A1n gi\u00E1" }), _jsx("th", { className: "text-right py-1 font-bold w-16", children: "Th\u00E0nh ti\u1EC1n" })] }) }), _jsx("tbody", { children: displayOrder?.items?.map((item) => (_jsxs("tr", { className: "border-b border-dashed border-gray-200", children: [_jsxs("td", { className: "py-2 pr-2", children: [_jsx("p", { className: "font-medium text-gray-800 line-clamp-2", children: item.variant?.product?.name }), _jsxs("p", { className: "text-[9px] text-gray-500 mt-0.5", children: ["SKU: ", item.variant?.sku] })] }), _jsx("td", { className: "text-center py-2 font-medium", children: item.quantity }), _jsx("td", { className: "text-right py-2", children: formatCurrency(item.unit_price) }), _jsx("td", { className: "text-right py-2 font-medium", children: formatCurrency(item.subtotal) })] }, item.id))) })] }), _jsx("div", { className: "flex justify-end pt-1 mb-4 text-[11px]", children: _jsxs("div", { className: "w-2/3 space-y-1", children: [_jsxs("div", { className: "flex justify-between text-gray-600", children: [_jsx("span", { children: "T\u1EA1m t\u00EDnh:" }), _jsx("span", { className: "font-medium text-black", children: formatCurrency(order.subtotal) })] }), _jsxs("div", { className: "flex justify-between text-gray-600", children: [_jsx("span", { children: "Ph\u00ED v\u1EADn chuy\u1EC3n:" }), _jsx("span", { className: "font-medium text-black", children: formatCurrency(order.shipping_fee) })] }), order.discount_amount > 0 && (_jsxs("div", { className: "flex justify-between text-gray-600", children: [_jsx("span", { children: "Gi\u1EA3m gi\u00E1:" }), _jsxs("span", { className: "font-medium text-red-600", children: ["-", formatCurrency(order.discount_amount)] })] })), _jsxs("div", { className: "flex justify-between font-bold text-[13px] border-t border-gray-800 pt-1.5 mt-1.5", children: [_jsx("span", { children: "T\u1ED5ng c\u1ED9ng:" }), _jsx("span", { children: formatCurrency(order.total) })] })] }) }), _jsxs("div", { className: "mt-6 flex gap-2", children: [_jsx("div", { className: "w-1/2", children: _jsxs("div", { className: "border border-gray-300 rounded p-2 h-full bg-gray-50", children: [_jsx("p", { className: "font-bold text-gray-800 text-[10px] mb-1", children: "Ch\u1EC9 d\u1EABn giao h\u00E0ng:" }), _jsxs("ul", { className: "text-[9px] text-gray-600 list-disc pl-3 space-y-0.5", children: [_jsx("li", { children: "Cho kh\u00E1ch xem h\u00E0ng v\u00E0 \u0111\u1ED3ng ki\u1EC3m." }), _jsx("li", { children: "Chuy\u1EC3n ho\u00E0n sau 3 l\u1EA7n ph\u00E1t." }), _jsx("li", { children: "L\u01B0u kho t\u1ED1i \u0111a 5 ng\u00E0y." }), _jsx("li", { children: "H\u00E0ng d\u1EC5 v\u1EE1, xin nh\u1EB9 tay." })] })] }) }), _jsx("div", { className: "w-1/2", children: _jsxs("div", { className: "border-2 border-dashed border-gray-400 rounded-lg p-2 flex flex-col items-center min-h-[90px]", children: [_jsx("p", { className: "font-bold text-gray-800 text-[11px] uppercase mb-1 whitespace-nowrap", children: "Ch\u1EEF k\u00FD ng\u01B0\u1EDDi nh\u1EADn" }), _jsx("p", { className: "text-[8px] text-gray-500 mb-2 whitespace-nowrap", children: "X\u00E1c nh\u1EADn h\u00E0ng nguy\u00EAn v\u1EB9n, kh\u00F4ng m\u00F3p/m\u00E9o, b\u1EC3 v\u1EE1" })] }) })] }), _jsx("div", { className: "text-center mt-6 pt-2 border-t border-gray-200 text-[9px] text-gray-500 italic", children: "C\u1EA3m \u01A1n qu\u00FD kh\u00E1ch \u0111\u00E3 mua s\u1EAFm t\u1EA1i c\u1EEDa h\u00E0ng!" })] })] }));
}
