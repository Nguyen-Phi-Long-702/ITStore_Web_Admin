import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, Package, User, Phone, Mail, Calendar, DollarSign, Image as ImageIcon, ZoomIn, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { formatCurrency, formatDate } from "../../utils/statusUtils";
import { ReturnConditionBadge } from "../../components/returns/ReturnConditionBadge";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { orderService } from "../../services/orderService";
import { returnService } from "../../services/returnService";
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
export function ReturnDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { returnRequests, updateReturnRequest, orderItems, productVariants, orders } = useData();
    const listReturnRequest = returnRequests.find((r) => r.id.toString() === id);
    const [returnRequest, setReturnRequest] = useState(listReturnRequest);
    const [orderDetail, setOrderDetail] = useState(undefined);
    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        const loadReturnDetail = async () => {
            try {
                const detail = await returnService.getDetail(parseInt(id, 10));
                if (isMounted) {
                    setReturnRequest(detail);
                }
            }
            catch {
                if (isMounted) {
                    setReturnRequest(listReturnRequest);
                }
            }
        };
        loadReturnDetail();
        return () => {
            isMounted = false;
        };
    }, [id, listReturnRequest]);
    useEffect(() => {
        const orderId = returnRequest?.order_id;
        if (!orderId)
            return;
        let isMounted = true;
        const loadOrderDetail = async () => {
            try {
                const detail = await orderService.getDetail(orderId);
                if (isMounted) {
                    setOrderDetail(detail);
                }
            }
            catch {
                if (isMounted) {
                    setOrderDetail(undefined);
                }
            }
        };
        loadOrderDetail();
        return () => {
            isMounted = false;
        };
    }, [returnRequest?.order_id]);
    const resolvedOrder = orderDetail ?? orders.find((order) => String(order.id) === String(returnRequest?.order_id)) ?? returnRequest?.order;
    const resolvedOrderItems = resolvedOrder?.items ?? resolvedOrder?.order_items ?? [];
    const returnItems = (returnRequest?.items ?? returnRequest?.return_items ?? []).map((item) => {
        const resolvedOrderItem = item.order_item ??
            resolvedOrderItems.find((orderItem) => String(orderItem.id) === String(item.order_item_id)) ??
            orderItems.find((orderItem) => String(orderItem.id) === String(item.order_item_id));
        const resolvedVariant = resolvedOrderItem?.variant ??
            resolvedOrderItem?.product_variant ??
            productVariants.find((variant) => String(variant.id) === String(resolvedOrderItem?.variant_id));
        return {
            ...item,
            condition: item.condition ?? item.return_condition,
            order_item: resolvedOrderItem
                ? { ...resolvedOrderItem, variant: resolvedVariant }
                : item.order_item,
        };
    });
    const [status, setStatus] = useState(returnRequest?.status || "pending");
    const [adminNote, setAdminNote] = useState(returnRequest?.admin_note || "");
    const [refundAmount, setRefundAmount] = useState(returnRequest?.refund_amount?.toString() || "");
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!returnRequest) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-600", children: "Kh\u00F4ng t\u00ECm th\u1EA5y y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng" }), _jsx(Button, { onClick: () => navigate("/returns"), className: "mt-4", children: "Quay l\u1EA1i danh s\u00E1ch" })] }));
    }
    const returnNumber = `YC${returnRequest.id.toString().padStart(6, "0")}`;
    const orderNumber = `DH${returnRequest.order_id.toString().padStart(6, "0")}`;
    const handleApprove = async () => {
        if (!refundAmount || parseFloat(refundAmount) <= 0) {
            toast.error("Vui lòng nhập số tiền hoàn hợp lệ");
            return;
        }
        setIsSubmitting(true);
        try {
            await updateReturnRequest(returnRequest.id, {
                status: "approved",
                admin_note: adminNote,
                refund_amount: parseFloat(refundAmount),
            });
            setStatus("approved");
            toast.success("Đã chấp nhận yêu cầu trả hàng");
            setApproveDialogOpen(false);
        }
        catch (error) {
            toast.error(error instanceof Error
                ? error.message
                : "Không thể cập nhật yêu cầu trả hàng");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }
        setIsSubmitting(true);
        try {
            await updateReturnRequest(returnRequest.id, {
                status: "rejected",
                admin_note: rejectReason,
            });
            setStatus("rejected");
            setAdminNote(rejectReason);
            toast.success("Đã từ chối yêu cầu trả hàng");
            setRejectDialogOpen(false);
        }
        catch (error) {
            toast.error(error instanceof Error
                ? error.message
                : "Không thể cập nhật yêu cầu trả hàng");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleReceived = async () => {
        setIsSubmitting(true);
        try {
            await updateReturnRequest(returnRequest.id, {
                status: "received",
            });
            setStatus("received");
            toast.success("Đã xác nhận nhận hàng trả lại");
        }
        catch (error) {
            toast.error(error instanceof Error
                ? error.message
                : "Không thể cập nhật yêu cầu trả hàng");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            await updateReturnRequest(returnRequest.id, {
                status: "completed",
            });
            setStatus("completed");
            toast.success("Đã hoàn thành xử lý trả hàng và hoàn tiền");
        }
        catch (error) {
            toast.error(error instanceof Error
                ? error.message
                : "Không thể cập nhật yêu cầu trả hàng");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleImagePreview = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImagePreviewOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/returns"), children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Chi ti\u1EBFt tr\u1EA3 h\u00E0ng" }), _jsx("p", { className: "text-gray-600", children: returnNumber })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "M\u00E3 y\u00EAu c\u1EA7u" }), _jsx("p", { className: "font-medium", children: returnNumber })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "M\u00E3 \u0111\u01A1n h\u00E0ng" }), _jsx("button", { onClick: () => navigate(`/orders/${returnRequest.order_id}`), className: "font-medium text-[#E0872B] hover:underline", children: orderNumber })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { className: "font-medium", children: formatDate(returnRequest.created_at) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Tr\u1EA1ng th\u00E1i" }), _jsx(Badge, { className: `${returnStatusConfig[status].bgColor} ${returnStatusConfig[status].color}`, children: returnStatusConfig[status].label })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "L\u00FD do tr\u1EA3 h\u00E0ng" }), _jsx("div", { className: "mt-2 p-3 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-sm", children: returnRequest.reason }) })] }), adminNote && (_jsxs("div", { children: [_jsx(Label, { children: "Ghi ch\u00FA c\u1EE7a Admin" }), _jsx("div", { className: "mt-2 p-3 bg-[#FFE0B2] rounded-lg", children: _jsx("p", { className: "text-sm text-[#E0872B]", children: adminNote }) })] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "S\u1EA3n ph\u1EA9m y\u00EAu c\u1EA7u tr\u1EA3" }) }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "S\u1EA3n ph\u1EA9m" }), _jsx(TableHead, { className: "text-right", children: "\u0110\u01A1n gi\u00E1" }), _jsx(TableHead, { className: "text-right", children: "SL tr\u1EA3" }), _jsx(TableHead, { children: "T\u00ECnh tr\u1EA1ng" }), _jsx(TableHead, { className: "text-right", children: "Th\u00E0nh ti\u1EC1n" })] }) }), _jsx(TableBody, { children: returnItems.map((item) => {
                                                            const orderItem = item.order_item || resolvedOrderItems.find((i) => String(i.id) === String(item.order_item_id));
                                                            const variant = orderItem?.variant || productVariants.find((v) => String(v.id) === String(orderItem?.variant_id));
                                                            const productName = item.name ?? variant?.product?.name ?? orderItem?.variant?.product?.name;
                                                            const sku = item.variant?.sku ?? item.variant?.version ?? variant?.sku ?? variant?.version ?? orderItem?.variant?.sku ?? orderItem?.variant?.version;
                                                            const fallbackUnitPrice = (returnItems.length === 1 && returnRequest?.refund_amount)
                                                                ? Number(returnRequest.refund_amount)
                                                                : 0;
                                                            const unitPrice = Number(orderItem?.unit_price ?? item.unit_price ?? fallbackUnitPrice ?? 0);
                                                            const returnQuantity = Number(item.quantity ?? orderItem?.quantity ?? 0);
                                                            const orderQuantity = Number(orderItem?.quantity ?? returnQuantity);
                                                            const condition = item.condition ?? item.return_condition;
                                                            return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center", children: _jsx(Package, { className: "h-6 w-6 text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: productName || "Sản phẩm không xác định" }), _jsx("p", { className: "text-sm text-gray-600", children: sku || "Không có SKU" }), variant?.color && (_jsxs("p", { className: "text-xs text-gray-500", children: ["M\u00E0u: ", variant.color] })), variant?.version && (_jsxs("p", { className: "text-xs text-gray-500", children: ["Phi\u00EAn b\u1EA3n: ", variant.version] }))] })] }) }), _jsx(TableCell, { className: "text-right", children: formatCurrency(unitPrice) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: returnQuantity }), _jsxs("p", { className: "text-xs text-gray-500", children: ["/ ", orderQuantity] })] }) }), _jsx(TableCell, { children: _jsx(ReturnConditionBadge, { condition: condition }) }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(unitPrice * returnQuantity) })] }, item.id));
                                                        }) })] }), _jsx("div", { className: "mt-4 space-y-2 border-t pt-4", children: _jsxs("div", { className: "flex justify-between text-lg font-bold", children: [_jsx("span", { children: "T\u1ED5ng gi\u00E1 tr\u1ECB tr\u1EA3 h\u00E0ng:" }), _jsx("span", { className: "text-red-600", children: formatCurrency(returnItems.reduce((sum, item) => {
                                                                const orderItem = item.order_item || resolvedOrderItems.find((i) => String(i.id) === String(item.order_item_id));
                                                                const fallbackUnitPrice = returnItems.length === 1 && returnRequest?.refund_amount ? Number(returnRequest.refund_amount) : 0;
                                                                const unitPrice = Number(orderItem?.unit_price ?? item.unit_price ?? fallbackUnitPrice ?? 0);
                                                                const returnQuantity = Number(item.quantity ?? orderItem?.quantity ?? 0);
                                                                return sum + unitPrice * returnQuantity;
                                                            }, 0) || 0) })] }) })] })] }), returnRequest.images && returnRequest.images.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(ImageIcon, { className: "h-5 w-5" }), "H\u00ECnh \u1EA3nh ch\u1EE9ng minh (", returnRequest.images.length, ")"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: returnRequest.images.map((image) => (_jsxs("div", { className: "relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#E0872B] transition-colors", onClick: () => handleImagePreview(image.image_url), children: [_jsx("img", { src: image.image_url, alt: `Return evidence ${image.id}`, className: "w-full h-40 object-cover" }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center", children: _jsx(ZoomIn, { className: "h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" }) })] }, image.id))) }) })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin kh\u00E1ch h\u00E0ng" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(User, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "T\u00EAn kh\u00E1ch h\u00E0ng" }), _jsx("p", { className: "font-medium", children: returnRequest.user?.full_name })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsx("p", { className: "font-medium", children: returnRequest.user?.phone_number || "-" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Email" }), _jsx("p", { className: "font-medium", children: returnRequest.user?.email })] })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "X\u1EED l\u00FD y\u00EAu c\u1EA7u" }) }), _jsxs(CardContent, { className: "space-y-4", children: [status === "pending" && (_jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { className: "w-full", onClick: () => setApproveDialogOpen(true), disabled: isSubmitting, children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Ch\u1EA5p nh\u1EADn tr\u1EA3 h\u00E0ng"] }), _jsxs(Button, { variant: "destructive", className: "w-full", onClick: () => setRejectDialogOpen(true), disabled: isSubmitting, children: [_jsx(XCircle, { className: "h-4 w-4 mr-2" }), "T\u1EEB ch\u1ED1i"] })] })), status === "approved" && (_jsxs(Button, { className: "w-full", onClick: handleReceived, disabled: isSubmitting, children: [_jsx(Package, { className: "h-4 w-4 mr-2" }), "X\u00E1c nh\u1EADn \u0111\u00E3 nh\u1EADn h\u00E0ng"] })), status === "received" && (_jsxs(Button, { className: "w-full", onClick: handleComplete, disabled: isSubmitting, children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Ho\u00E0n th\u00E0nh ho\u00E0n ti\u1EC1n"] })), (status === "rejected" || status === "completed") && (_jsx("div", { className: "text-center text-sm text-gray-600 py-2", children: status === "rejected"
                                                    ? "Yêu cầu đã bị từ chối"
                                                    : "Đã hoàn thành xử lý" }))] })] }), status !== "rejected" && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "S\u1ED1 ti\u1EC1n ho\u00E0n tr\u1EA3" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "S\u1ED1 ti\u1EC1n" }), _jsx(Input, { type: "number", value: refundAmount, onChange: (e) => setRefundAmount(e.target.value), placeholder: "Nh\u1EADp s\u1ED1 ti\u1EC1n ho\u00E0n tr\u1EA3", disabled: status !== "pending" }), refundAmount && (_jsx("p", { className: "text-sm text-gray-600", children: formatCurrency(parseFloat(refundAmount)) }))] }) })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "L\u1ECBch s\u1EED x\u1EED l\u00FD" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0", children: _jsx(Calendar, { className: "h-4 w-4 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "T\u1EA1o y\u00EAu c\u1EA7u" }), _jsx("p", { className: "text-xs text-gray-600", children: formatDate(returnRequest.created_at) })] })] }), status !== "pending" && (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${status === "rejected" ? "bg-red-100" : "bg-[#FFE0B2]"}`, children: status === "rejected" ? (_jsx(XCircle, { className: "h-4 w-4 text-red-600" })) : (_jsx(CheckCircle, { className: "h-4 w-4 text-[#E0872B]" })) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: status === "rejected" ? "Từ chối" : "Chấp nhận" }), _jsx("p", { className: "text-xs text-gray-600", children: new Date().toLocaleDateString("vi-VN") })] })] })), status === "received" && (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-[#FFE0B2] flex items-center justify-center flex-shrink-0", children: _jsx(Package, { className: "h-4 w-4 text-[#E0872B]" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "\u0110\u00E3 nh\u1EADn h\u00E0ng" }), _jsx("p", { className: "text-xs text-gray-600", children: new Date().toLocaleDateString("vi-VN") })] })] })), status === "completed" && (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0", children: _jsx(DollarSign, { className: "h-4 w-4 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "Ho\u00E0n ti\u1EC1n" }), _jsx("p", { className: "text-xs text-gray-600", children: new Date().toLocaleDateString("vi-VN") })] })] }))] }) })] })] })] }), _jsx(Dialog, { open: approveDialogOpen, onOpenChange: setApproveDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Ch\u1EA5p nh\u1EADn y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng" }), _jsx(DialogDescription, { children: "X\u00E1c nh\u1EADn ch\u1EA5p nh\u1EADn y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng v\u00E0 ho\u00E0n ti\u1EC1n cho kh\u00E1ch h\u00E0ng." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "S\u1ED1 ti\u1EC1n ho\u00E0n tr\u1EA3 *" }), _jsx(Input, { type: "number", value: refundAmount, onChange: (e) => setRefundAmount(e.target.value), placeholder: "Nh\u1EADp s\u1ED1 ti\u1EC1n ho\u00E0n tr\u1EA3" }), refundAmount && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: formatCurrency(parseFloat(refundAmount)) }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Ghi ch\u00FA (t\u00F9y ch\u1ECDn)" }), _jsx(Textarea, { value: adminNote, onChange: (e) => setAdminNote(e.target.value), placeholder: "Ghi ch\u00FA cho kh\u00E1ch h\u00E0ng...", rows: 3 })] }), _jsx("div", { className: "p-4 bg-[#FFE0B2] rounded-lg", children: _jsx("p", { className: "text-sm text-[#E0872B]", children: "Sau khi ch\u1EA5p nh\u1EADn, kh\u00E1ch h\u00E0ng s\u1EBD \u0111\u01B0\u1EE3c th\u00F4ng b\u00E1o v\u00E0 c\u00F3 th\u1EC3 g\u1EEDi h\u00E0ng tr\u1EA3 l\u1EA1i. S\u1ED1 ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c ho\u00E0n sau khi nh\u1EADn v\u00E0 ki\u1EC3m tra h\u00E0ng." }) })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setApproveDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { onClick: handleApprove, children: "X\u00E1c nh\u1EADn ch\u1EA5p nh\u1EADn" })] })] }) }), _jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "T\u1EEB ch\u1ED1i y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng" }), _jsx(DialogDescription, { children: "Nh\u1EADp l\u00FD do t\u1EEB ch\u1ED1i \u0111\u1EC3 th\u00F4ng b\u00E1o cho kh\u00E1ch h\u00E0ng." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Vui l\u00F2ng nh\u1EADp l\u00FD do t\u1EEB ch\u1ED1i y\u00EAu c\u1EA7u tr\u1EA3 h\u00E0ng n\u00E0y" }), _jsx(Textarea, { value: rejectReason, onChange: (e) => setRejectReason(e.target.value), placeholder: "V\u00ED d\u1EE5: S\u1EA3n ph\u1EA9m kh\u00F4ng \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n tr\u1EA3 h\u00E0ng, qu\u00E1 th\u1EDDi h\u1EA1n...", rows: 4 })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setRejectDialogOpen(false), children: "H\u1EE7y" }), _jsx(Button, { variant: "destructive", onClick: handleReject, children: "X\u00E1c nh\u1EADn t\u1EEB ch\u1ED1i" })] })] }) }), _jsx(Dialog, { open: imagePreviewOpen, onOpenChange: setImagePreviewOpen, children: _jsxs(DialogContent, { className: "max-w-4xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "H\u00ECnh \u1EA3nh ch\u1EE9ng minh" }), _jsx(DialogDescription, { children: "Xem chi ti\u1EBFt h\u00ECnh \u1EA3nh ch\u1EE9ng minh t\u1EEB kh\u00E1ch h\u00E0ng." })] }), _jsx("div", { className: "flex items-center justify-center", children: _jsx("img", { src: selectedImage, alt: "Return evidence", className: "max-w-full max-h-[70vh] object-contain rounded-lg" }) })] }) })] }));
}
