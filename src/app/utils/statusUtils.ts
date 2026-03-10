import { OrderStatus, ProductStatus, PaymentStatus, PaymentMethod, ReturnStatus, ReturnCondition } from "../types";

// ============================================
// ORDER STATUS CONFIG
// ============================================
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

// ============================================
// PRODUCT STATUS CONFIG
// ============================================
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

// ============================================
// PAYMENT STATUS CONFIG
// ============================================
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

// ============================================
// PAYMENT METHOD CONFIG
// ============================================
export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  momo: "Ví MoMo",
  bank_transfer: "Chuyển khoản ngân hàng",
};

export const paymentMethodConfig: Record<
  PaymentMethod,
  { label: string; icon?: string }
> = {
  cod: {
    label: "Thanh toán khi nhận hàng (COD)",
  },
  momo: {
    label: "Ví MoMo",
  },
  bank_transfer: {
    label: "Chuyển khoản ngân hàng",
  },
};

// ============================================
// RETURN STATUS CONFIG
// ============================================
export const returnStatusConfig: Record<
  ReturnStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Chờ xử lý",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  approved: {
    label: "Đã chấp nhận",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  rejected: {
    label: "Đã từ chối",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  received: {
    label: "Đã nhận hàng",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  completed: {
    label: "Hoàn tất",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
};

// ============================================
// RETURN CONDITION CONFIG
// ============================================
export const returnConditionConfig: Record<
  ReturnCondition,
  { label: string; color: string; bgColor: string }
> = {
  good: {
    label: "Tình trạng tốt",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  damaged: {
    label: "Bị hư hỏng",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  wrong_item: {
    label: "Sai sản phẩm",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
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

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPhoneNumber(phone: string): string {
  // Format: 0123456789 => 0123 456 789
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
}

export function calculateDiscountAmount(
  subtotal: number,
  discountType: "percent" | "fixed",
  discountValue: number,
  maxDiscount?: number
): number {
  if (discountType === "fixed") {
    return Math.min(discountValue, subtotal);
  }
  
  const amount = (subtotal * discountValue) / 100;
  if (maxDiscount) {
    return Math.min(amount, maxDiscount);
  }
  return amount;
}