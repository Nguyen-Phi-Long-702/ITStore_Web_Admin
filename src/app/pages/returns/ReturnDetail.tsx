import { useState } from "react";
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
import { ReturnStatus } from "../../types";
import { ReturnConditionBadge } from "../../components/returns/ReturnConditionBadge";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

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
  const { returnRequests, updateReturnRequest } = useData();
  const returnRequest = returnRequests.find((r) => r.id.toString() === id);

  const [status, setStatus] = useState(returnRequest?.status || "pending");
  const [adminNote, setAdminNote] = useState(returnRequest?.admin_note || "");
  const [refundAmount, setRefundAmount] = useState(
    returnRequest?.refund_amount?.toString() || "",
  );
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

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

  const handleApprove = () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error("Vui lòng nhập số tiền hoàn hợp lệ");
      return;
    }
    setStatus("approved");
    toast.success("Đã chấp nhận yêu cầu trả hàng");
    setApproveDialogOpen(false);
    updateReturnRequest(returnRequest.id, {
      status: "approved",
      admin_note: adminNote,
      refund_amount: parseFloat(refundAmount),
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    setStatus("rejected");
    setAdminNote(rejectReason);
    toast.success("Đã từ chối yêu cầu trả hàng");
    setRejectDialogOpen(false);
    updateReturnRequest(returnRequest.id, {
      status: "rejected",
      admin_note: rejectReason,
    });
  };

  const handleReceived = () => {
    setStatus("received");
    toast.success("Đã xác nhận nhận hàng trả lại");
    updateReturnRequest(returnRequest.id, {
      status: "received",
    });
  };

  const handleComplete = () => {
    setStatus("completed");
    toast.success("Đã hoàn thành xử lý trả hàng và hoàn tiền");
    updateReturnRequest(returnRequest.id, {
      status: "completed",
    });
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
                  {returnRequest.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {item.order_item?.variant?.product?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.order_item?.variant?.sku}
                            </p>
                            {item.order_item?.variant?.color && (
                              <p className="text-xs text-gray-500">
                                Màu: {item.order_item.variant.color}
                              </p>
                            )}
                            {item.order_item?.variant?.version && (
                              <p className="text-xs text-gray-500">
                                Phiên bản: {item.order_item.variant.version}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.order_item?.unit_price || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium">{item.quantity}</p>
                          <p className="text-xs text-gray-500">
                            / {item.order_item?.quantity}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ReturnConditionBadge condition={item.condition} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          (item.order_item?.unit_price || 0) * item.quantity,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng giá trị trả hàng:</span>
                  <span className="text-red-600">
                    {formatCurrency(
                      returnRequest.items?.reduce(
                        (sum, item) =>
                          sum +
                          (item.order_item?.unit_price || 0) * item.quantity,
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
                  <p className="font-medium">{returnRequest.user?.phone}</p>
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
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Chấp nhận trả hàng
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setRejectDialogOpen(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối
                  </Button>
                </div>
              )}

              {status === "approved" && (
                <Button className="w-full" onClick={handleReceived}>
                  <Package className="h-4 w-4 mr-2" />
                  Xác nhận đã nhận hàng
                </Button>
              )}

              {status === "received" && (
                <Button className="w-full" onClick={handleComplete}>
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

          {status !== "rejected" && (
            <Card>
              <CardHeader>
                <CardTitle>Số tiền hoàn trả</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Số tiền</Label>
                  <Input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Nhập số tiền hoàn trả"
                    disabled={status !== "pending"}
                  />
                  {refundAmount && (
                    <p className="text-sm text-gray-600">
                      {formatCurrency(parseFloat(refundAmount))}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
              <Label>Số tiền hoàn trả *</Label>
              <Input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Nhập số tiền hoàn trả"
              />
              {refundAmount && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(parseFloat(refundAmount))}
                </p>
              )}
            </div>
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
            >
              Hủy
            </Button>
            <Button onClick={handleApprove}>Xác nhận chấp nhận</Button>
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
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Xác nhận từ chối
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
