// ============================================
// ENUMS - Khớp với Database Schema
// ============================================

// User Role
export type UserRole = "customer" | "admin";

// Order Status
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "packed"
  | "shipping"
  | "delivered"
  | "failed"
  | "cancelled";

// Product Status
export type ProductStatus = "active" | "discontinued";

// Payment Status
export type PaymentStatus = "unpaid" | "paid" | "refunded";

// Payment Method
export type PaymentMethod = "cod" | "momo" | "bank_transfer";

// Payment Gateway Status
export type PaymentGatewayStatus = "pending" | "success" | "failed" | "refunded";

// Discount Type
export type DiscountType = "percent" | "fixed";

// Return Request Status
export type ReturnStatus = "pending" | "approved" | "rejected" | "received" | "completed";

// Return Item Condition
export type ReturnCondition = "good" | "damaged" | "wrong_item";

// Notification Type
export type NotificationType = "order" | "payment" | "promotion" | "system";

// ============================================
// USER & AUTH
// ============================================
export interface User {
  id: number;
  username?: string; // Tên đăng nhập cho admin
  customer_code?: string; // Mã khách hàng: KH-000001
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  avatar?: string;
  setting?: any; // JSON
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

// ============================================
// PRODUCTS & VARIANTS
// ============================================
export interface Category {
  id: number;
  category_code?: string; // Mã danh mục: CAT-000001
  name: string;
  slug: string;
  parent_id?: number;
  created_at: string;
}

export interface Brand {
  id: number;
  brand_code?: string; // Mã thương hiệu: BRD-000001
  name: string;
  logo_url?: string;
  created_at: string;
}

export interface Product {
  id: number;
  product_code?: string; // Mã sản phẩm: SP-000001
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  brand_id: number;
  specifications?: any; // JSON
  status: ProductStatus;
  created_at: string;
  updated_at?: string;
  // Relations (for display)
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  version?: string; // VD: "16GB", "1TB", "RTX 4060"
  color?: string; // VD: "Đen", "Trắng", "Đỏ"
  color_hex?: string; // VD: "#FF0000"
  price: number;
  compare_at_price?: number; // Giá gốc để so sánh
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  // Relations
  product?: Product;
}

export interface ProductImage {
  id: number;
  product_id: number;
  variant_id?: number; // null = ảnh chung
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface StockLog {
  id: number;
  variant_id: number;
  admin_id?: number;
  change_qty: number; // Dương: nhập, âm: xuất
  note?: string;
  created_at: string;
  // Relations
  variant?: ProductVariant;
  admin?: User;
}

// ============================================
// ORDERS & PAYMENTS
// ============================================
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
  // Relations (for display)
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
  unit_price: number; // Snapshot giá lúc đặt
  subtotal: number;
  // Relations
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
  // Relations
  admin?: User;
}

export interface Payment {
  id: number;
  order_id: number;
  method: PaymentMethod;
  amount: number;
  transaction_id?: string;
  gateway_response?: any; // JSON
  status: PaymentGatewayStatus;
  paid_at?: string;
  created_at: string;
}

// ============================================
// COUPONS & PROMOTIONS
// ============================================
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

// ============================================
// SHOPPING CART
// ============================================
export interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at?: string;
  items?: CartItem[];
}

export interface CartItem {
  id: number;
  cart_id: number;
  variant_id: number;
  quantity: number;
  added_at: string;
  // Relations
  variant?: ProductVariant;
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================
export interface Customer extends User {
  totalOrders?: number;
  totalSpent?: number;
  addresses?: Address[];
}

// ============================================
// REVIEWS & WISHLIST
// ============================================
export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  variant_id?: number;
  order_id?: number;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  updated_at?: string;
  // Relations
  user?: User;
  product?: Product;
}

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  added_at: string;
  // Relations
  product?: Product;
}

// ============================================
// RETURN REQUESTS
// ============================================
export interface ReturnRequest {
  id: number;
  order_id: number;
  user_id: number;
  reason: string;
  status: ReturnStatus;
  admin_note?: string;
  refund_amount?: number;
  created_at: string;
  // Relations
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
  // Relations
  order_item?: OrderItem;
}

export interface ReturnImage {
  id: number;
  return_request_id: number;
  image_url: string;
}

// ============================================
// NOTIFICATIONS & BANNERS
// ============================================
export interface Notification {
  id: number;
  user_id?: number; // null = broadcast
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface Banner {
  id: number;
  image_url: string;
  link_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// ============================================
// DASHBOARD & REPORTS
// ============================================
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
  id?: string; // Unique identifier for React keys
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

// ============================================
// INVENTORY MANAGEMENT
// ============================================
export interface StockMovement {
  id: number;
  variant_id: number;
  admin_id?: number;
  change_qty: number; // Dương: nhập, âm: xuất
  note?: string;
  created_at: string;
  // Relations
  variant?: ProductVariant;
  admin?: User;
}

export interface InventoryTransaction extends StockLog {
  type: "in" | "out";
}

// ============================================
// SYSTEM CONFIGURATION
// ============================================
export interface SystemConfig {
  // Payment configuration
  paymentConfig: {
    codEnabled: boolean;
    bankTransferEnabled: boolean;
    creditCardEnabled: boolean;
    momoEnabled: boolean;
    vnpayEnabled: boolean;
  };
  
  // Shipping configuration
  shippingConfig: {
    baseShippingFee: number;
    freeShippingThreshold: number;
    distanceFeePerKm: number;
    urgentShippingFee: number;
  };
  
  // Bank information
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  
  // Banners
  banners: Array<{
    id: string;
    title: string;
    url: string;
    active: boolean;
  }>;
  
  // Notification templates
  notificationTemplates: {
    orderNotification: string;
    lowStockNotification: string;
    shipmentNotification: string;
  };
}