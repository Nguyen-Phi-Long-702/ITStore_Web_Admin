import { OrderStatus, ProductStatus, PaymentStatus, PaymentMethod } from "../types";

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  preparing: {
    label: "Đang chuẩn bị hàng",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  packed: {
    label: "Đã đóng gói",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  shipping: {
    label: "Đang giao hàng",
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
  },
  delivered: {
    label: "Giao hàng thành công",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  failed: {
    label: "Giao hàng thất bại",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export const productStatusConfig: Record<
  ProductStatus,
  { label: string; color: string; bgColor: string }
> = {
  active: {
    label: "Đang kinh doanh",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  discontinued: {
    label: "Ngừng kinh doanh",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string; bgColor: string }
> = {
  unpaid: {
    label: "Chưa thanh toán",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  paid: {
    label: "Đã thanh toán",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  momo: "Ví MoMo",
  bank_transfer: "Chuyển khoản ngân hàng",
};


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateOnly(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

