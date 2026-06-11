import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Package,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { formatCurrency, formatDate } from "../../utils/statusUtils";
import { Order, ReturnStatus } from "../../types";
import { ReturnConditionBadge } from "../../components/returns/ReturnConditionBadge";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { orderService } from "../../services/orderService";
import { returnService } from "../../services/returnService";

const returnStatusConfig: Record<
  ReturnStatus,
  { label: string; color: string; bgColor: string }
> = {
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
  const [orderDetail, setOrderDetail] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadReturnDetail = async () => {
      try {
        const detail = await returnService.getDetail(parseInt(id, 10));
        if (isMounted) {
          setReturnRequest(detail);
        }
      } catch {
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
    if (!orderId) return;

    let isMounted = true;

    const loadOrderDetail = async () => {
      try {
        const detail = await orderService.getDetail(orderId);
        if (isMounted) {
          setOrderDetail(detail);
        }
      } catch {
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

  const resolvedOrder =
    orderDetail ??
    orders.find((order) => String(order.id) === String(returnRequest?.order_id)) ??
    returnRequest?.order;
  const resolvedOrderItems =
    resolvedOrder?.items ??
    ((resolvedOrder as typeof resolvedOrder & { order_items?: typeof orderItems })
      ?.order_items ??
      []);

  const returnItems = (returnRequest?.items ?? returnRequest?.return_items ?? []).map((item: any) => {
    const resolvedOrderItem =
      item.order_item ??
      resolvedOrderItems.find(
        (orderItem) => String(orderItem.id) === String(item.order_item_id),
      ) ??
      orderItems.find(
        (orderItem) => String(orderItem.id) === String(item.order_item_id),
      );
    const resolvedVariant =
      resolvedOrderItem?.variant ??
      (resolvedOrderItem as typeof resolvedOrderItem & { product_variant?: typeof productVariants[number] })
        ?.product_variant ??
      productVariants.find(
        (variant) => String(variant.id) === String(resolvedOrderItem?.variant_id),
      );

    return {
      ...item,
      condition:
        item.condition ??
        (item as typeof item & { return_condition?: typeof item.condition })
          .return_condition,
      order_item: resolvedOrderItem
        ? { ...resolvedOrderItem, variant: resolvedVariant }
        : item.order_item,
    };
  });

  const [status, setStatus] = useState(returnRequest?.status || "pending");
  const [adminNote, setAdminNote] = useState(returnRequest?.admin_note || "");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!returnRequest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy yêu cầu trả hàng</p>
        <Button onClick={() => navigate("/returns")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const returnNumber = `YC${returnRequest.id.toString().padStart(6, "0")}`;
  const orderNumber = `DH${returnRequest.order_id.toString().padStart(6, "0")}`;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await updateReturnRequest(returnRequest.id, {
        status: "approved",
        admin_note: adminNote,
      });
      setStatus("approved");
      toast.success("Đã chấp nhận yêu cầu trả hàng");
      setApproveDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật yêu cầu trả hàng",
      );
    } finally {
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
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật yêu cầu trả hàng",
      );
    } finally {
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
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật yêu cầu trả hàng",
      );
    } finally {
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
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật yêu cầu trả hàng",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImagePreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/returns")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết trả hàng
            </h2>
            <p className="text-gray-600">{returnNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin yêu cầu trả hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mã yêu cầu</p>
                  <p className="font-medium">{returnNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <button
                    onClick={() =>
                      navigate(`/orders/${returnRequest.order_id}`)
                    }
                    className="font-medium text-[#E0872B] hover:underline"
                  >
                    {orderNumber}
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tạo</p>
                  <p className="font-medium">
                    {formatDate(returnRequest.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <Badge
                    className={`${returnStatusConfig[status].bgColor} ${returnStatusConfig[status].color}`}
                  >
                    {returnStatusConfig[status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Lý do trả hàng</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{returnRequest.reason}</p>
                </div>
              </div>

              {adminNote && (
                <div>
                  <Label>Ghi chú của Admin</Label>
                  <div className="mt-2 p-3 bg-[#FFE0B2] rounded-lg">
                    <p className="text-sm text-[#E0872B]">{adminNote}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm yêu cầu trả</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">SL trả</TableHead>
                    <TableHead>Tình trạng</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnItems.map((item) => (
                    <TableRow key={item.id}>
                      {(() => {
                        const orderItem =
                          item.order_item ??
                          resolvedOrderItems.find(
                            (orderLine) =>
                              String(orderLine.id) === String(item.order_item_id),
                          );
                        const variant =
                          orderItem?.variant ??
                          productVariants.find(
                            (variantEntry) =>
                              String(variantEntry.id) === String(orderItem?.variant_id),
                          );
                        const productName =
                          item.name ?? variant?.product?.name ?? orderItem?.variant?.product?.name;
                        const sku =
                          item.variant?.sku ??
                          item.variant?.version ??
                          variant?.sku ??
                          variant?.version ??
                          orderItem?.variant?.sku ??
                          orderItem?.variant?.version;
                        const fallbackUnitPrice =
                          (returnItems.length === 1 && returnRequest?.refund_amount)
                            ? Number(returnRequest.refund_amount)
                            : 0;
                        const unitPrice = Number(
                          orderItem?.unit_price ?? item.unit_price ?? fallbackUnitPrice ?? 0,
                        );
                        const returnQuantity = Number(item.quantity ?? orderItem?.quantity ?? 0);
                        const orderQuantity = Number(orderItem?.quantity ?? returnQuantity);
                        const condition =
                          item.condition ??
                          (item as typeof item & { return_condition?: typeof item.condition })
                            ?.return_condition;

                        return (
                          <>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.variant?.image_url || variant?.image_url ? (
                              <img
                                src={item.variant?.image_url || variant?.image_url}
                                alt={productName || "Sản phẩm"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {productName || "Sản phẩm không xác định"}
                            </p>
                            <p className="text-sm text-gray-600">{sku || "-"}</p>
                            {variant?.color && (
                              <p className="text-xs text-gray-500">Màu: {variant.color}</p>
                            )}
                            {variant?.version && (
                              <p className="text-xs text-gray-500">Phiên bản: {variant.version}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(unitPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium">{returnQuantity}</p>
                          <p className="text-xs text-gray-500">
                            / {orderQuantity}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ReturnConditionBadge condition={condition} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(unitPrice * returnQuantity)}
                      </TableCell>
                          </>
                        );
                      })()}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng giá trị trả hàng:</span>
                  <span className="text-red-600">
                    {formatCurrency(
                      returnItems.reduce(
                        (sum, item) => {
                          const orderItem =
                            item.order_item ??
                            resolvedOrderItems.find(
                              (orderLine) =>
                                String(orderLine.id) === String(item.order_item_id),
                            );
                          const fallbackUnitPrice =
                            returnItems.length === 1 && returnRequest?.refund_amount
                              ? Number(returnRequest.refund_amount)
                              : 0;
                          const unitPrice = Number(
                            orderItem?.unit_price ?? item.unit_price ?? fallbackUnitPrice ?? 0,
                          );
                          const returnQuantity = Number(item.quantity ?? orderItem?.quantity ?? 0);
                          return sum + unitPrice * returnQuantity;
                        },
                        0,
                      ) || 0,
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {returnRequest.images && returnRequest.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Hình ảnh chứng minh ({returnRequest.images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {returnRequest.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#E0872B] transition-colors"
                      onClick={() => handleImagePreview(image.image_url)}
                    >
                      <img
                        src={image.image_url}
                        alt={`Return evidence ${image.id}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tên khách hàng</p>
                  <p className="font-medium">{returnRequest.user?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{returnRequest.user?.phone_number || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{returnRequest.user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xử lý yêu cầu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "pending" && (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => setApproveDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Chấp nhận trả hàng
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setRejectDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối
                  </Button>
                </div>
              )}

              {status === "approved" && (
                <Button
                  className="w-full"
                  onClick={handleReceived}
                  disabled={isSubmitting}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Xác nhận đã nhận hàng
                </Button>
              )}

              {status === "received" && (
                <Button
                  className="w-full"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Hoàn thành hoàn tiền
                </Button>
              )}

              {(status === "rejected" || status === "completed") && (
                <div className="text-center text-sm text-gray-600 py-2">
                  {status === "rejected"
                    ? "Yêu cầu đã bị từ chối"
                    : "Đã hoàn thành xử lý"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Tạo yêu cầu</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(returnRequest.created_at)}
                    </p>
                  </div>
                </div>
                {status !== "pending" && (
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        status === "rejected" ? "bg-red-100" : "bg-[#FFE0B2]"
                      }`}
                    >
                      {status === "rejected" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-[#E0872B]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {status === "rejected" ? "Từ chối" : "Chấp nhận"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}
                {status === "received" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFE0B2] flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-[#E0872B]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Đã nhận hàng</p>
                      <p className="text-xs text-gray-600">
                        {new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}
                {status === "completed" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Hoàn tiền</p>
                      <p className="text-xs text-gray-600">
                        {new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chấp nhận yêu cầu trả hàng</DialogTitle>
            <DialogDescription>
              Xác nhận chấp nhận yêu cầu trả hàng và hoàn tiền cho khách hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ghi chú (tùy chọn)</Label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ghi chú cho khách hàng..."
                rows={3}
              />
            </div>
            <div className="p-4 bg-[#FFE0B2] rounded-lg">
              <p className="text-sm text-[#E0872B]">
                Sau khi chấp nhận, khách hàng sẽ được thông báo và có thể gửi
                hàng trả lại. Số tiền sẽ được hoàn sau khi nhận và kiểm tra
                hàng.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={isSubmitting} 
            >
              Hủy
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}> 
              {isSubmitting ? "Đang xử lý..." : "Xác nhận chấp nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu trả hàng</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối để thông báo cho khách hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng nhập lý do từ chối yêu cầu trả hàng này
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Sản phẩm không đủ điều kiện trả hàng, quá thời hạn..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Hình ảnh chứng minh</DialogTitle>
            <DialogDescription>
              Xem chi tiết hình ảnh chứng minh từ khách hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Return evidence"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
