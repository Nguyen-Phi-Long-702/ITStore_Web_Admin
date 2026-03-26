export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "packed"
  | "shipping"
  | "delivered"
  | "failed"
  | "cancelled";

export type ProductStatus = "active" | "discontinued";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type PaymentMethod = "cod" | "momo" | "bank_transfer";

export type PaymentGatewayStatus =
  | "pending"
  | "success"
  | "failed"
  | "refunded";

export type DiscountType = "percent" | "fixed";

export type ReturnStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "received"
  | "completed";

export type ReturnCondition = "good" | "damaged" | "wrong_item";

export interface User {
  id: number;
  username?: string;
  customer_code?: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  avatar?: string;
  setting?: any;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Address {
  id: number;
  user_id: number;
  recipient: string;
  phone_number: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  category_code?: string;
  name: string;
  slug: string;
  parent_id?: number;
  created_at: string;
}

export interface Brand {
  id: number;
  brand_code?: string;
  name: string;
  logo_url?: string;
  created_at: string;
}

export interface Product {
  id: number;
  product_code?: string;
  sku?: string;
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  brand_id: number;
  specifications?: any;
  status: ProductStatus;
  created_at: string;
  updated_at?: string;
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  version?: string;
  color?: string;
  color_hex?: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  product?: Product;
}

export interface ProductImage {
  id: number;
  product_id: number;
  variant_id?: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Order {
  id: number;
  user_id: number;
  address_id?: number;
  coupon_id?: number;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  cancel_reason?: string;
  note?: string;
  created_at: string;
  updated_at?: string;
  user?: User;
  address?: Address;
  coupon?: Coupon;
  items?: OrderItem[];
  status_logs?: OrderStatusLog[];
  payments?: Payment[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  variant?: ProductVariant;
}

export interface OrderStatusLog {
  id: number;
  order_id: number;
  changed_by?: number;
  old_status?: string;
  new_status: string;
  note?: string;
  changed_at: string;
  admin?: User;
}

export interface Payment {
  id: number;
  order_id: number;
  method: PaymentMethod;
  amount: number;
  transaction_id?: string;
  gateway_response?: any;
  status: PaymentGatewayStatus;
  paid_at?: string;
  created_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface Customer extends User {
  totalOrders?: number;
  totalSpent?: number;
  addresses?: Address[];
}

export interface ReturnRequest {
  id: number;
  order_id: number;
  user_id: number;
  reason: string;
  status: ReturnStatus;
  admin_note?: string;
  refund_amount?: number;
  created_at: string;
  order?: Order;
  user?: User;
  items?: ReturnItem[];
  images?: ReturnImage[];
}

export interface ReturnItem {
  id: number;
  return_request_id: number;
  order_item_id: number;
  quantity: number;
  condition?: ReturnCondition;
  order_item?: OrderItem;
}

export interface ReturnImage {
  id: number;
  return_request_id: number;
  image_url: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  pendingChange: number;
  lowStockProducts?: number;
  returnRequests?: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  id?: string;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

export interface StockMovement {
  id: number;
  variant_id: number;
  admin_id?: number;
  change_qty: number;
  note?: string;
  created_at: string;
  variant?: ProductVariant;
  admin?: User;
}

export interface SystemConfig {
  paymentConfig: {
    codEnabled: boolean;
    bankTransferEnabled: boolean;
    creditCardEnabled: boolean;
    momoEnabled: boolean;
    vnpayEnabled: boolean;
  };

  shippingConfig: {
    baseShippingFee: number;
    freeShippingThreshold: number;
    distanceFeePerKm: number;
    urgentShippingFee: number;
  };

  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  banners: Array<{
    id: string;
    title: string;
    url: string;
    active: boolean;
  }>;

  notificationTemplates: {
    orderNotification: string;
    lowStockNotification: string;
    shipmentNotification: string;
  };
}
