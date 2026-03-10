import {
  Product,
  ProductVariant,
  Category,
  Brand,
  Order,
  Customer,
  Coupon,
  DashboardStats,
  RevenueData,
  TopProduct,
  ReturnRequest,
  Address,
} from "../types";

// ============================================
// CATEGORIES
// ============================================
export const mockCategories: Category[] = [
  {
    id: 1,
    category_code: "CAT000001",
    name: "Vi điều khiển",
    slug: "vi-dieu-khien",
    created_at: "2025-12-01T00:00:00",
  },
  {
    id: 2,
    category_code: "CAT000002",
    name: "Single Board Computer",
    slug: "single-board-computer",
    created_at: "2025-12-05T00:00:00",
  },
  {
    id: 3,
    category_code: "CAT000003",
    name: "Cảm biến",
    slug: "cam-bien",
    created_at: "2025-12-10T00:00:00",
  },
  {
    id: 4,
    category_code: "CAT000004",
    name: "Động cơ",
    slug: "dong-co",
    created_at: "2025-12-15T00:00:00",
  },
  {
    id: 5,
    category_code: "CAT000005",
    name: "Module điều khiển",
    slug: "module-dieu-khien",
    created_at: "2026-01-05T00:00:00",
  },
  {
    id: 6,
    category_code: "CAT000006",
    name: "Hiển thị",
    slug: "hien-thi",
    created_at: "2026-01-10T00:00:00",
  },
];

// ============================================
// BRANDS
// ============================================
export const mockBrands: Brand[] = [
  { 
    id: 1,
    brand_code: "BRD000001",
    name: "Arduino", 
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg",
    created_at: "2025-12-05T00:00:00" 
  },
  { 
    id: 2,
    brand_code: "BRD000002",
    name: "Raspberry Pi", 
    logo_url: "https://upload.wikimedia.org/wikipedia/en/c/cb/Raspberry_Pi_Logo.svg",
    created_at: "2025-12-10T00:00:00" 
  },
  { id: 3, brand_code: "BRD000003", name: "Espressif", created_at: "2025-12-15T00:00:00" },
  { id: 4, brand_code: "BRD000004", name: "Aosong", created_at: "2025-12-20T00:00:00" },
  { id: 5, brand_code: "BRD000005", name: "Tower Pro", created_at: "2026-01-05T00:00:00" },
  { id: 6, brand_code: "BRD000006", name: "Generic", created_at: "2026-01-10T00:00:00" },
  { id: 7, brand_code: "BRD000007", name: "Songle", created_at: "2026-01-15T00:00:00" },
  { id: 8, brand_code: "BRD000008", name: "WorldSemi", created_at: "2026-01-20T00:00:00" },
];

// ============================================
// PRODUCTS (Không có giá/stock - có ở variants)
// ============================================
export const mockProducts: Product[] = [
  {
    id: 1,
    product_code: "SP000001",
    name: "Arduino Uno R3",
    slug: "arduino-uno-r3",
    description: "Bo mạch vi điều khiển Arduino Uno R3 chính hãng với chip ATmega328P",
    category_id: 1,
    brand_id: 1,
    specifications: {
      chip: "ATmega328P",
      voltage: "5V",
      digital_pins: 14,
      analog_pins: 6,
      flash_memory: "32KB",
    },
    status: "active",
    created_at: "2024-01-15T00:00:00",
    updated_at: "2024-02-20T00:00:00",
    category: mockCategories[0],
    brand: mockBrands[0],
  },
  {
    id: 2,
    product_code: "SP000002",
    name: "Raspberry Pi 4 Model B",
    slug: "raspberry-pi-4-model-b",
    description: "Máy tính nhúng Raspberry Pi 4 Model B với nhiều tùy chọn RAM",
    category_id: 2,
    brand_id: 2,
    specifications: {
      cpu: "Quad-core Cortex-A72",
      connectivity: "WiFi, Bluetooth 5.0, Gigabit Ethernet",
      ports: "2x USB 3.0, 2x USB 2.0, 2x micro-HDMI",
    },
    status: "active",
    created_at: "2024-01-10T00:00:00",
    updated_at: "2024-02-18T00:00:00",
    category: mockCategories[1],
    brand: mockBrands[1],
  },
  {
    id: 3,
    product_code: "SP000003",
    name: "ESP32 DevKit V1",
    slug: "esp32-devkit-v1",
    description: "Module ESP32 WiFi + Bluetooth tích hợp, lý tưởng cho IoT",
    category_id: 1,
    brand_id: 3,
    specifications: {
      chip: "ESP32-WROOM-32",
      wifi: "802.11 b/g/n",
      bluetooth: "v4.2 BR/EDR + BLE",
      flash: "4MB",
    },
    status: "active",
    created_at: "2024-01-20T00:00:00",
    category: mockCategories[0],
    brand: mockBrands[2],
  },
  {
    id: 4,
    product_code: "SP000004",
    name: "Cảm biến nhiệt độ DHT22",
    slug: "cam-bien-nhiet-do-dht22",
    description: "Cảm biến nhiệt độ và độ ẩm độ chính xác cao DHT22/AM2302",
    category_id: 3,
    brand_id: 4,
    specifications: {
      temp_range: "-40°C to 80°C",
      humidity_range: "0-100% RH",
      accuracy: "±0.5°C, ±2% RH",
    },
    status: "active",
    created_at: "2024-02-01T00:00:00",
    category: mockCategories[2],
    brand: mockBrands[3],
  },
  {
    id: 5,
    product_code: "SP000005",
    name: "Động cơ servo SG90",
    slug: "dong-co-servo-sg90",
    description: "Động cơ servo mini SG90 9g - phổ biến cho các dự án robot",
    category_id: 4,
    brand_id: 5,
    specifications: {
      weight: "9g",
      torque: "1.8 kgf·cm",
      speed: "0.1 s/60°",
      voltage: "4.8-6V",
    },
    status: "active",
    created_at: "2024-01-25T00:00:00",
    category: mockCategories[3],
    brand: mockBrands[4],
  },
  {
    id: 6,
    product_code: "SP000006",
    name: "LCD 16x2 I2C",
    slug: "lcd-16x2-i2c",
    description: "Màn hình LCD 16x2 với module I2C",
    category_id: 6,
    brand_id: 6,
    status: "discontinued",
    created_at: "2024-01-18T00:00:00",
    updated_at: "2024-02-23T00:00:00",
    category: mockCategories[5],
    brand: mockBrands[5],
  },
  {
    id: 7,
    product_code: "SP000007",
    name: "Relay 5V 1 kênh",
    slug: "relay-5v-1-kenh",
    description: "Module relay 5V 1 kênh 10A",
    category_id: 5,
    brand_id: 7,
    status: "active",
    created_at: "2024-02-05T00:00:00",
    category: mockCategories[4],
    brand: mockBrands[6],
  },
  {
    id: 8,
    product_code: "SP000008",
    name: "Led RGB WS2812B",
    slug: "led-rgb-ws2812b",
    description: "Led RGB addressable WS2812B",
    category_id: 6,
    brand_id: 8,
    status: "active",
    created_at: "2024-01-30T00:00:00",
    category: mockCategories[5],
    brand: mockBrands[7],
  },
];

// ============================================
// PRODUCT VARIANTS (Có giá/stock)
// ============================================
export const mockProductVariants: ProductVariant[] = [
  // Arduino Uno R3 - không có biến thể
  {
    id: 1,
    product_id: 1,
    sku: "ARD-UNO-R3",
    price: 150000,
    stock: 45,
    is_active: true,
    created_at: "2024-01-15T00:00:00",
  },
  // Raspberry Pi 4 - nhiều phiên bản RAM
  {
    id: 2,
    product_id: 2,
    sku: "RPI-4B-2GB",
    version: "2GB RAM",
    price: 950000,
    compare_at_price: 1200000,
    stock: 12,
    is_active: true,
    created_at: "2024-01-10T00:00:00",
  },
  {
    id: 3,
    product_id: 2,
    sku: "RPI-4B-4GB",
    version: "4GB RAM",
    price: 1200000,
    compare_at_price: 1500000,
    stock: 8,
    is_active: true,
    created_at: "2024-01-10T00:00:00",
  },
  {
    id: 4,
    product_id: 2,
    sku: "RPI-4B-8GB",
    version: "8GB RAM",
    price: 1650000,
    compare_at_price: 1900000,
    stock: 5,
    is_active: true,
    created_at: "2024-01-10T00:00:00",
  },
  // ESP32 DevKit V1
  {
    id: 5,
    product_id: 3,
    sku: "ESP32-DEV",
    price: 85000,
    stock: 120,
    is_active: true,
    created_at: "2024-01-20T00:00:00",
  },
  // DHT22
  {
    id: 6,
    product_id: 4,
    sku: "DHT22",
    price: 65000,
    stock: 3,
    is_active: true,
    created_at: "2024-02-01T00:00:00",
  },
  // Servo SG90 - nhiều màu
  {
    id: 7,
    product_id: 5,
    sku: "SERVO-SG90-BLUE",
    color: "Xanh dương",
    price: 25000,
    stock: 150,
    is_active: true,
    created_at: "2024-01-25T00:00:00",
  },
  {
    id: 8,
    product_id: 5,
    sku: "SERVO-SG90-ORANGE",
    color: "Cam",
    price: 25000,
    stock: 50,
    is_active: true,
    created_at: "2024-01-25T00:00:00",
  },
  {
    id: 9,
    product_id: 5,
    sku: "SERVO-SG90-WHITE",
    color: "Trắng",
    price: 27000,
    stock: 80,
    is_active: true,
    created_at: "2024-01-25T00:00:00",
  },
  // LCD 16x2 - ngừng kinh doanh
  {
    id: 10,
    product_id: 6,
    sku: "LCD-16X2-I2C",
    price: 55000,
    stock: 0,
    is_active: false,
    created_at: "2024-01-18T00:00:00",
  },
  // Relay
  {
    id: 11,
    product_id: 7,
    sku: "RELAY-5V-1CH",
    price: 15000,
    stock: 150,
    is_active: true,
    created_at: "2024-02-05T00:00:00",
  },
  // LED RGB
  {
    id: 12,
    product_id: 8,
    sku: "LED-WS2812B",
    price: 3000,
    stock: 500,
    is_active: true,
    created_at: "2024-01-30T00:00:00",
  },
];

// Gắn product vào variant để hiển thị
mockProductVariants.forEach((variant) => {
  variant.product = mockProducts.find((p) => p.id === variant.product_id);
});

// Gắn variants vào product
mockProducts.forEach((product) => {
  product.variants = mockProductVariants.filter((v) => v.product_id === product.id);
  
  // Đảm bảo category và brand có đầy đủ thông tin với code
  if (product.category_id) {
    const category = mockCategories.find((c) => c.id === product.category_id);
    if (category) {
      product.category = category;
    }
  }
  
  if (product.brand_id) {
    const brand = mockBrands.find((b) => b.id === product.brand_id);
    if (brand) {
      product.brand = brand;
    }
  }
});

// ============================================
// ADDRESSES
// ============================================
export const mockAddresses: Address[] = [
  {
    id: 1,
    user_id: 1,
    recipient: "Nguyễn Văn An",
    phone_number: "0901234567",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    street: "123 Lê Lợi",
    is_default: true,
    created_at: "2023-06-15T00:00:00",
  },
  {
    id: 2,
    user_id: 2,
    recipient: "Trần Thị Bình",
    phone_number: "0912345678",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Thành",
    street: "456 Nguyễn Huệ",
    is_default: true,
    created_at: "2023-08-20T00:00:00",
  },
  {
    id: 3,
    user_id: 3,
    recipient: "Lê Hoàng Cường",
    phone_number: "0923456789",
    province: "TP. Hồ Chí Minh",
    district: "Quận 5",
    ward: "Phường 1",
    street: "789 Trần Hưng Đạo",
    is_default: true,
    created_at: "2023-03-10T00:00:00",
  },
];

// ============================================
// CUSTOMERS
// ============================================
export const mockCustomers: Customer[] = [
  {
    id: 1,
    customer_code: "KH000001",
    full_name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0901234567",
    role: "customer",
    is_verified: true,
    is_active: true,
    created_at: "2024-01-15T10:30:00",
    totalOrders: 12,
    totalSpent: 45000000,
  },
  {
    id: 2,
    customer_code: "KH000002",
    full_name: "Trần Thị Bình",
    email: "tranthibinh@gmail.com",
    phone: "0912345678",
    role: "customer",
    is_verified: true,
    is_active: true,
    created_at: "2024-01-20T14:20:00",
    totalOrders: 8,
    totalSpent: 28000000,
  },
  {
    id: 3,
    customer_code: "KH000003",
    full_name: "Lê Minh Công",
    email: "leminhcong@gmail.com",
    phone: "0923456789",
    role: "customer",
    is_verified: true,
    is_active: true,
    created_at: "2024-02-01T09:15:00",
    totalOrders: 5,
    totalSpent: 15000000,
  },
  {
    id: 4,
    customer_code: "KH000004",
    full_name: "Phạm Thị Dung",
    email: "phamthidung@gmail.com",
    phone: "0934567890",
    role: "customer",
    is_verified: false,
    is_active: true,
    created_at: "2024-02-10T16:45:00",
    totalOrders: 2,
    totalSpent: 5000000,
  },
  {
    id: 5,
    customer_code: "KH000005",
    full_name: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    phone: "0945678901",
    role: "customer",
    is_verified: true,
    is_active: false,
    created_at: "2024-02-15T11:30:00",
    totalOrders: 0,
    totalSpent: 0,
  },
];

// ============================================
// COUPONS
// ============================================
export const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME2024",
    discount_type: "percent",
    discount_value: 10,
    min_order_value: 500000,
    max_uses: 100,
    used_count: 45,
    expires_at: "2026-03-31T23:59:59",
    is_active: true,
    created_at: "2025-12-25T00:00:00",
  },
  {
    id: 2,
    code: "FREESHIP",
    discount_type: "fixed",
    discount_value: 30000,
    min_order_value: 300000,
    max_uses: 200,
    used_count: 156,
    expires_at: "2026-02-28T23:59:59",
    is_active: true,
    created_at: "2026-01-25T00:00:00",
  },
  {
    id: 3,
    code: "SUMMER2023",
    discount_type: "percent",
    discount_value: 15,
    min_order_value: 1000000,
    max_uses: 50,
    used_count: 50,
    expires_at: "2025-08-31T23:59:59",
    is_active: false,
    created_at: "2025-05-20T00:00:00",
  },
];

// ============================================
// ORDERS
// ============================================
export const mockOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    address_id: 1,
    coupon_id: 2,
    subtotal: 725000,
    discount_amount: 50000,
    shipping_fee: 30000,
    total: 705000,
    payment_method: "cod",
    payment_status: "unpaid",
    order_status: "pending",
    note: "Giao hàng giờ hành chính",
    created_at: "2026-02-23T08:30:00",
    updated_at: "2026-02-23T08:30:00",
    user: mockCustomers[0],
    address: mockAddresses[0],
    coupon: mockCoupons[1],
    items: [
      {
        id: 1,
        order_id: 1,
        variant_id: 1,
        quantity: 2,
        unit_price: 150000,
        subtotal: 300000,
        variant: mockProductVariants[0],
      },
      {
        id: 2,
        order_id: 1,
        variant_id: 5,
        quantity: 5,
        unit_price: 85000,
        subtotal: 425000,
        variant: mockProductVariants[4],
      },
    ],
  },
  {
    id: 2,
    user_id: 2,
    address_id: 2,
    subtotal: 1200000,
    discount_amount: 0,
    shipping_fee: 50000,
    total: 1250000,
    payment_method: "bank_transfer",
    payment_status: "paid",
    order_status: "confirmed",
    created_at: "2026-02-22T14:20:00",
    updated_at: "2026-02-23T09:15:00",
    user: mockCustomers[1],
    address: mockAddresses[1],
    items: [
      {
        id: 3,
        order_id: 2,
        variant_id: 3,
        quantity: 1,
        unit_price: 1200000,
        subtotal: 1200000,
        variant: mockProductVariants[2],
      },
    ],
  },
  {
    id: 3,
    user_id: 3,
    address_id: 3,
    coupon_id: 1,
    subtotal: 1150000,
    discount_amount: 100000,
    shipping_fee: 40000,
    total: 1090000,
    payment_method: "momo",
    payment_status: "paid",
    order_status: "preparing",
    note: "Kiểm tra kỹ hàng trước khi đóng gói",
    created_at: "2026-02-22T10:00:00",
    updated_at: "2026-02-23T08:00:00",
    user: mockCustomers[2],
    address: mockAddresses[2],
    coupon: mockCoupons[0],
    items: [
      {
        id: 4,
        order_id: 3,
        variant_id: 6,
        quantity: 10,
        unit_price: 65000,
        subtotal: 650000,
        variant: mockProductVariants[5],
      },
      {
        id: 5,
        order_id: 3,
        variant_id: 7,
        quantity: 20,
        unit_price: 25000,
        subtotal: 500000,
        variant: mockProductVariants[6],
      },
    ],
  },
  {
    id: 4,
    user_id: 1,
    address_id: 1,
    subtotal: 75000,
    discount_amount: 0,
    shipping_fee: 25000,
    total: 100000,
    payment_method: "cod",
    payment_status: "paid",
    order_status: "packed",
    created_at: "2026-02-21T16:45:00",
    updated_at: "2026-02-23T07:30:00",
    user: mockCustomers[0],
    address: mockAddresses[0],
    items: [
      {
        id: 6,
        order_id: 4,
        variant_id: 11,
        quantity: 5,
        unit_price: 15000,
        subtotal: 75000,
        variant: mockProductVariants[10],
      },
    ],
  },
  {
    id: 5,
    user_id: 3,
    address_id: 3,
    coupon_id: 2,
    subtotal: 300000,
    discount_amount: 30000,
    shipping_fee: 30000,
    total: 300000,
    payment_method: "bank_transfer",
    payment_status: "paid",
    order_status: "shipping",
    created_at: "2026-01-20T11:20:00",
    updated_at: "2026-02-23T06:00:00",
    user: mockCustomers[2],
    address: mockAddresses[2],
    coupon: mockCoupons[1],
    items: [
      {
        id: 7,
        order_id: 5,
        variant_id: 12,
        quantity: 100,
        unit_price: 3000,
        subtotal: 300000,
        variant: mockProductVariants[11],
      },
    ],
  },
  {
    id: 6,
    user_id: 2,
    address_id: 2,
    subtotal: 450000,
    discount_amount: 0,
    shipping_fee: 30000,
    total: 480000,
    payment_method: "cod",
    payment_status: "paid",
    order_status: "delivered",
    created_at: "2026-01-19T09:00:00",
    updated_at: "2026-01-21T15:30:00",
    user: mockCustomers[1],
    address: mockAddresses[1],
    items: [
      {
        id: 8,
        order_id: 6,
        variant_id: 1,
        quantity: 3,
        unit_price: 150000,
        subtotal: 450000,
        variant: mockProductVariants[0],
      },
    ],
  },
  {
    id: 7,
    user_id: 1,
    address_id: 1,
    subtotal: 110000,
    discount_amount: 0,
    shipping_fee: 25000,
    total: 135000,
    payment_method: "bank_transfer",
    payment_status: "refunded",
    order_status: "cancelled",
    cancel_reason: "Khách hàng yêu cầu hủy đơn",
    created_at: "2025-12-18T13:30:00",
    updated_at: "2025-12-19T10:00:00",
    user: mockCustomers[0],
    address: mockAddresses[0],
    items: [
      {
        id: 9,
        order_id: 7,
        variant_id: 10,
        quantity: 2,
        unit_price: 55000,
        subtotal: 110000,
        variant: mockProductVariants[9],
      },
    ],
  },
];

// ============================================
// RETURN REQUESTS
// ============================================
export const mockReturnRequests: ReturnRequest[] = [
  {
    id: 1,
    order_id: 6,
    user_id: 2,
    reason: "Sản phẩm không đúng mô tả, thiếu phụ kiện đi kèm. Tôi đã đặt Arduino Uno R3 nhưng không có dây USB kèm theo.",
    status: "pending",
    created_at: "2026-02-22T10:00:00",
    order: mockOrders[5],
    user: mockCustomers[1],
    items: [
      {
        id: 1,
        return_request_id: 1,
        order_item_id: 8,
        quantity: 2,
        condition: "wrong_item",
        order_item: mockOrders[5].items?.[0],
      },
    ],
    images: [
      {
        id: 1,
        return_request_id: 1,
        image_url: "https://genk.mediacdn.vn/k:2016/11349324-1685331671706633-667022670-n-1457155607213/day-chinh-la-mau-den-nhat-trong-tat-ca-cac-mau-den.jpg",
      },
      {
        id: 2,
        return_request_id: 1,
        image_url: "https://genk.mediacdn.vn/k:2016/11349324-1685331671706633-667022670-n-1457155607213/day-chinh-la-mau-den-nhat-trong-tat-ca-cac-mau-den.jpg",
      },
    ],
  },
  {
    id: 2,
    order_id: 3,
    user_id: 3,
    reason: "Cảm biến DHT22 bị lỗi không đọc được nhiệt độ. Đã test với nhiều bo mạch khác nhau nhưng vẫn không hoạt động.",
    status: "approved",
    admin_note: "Đã chấp nhận yêu cầu trả hàng. Vui lòng gửi hàng về địa chỉ kho của shop.",
    refund_amount: 650000,
    created_at: "2026-02-21T15:30:00",
    order: mockOrders[2],
    user: mockCustomers[2],
    items: [
      {
        id: 2,
        return_request_id: 2,
        order_item_id: 4,
        quantity: 10,
        condition: "damaged",
        order_item: mockOrders[2].items?.[0],
      },
    ],
    images: [
      {
        id: 3,
        return_request_id: 2,
        image_url: "https://genk.mediacdn.vn/k:2016/11349324-1685331671706633-667022670-n-1457155607213/day-chinh-la-mau-den-nhat-trong-tat-ca-cac-mau-den.jpg",
      },
      {
        id: 4,
        return_request_id: 2,
        image_url: "https://genk.mediacdn.vn/k:2016/11349324-1685331671706633-667022670-n-1457155607213/day-chinh-la-mau-den-nhat-trong-tat-ca-cac-mau-den.jpg",
      },
      {
        id: 5,
        return_request_id: 2,
        image_url: "https://genk.mediacdn.vn/k:2016/11349324-1685331671706633-667022670-n-1457155607213/day-chinh-la-mau-den-nhat-trong-tat-ca-cac-mau-den.jpg",
      },
    ],
  },
  {
    id: 3,
    order_id: 5,
    user_id: 3,
    reason: "Sản phẩm bị vỡ trong quá trình vận chuyển",
    status: "received",
    admin_note: "Đã nhận hàng trả về. Đang kiểm tra tình trạng để hoàn tiền.",
    refund_amount: 300000,
    created_at: "2026-01-20T09:15:00",
    order: mockOrders[4],
    user: mockCustomers[2],
    items: [
      {
        id: 3,
        return_request_id: 3,
        order_item_id: 7,
        quantity: 100,
        condition: "damaged",
        order_item: mockOrders[4].items?.[0],
      },
    ],
    images: [
      {
        id: 6,
        return_request_id: 3,
        image_url: "https://genk.mediacdn.vn/k:2016/11349324-1685331671706633-667022670-n-1457155607213/day-chinh-la-mau-den-nhat-trong-tat-ca-cac-mau-den.jpg",
      },
    ],
  },
  {
    id: 4,
    order_id: 2,
    user_id: 2,
    reason: "Đổi ý không muốn mua nữa",
    status: "rejected",
    admin_note: "Sản phẩm điện tử không hỗ trợ trả hàng với lý do đổi ý. Theo chính sách của shop, chỉ chấp nhận trả hàng khi sản phẩm lỗi hoặc sai mô tả.",
    created_at: "2026-01-19T14:20:00",
    order: mockOrders[1],
    user: mockCustomers[1],
    items: [
      {
        id: 4,
        return_request_id: 4,
        order_item_id: 3,
        quantity: 1,
        condition: "good",
        order_item: mockOrders[1].items?.[0],
      },
    ],
    images: [],
  },
];

// ============================================
// DASHBOARD STATS
// ============================================
export const mockDashboardStats: DashboardStats = {
  totalRevenue: 45678000,
  totalOrders: 234,
  totalCustomers: 89,
  pendingOrders: 12,
  revenueChange: 12.5,
  ordersChange: 8.3,
  customersChange: 15.2,
  pendingChange: -5.4,
  lowStockProducts: 4,
  returnRequests: 2,
};

// ============================================
// REVENUE DATA FOR CHARTS
// ============================================
export const mockRevenueData: RevenueData[] = [
  { date: "T2", revenue: 3200000, orders: 18 },
  { date: "T3", revenue: 4100000, orders: 22 },
  { date: "T4", revenue: 2800000, orders: 15 },
  { date: "T5", revenue: 5500000, orders: 28 },
  { date: "T6", revenue: 6200000, orders: 32 },
  { date: "T7", revenue: 7800000, orders: 41 },
  { date: "CN", revenue: 8400000, orders: 45 },
].map((item, index) => ({ ...item, id: `revenue-${index}` }));

// ============================================
// TOP SELLING PRODUCTS
// ============================================
export const mockTopProducts: TopProduct[] = [
  { product_id: 3, product_name: "ESP32 DevKit V1", total_sold: 245, total_revenue: 20825000 },
  { product_id: 1, product_name: "Arduino Uno R3", total_sold: 189, total_revenue: 28350000 },
  { product_id: 2, product_name: "Raspberry Pi 4 Model B", total_sold: 45, total_revenue: 54000000 },
  { product_id: 5, product_name: "Động cơ servo SG90", total_sold: 456, total_revenue: 11400000 },
  { product_id: 4, product_name: "Cảm biến DHT22", total_sold: 156, total_revenue: 10140000 },
];