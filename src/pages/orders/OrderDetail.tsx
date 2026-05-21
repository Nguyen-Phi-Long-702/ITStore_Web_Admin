import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  FileText,
  XCircle,
  CheckCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  formatCurrency,
  formatDate,
  orderStatusConfig,
  paymentStatusConfig,
  paymentMethodLabels,
} from "../../utils/statusUtils";
import { OrderStatus } from "../../types";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { orderService } from "../../services/orderService";

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, returnRequests, updateOrder, products, productVariants } = useData();
  const order = orders.find((o) => o.id.toString() === id);

  const [detailOrder, setDetailOrder] = useState(order);

  useEffect(() => {
    if (!id) return;
    orderService.getDetail(Number(id))
      .then((data) => setDetailOrder(data as any))
      .catch(() => {});
  }, [id]);

  const displayOrder = detailOrder || order;

  const [orderStatus, setOrderStatus] = useState(
    order?.order_status || "pending",
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy đơn hàng</p>
        <Button onClick={() => navigate("/orders")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const orderNumber = `DH${order.id.toString().padStart(6, "0")}`;

  const hasReturnRequest = returnRequests.some((r) => r.order_id === order.id);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    try {
      await updateOrder(order.id, { order_status: newStatus });
      setOrderStatus(newStatus);
      toast.success(
        `Đã cập nhật trạng thái: ${orderStatusConfig[newStatus].label}`,
      );
    } catch (error) {
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
      } as any);
      setOrderStatus("cancelled");
      toast.success("Đã hủy đơn hàng");
      setCancelDialogOpen(false);
      setCancelReason("");
    } catch (error) {
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
      completed: ["preparing", "packed", "shipping", "delivered"].includes(
        orderStatus,
      ),
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

  return (
    <>
      <style>
        {`
          @media print {
            @page { size: A6 portrait; margin: 3mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; font-size: 11px; }
            aside, header { display: none !important; }
            main { overflow: visible !important; padding: 0 !important; }
            #root, .h-screen, .flex-1 { height: auto !important; overflow: visible !important; display: block !important; }
          }
        `}
      </style>
      <div className="space-y-6 print:hidden">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng
            </h2>
            <p className="text-gray-600">{orderNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="h-4 w-4 mr-2" />
            In phiếu
          </Button>
          {hasReturnRequest && (
            <Button
              variant="outline"
              onClick={() => {
                const returnReq = returnRequests.find(
                  (r) => r.order_id === order.id,
                );
                if (returnReq) navigate(`/returns/${returnReq.id}`);
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Xem yêu cầu trả hàng
            </Button>
          )}
          {orderStatus !== "cancelled" && orderStatus !== "delivered" && (
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Hủy đơn
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {orderTimeline.map((step, index) => (
              <div key={step.status} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <p
                    className={`text-sm mt-2 text-center ${
                      step.completed ? "font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < orderTimeline.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step.completed ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(displayOrder?.items) ? displayOrder.items : (displayOrder as any)?.order_items || []).map((item: any) => {
                    const variant = productVariants.find((v) => v.id === item.variant_id) || item.variant || item.product_variant;
                    const product = item.product || products.find((p) => p.id === variant?.product_id) || variant?.product;
                    return (
                    <TableRow key={item.id || Math.random()}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={product?.name || "Product image"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {product?.name || `Sản phẩm chưa rõ`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {variant?.sku || `SKU: ${item.variant_id}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{formatCurrency(order.shipping_fee)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="text-red-600">
                      -{formatCurrency(order.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-[#E0872B]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tên khách hàng</p>
                  <p className="font-medium">{order.user?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-medium">{shippingAddress}</p>
                </div>
              </div>
              {order.note && (
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="font-medium">{order.note}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Trạng thái hiện tại</Label>
                <div className="mt-2">
                  <Badge
                    className={`${orderStatusConfig[orderStatus].bgColor} ${
                      orderStatusConfig[orderStatus].color
                    }`}
                  >
                    {orderStatusConfig[orderStatus].label}
                  </Badge>
                </div>
              </div>

              {orderStatus === "pending" && (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus("confirmed")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận đơn hàng
                  </Button>
                </div>
              )}

              {orderStatus === "confirmed" && (
                <Button
                  className="w-full"
                  onClick={() => handleUpdateStatus("preparing")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Bắt đầu chuẩn bị hàng
                </Button>
              )}

              {orderStatus === "preparing" && (
                <Button
                  className="w-full"
                  onClick={() => handleUpdateStatus("packed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đã đóng gói xong
                </Button>
              )}

              {orderStatus === "packed" && (
                <Button
                  className="w-full"
                  onClick={() => handleUpdateStatus("shipping")}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Giao cho đơn vị vận chuyển
                </Button>
              )}

              {orderStatus === "shipping" && (
                <Button
                  className="w-full"
                  onClick={() => handleUpdateStatus("delivered")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Giao hàng thành công
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Phương thức</p>
                <p className="font-medium">
                  {paymentMethodLabels[order.payment_method]}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <Badge
                  className={`${
                    paymentStatusConfig[order.payment_status].bgColor
                  } ${paymentStatusConfig[order.payment_status].color}`}
                >
                  {paymentStatusConfig[order.payment_status].label}
                </Badge>
              </div>
              {order.payment_status === "paid" &&
                (orderStatus === "cancelled" || orderStatus === "failed") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setRefundDialogOpen(true)}
                  >
                    Hoàn tiền
                  </Button>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Ngày đặt</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              {order.updated_at && (
                <div>
                  <p className="text-gray-600">Cập nhật lần cuối</p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do hủy đơn hàng. Thông tin này sẽ được gửi đến
              khách hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng nhập lý do hủy đơn hàng
            </p>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ví dụ: Sản phẩm hết hàng, khách hàng yêu cầu hủy..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Đóng
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
            <DialogDescription>
              Xác nhận hoàn tiền cho khách hàng qua phương thức thanh toán đã sử
              dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Xác nhận hoàn tiền {formatCurrency(order.total)} cho khách hàng?
            </p>
            <div className="p-4 bg-[#FFE0B2] rounded-lg">
              <p className="text-sm text-[#E0872B]">
                Số tiền sẽ được hoàn lại qua phương thức thanh toán:{" "}
                {paymentMethodLabels[order.payment_method]}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleRefund}>Xác nhận hoàn tiền</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu trả hàng</DialogTitle>
            <DialogDescription>
              Nhập lý do trả hàng để tạo yêu cầu mới trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng nhập lý do trả hàng
            </p>
            <Textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Ví dụ: Sản phẩm không đúng, khách hàng yêu cầu trả lại..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReturnDialogOpen(false)}
            >
              Đóng
            </Button>
            <Button onClick={handleCreateReturnRequest}>
              Xác nhận tạo yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>

      {/* Trang in cỡ A6 */}
      <div className="hidden print:block p-2 bg-white text-black font-sans max-w-[105mm] mx-auto text-xs">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 flex justify-start">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-[#E0872B] rounded flex items-center justify-center text-white font-bold text-base">
                I
              </div>
              <span className="font-bold text-base whitespace-nowrap">IT Store</span>
            </div>
          </div>
          <div className="text-center flex-[2]">
            <h1 className="text-lg font-bold uppercase mb-1 whitespace-nowrap">Phiếu Giao Hàng</h1>
            <p className="text-[10px] text-gray-600">Mã đơn hàng: <span className="font-medium text-black">{orderNumber}</span></p>
            <p className="text-[10px] text-gray-600">Ngày đặt: <span className="font-medium text-black">{formatDate(order.created_at)}</span></p>
          </div>
          <div className="flex-1"></div>
        </div>
        
        <div className="mb-4 border-b border-dashed border-gray-300 pb-3">
          <h2 className="font-bold text-sm mb-2 text-gray-800">Thông tin người nhận</h2>
          <div className="space-y-1 text-[11px]">
            <p className="flex"><span className="text-gray-600 w-16 flex-shrink-0">Khách hàng:</span> <span className="font-medium">{order.user?.full_name}</span></p>
            <p className="flex"><span className="text-gray-600 w-16 flex-shrink-0">Địa chỉ:</span> <span className="font-medium">{shippingAddress}</span></p>
            {order.note && <p className="flex"><span className="text-gray-600 w-16 flex-shrink-0">Ghi chú:</span> <span className="font-medium">{order.note}</span></p>}
            <p className="flex"><span className="text-gray-600 w-16 flex-shrink-0">Thanh toán:</span> <span className="font-medium whitespace-nowrap">{paymentMethodLabels[order.payment_method]}</span></p>
          </div>
        </div>

        <table className="w-full mb-4 border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-1 font-bold">Sản phẩm</th>
              <th className="text-center py-1 font-bold w-6">SL</th>
              <th className="text-right py-1 font-bold w-14">Đơn giá</th>
              <th className="text-right py-1 font-bold w-16">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(displayOrder?.items) ? displayOrder.items : (displayOrder as any)?.order_items || []).map((item: any) => (
              <tr key={item.id || Math.random()} className="border-b border-dashed border-gray-200">
                <td className="py-2 pr-2">
                  <p className="font-medium text-gray-800 line-clamp-2">{item.product?.name || item.variant?.product?.name}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">SKU: {item.variant?.sku}</p>
                </td>
                <td className="text-center py-2 font-medium">{item.quantity}</td>
                <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                <td className="text-right py-2 font-medium">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end pt-1 mb-4 text-[11px]">
          <div className="w-2/3 space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span className="font-medium text-black">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-black">{formatCurrency(order.shipping_fee)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá:</span>
                <span className="font-medium text-red-600">-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[13px] border-t border-gray-800 pt-1.5 mt-1.5">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <div className="w-1/2">
            <div className="border border-gray-300 rounded p-2 h-full bg-gray-50">
              <p className="font-bold text-gray-800 text-[10px] mb-1">Chỉ dẫn giao hàng:</p>
              <ul className="text-[9px] text-gray-600 list-disc pl-3 space-y-0.5">
                <li>Cho khách xem hàng và đồng kiểm.</li>
                <li>Chuyển hoàn sau 3 lần phát.</li>
                <li>Lưu kho tối đa 5 ngày.</li>
                <li>Hàng dễ vỡ, xin nhẹ tay.</li>
              </ul>
            </div>
          </div>
          <div className="w-1/2">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-2 flex flex-col items-center min-h-[90px]">
              <p className="font-bold text-gray-800 text-[11px] uppercase mb-1 whitespace-nowrap">Chữ ký người nhận</p>
              <p className="text-[8px] text-gray-500 mb-2 whitespace-nowrap">Xác nhận hàng nguyên vẹn, không móp/méo, bể vỡ</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6 pt-2 border-t border-gray-200 text-[9px] text-gray-500 italic">
          Cảm ơn quý khách đã mua sắm tại cửa hàng!
        </div>
      </div>
    </>
  );
}
