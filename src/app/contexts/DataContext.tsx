import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Category,
  Brand,
  Customer,
  Order,
  OrderItem,
  Coupon,
  ProductVariant,
  ProductImage,
  StockMovement,
  ReturnRequest,
  SystemConfig,
} from "../types";
import {
  mockProducts,
  mockCategories,
  mockBrands,
  mockCustomers,
  mockOrders,
  mockProductVariants,
  mockReturnRequests,
  mockCoupons,
} from "../utils/mockData";
import { generateSlug } from "../utils/slugUtils";

interface DataContextType {
  // Data
  products: Product[];
  categories: Category[];
  brands: Brand[];
  customers: Customer[];
  orders: Order[];
  orderItems: OrderItem[];
  coupons: Coupon[];
  productVariants: ProductVariant[];
  productImages: ProductImage[];
  stockMovements: StockMovement[];
  returnRequests: ReturnRequest[];
  systemConfig: SystemConfig;

  // Product actions
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Category actions
  addCategory: (category: Omit<Category, "id" | "created_at">) => void;
  updateCategory: (id: number, updates: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // Brand actions
  addBrand: (brand: Omit<Brand, "id" | "created_at">) => void;
  updateBrand: (id: number, updates: Partial<Brand>) => void;
  deleteBrand: (id: number) => void;

  // Customer actions
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;

  // Order actions
  addOrder: (order: Omit<Order, "id" | "created_at" | "updated_at">) => void;
  updateOrder: (id: number, updates: Partial<Order>) => void;
  deleteOrder: (id: number) => void;

  // Order Item actions
  addOrderItem: (item: Omit<OrderItem, "id" | "created_at">) => void;
  updateOrderItem: (id: number, updates: Partial<OrderItem>) => void;
  deleteOrderItem: (id: number) => void;

  // Coupon actions
  addCoupon: (coupon: Omit<Coupon, "id" | "created_at">) => void;
  updateCoupon: (id: number, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: number) => void;

  // Product Variant actions
  addProductVariant: (variant: Omit<ProductVariant, "id" | "created_at">) => void;
  updateProductVariant: (id: number, updates: Partial<ProductVariant>) => void;
  deleteProductVariant: (id: number) => void;

  // Product Image actions
  addProductImage: (image: Omit<ProductImage, "id">) => void;
  updateProductImage: (id: number, updates: Partial<ProductImage>) => void;
  deleteProductImage: (id: number) => void;

  // Stock Movement actions
  addStockMovement: (movement: Omit<StockMovement, "id" | "created_at">) => void;
  updateStockMovement: (id: number, updates: Partial<StockMovement>) => void;
  deleteStockMovement: (id: number) => void;

  // Return Request actions
  addReturnRequest: (request: Omit<ReturnRequest, "id" | "created_at">) => void;
  updateReturnRequest: (id: number, updates: Partial<ReturnRequest>) => void;
  deleteReturnRequest: (id: number) => void;

  // System Config actions
  updateSystemConfig: (updates: Partial<SystemConfig>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // ============================================
  // STATE - Base data sources
  // ============================================
  const [baseProducts, setBaseProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [baseCustomers, setBaseCustomers] = useState<Customer[]>(mockCustomers);
  const [baseOrders, setBaseOrders] = useState<Order[]>(mockOrders);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>(mockProductVariants);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(mockReturnRequests);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    paymentConfig: {
      codEnabled: true,
      bankTransferEnabled: true,
      creditCardEnabled: false,
      momoEnabled: true,
      vnpayEnabled: false,
    },
    shippingConfig: {
      baseShippingFee: 30000,
      freeShippingThreshold: 500000,
      distanceFeePerKm: 5000,
      urgentShippingFee: 50000,
    },
    bankInfo: {
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
      accountNumber: "0123456789",
      accountName: "CONG TY TNHH IT STORE",
    },
    banners: [
      { id: "1", title: "Banner khuyến mãi tháng 2", url: "", active: true },
      { id: "2", title: "Banner sản phẩm mới", url: "", active: true },
    ],
    notificationTemplates: {
      orderNotification: "Bạn có đơn hàng mới từ [CUSTOMER_NAME]",
      lowStockNotification: "Sản phẩm [PRODUCT_NAME] sắp hết hàng (còn [QUANTITY])",
      shipmentNotification: "Đơn hàng [ORDER_NUMBER] đang được giao bởi [SHIPPER_NAME]",
    },
  });

  // Synced data (with all relations)
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // ============================================
  // AUTO-SYNC: Products (sync with categories, brands, variants, images)
  // ============================================
  useEffect(() => {
    const syncedProducts = baseProducts.map((product) => {
      const category = categories.find((c) => c.id === product.category_id);
      const brand = brands.find((b) => b.id === product.brand_id);
      const variants = productVariants
        .filter((v) => v.product_id === product.id)
        .map((v) => ({
          ...v,
          product: baseProducts.find((p) => p.id === v.product_id),
        }));
      const images = productImages.filter((img) => img.product_id === product.id);

      return {
        ...product,
        category,
        brand,
        variants,
        images,
      };
    });

    setProducts(syncedProducts);
  }, [baseProducts, categories, brands, productVariants, productImages]);

  // ============================================
  // AUTO-SYNC: Customers (calculate totalOrders & totalSpent from orders)
  // ============================================
  useEffect(() => {
    const syncedCustomers = baseCustomers.map((customer) => {
      const customerOrders = baseOrders.filter((o) => o.user_id === customer.id);
      const totalOrders = customerOrders.length;
      
      // Tổng chi tiêu = tổng các đơn đã thanh toán (không tính đơn đã hoàn tiền)
      const totalSpent = customerOrders.reduce((sum, order) => {
        if (order.payment_status === "paid") {
          return sum + order.total;
        }
        return sum;
      }, 0);

      return {
        ...customer,
        totalOrders,
        totalSpent,
      };
    });

    setCustomers(syncedCustomers);
  }, [baseCustomers, baseOrders]);

  // ============================================
  // AUTO-SYNC: Orders (sync with customers, products, promotions)
  // ============================================
  useEffect(() => {
    const syncedOrders = baseOrders.map((order) => {
      const user = baseCustomers.find((c) => c.id === order.user_id);
      
      // Sync order items with product info
      const items = order.items?.map((item) => {
        const variant = productVariants.find((v) => v.id === item.variant_id);
        const product = variant ? baseProducts.find((p) => p.id === variant.product_id) : undefined;
        return {
          ...item,
          variant,
          product,
        };
      });

      return {
        ...order,
        user,
        items,
      };
    });

    setOrders(syncedOrders);
  }, [baseOrders, baseCustomers, baseProducts, productVariants]);

  // ============================================
  // PRODUCT ACTIONS
  // ============================================
  const addProduct = (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    setBaseProducts((prev) => {
      const newId = Math.max(...prev.map((p) => p.id), 0) + 1;
      const slug = product.slug || generateSlug(product.name);
      
      const newProduct: Product = {
        ...product,
        id: newId,
        slug,
        product_code: product.product_code || `SP${newId.toString().padStart(6, "0")}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return [...prev, newProduct];
    });
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setBaseProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          const slug = updates.name && !updates.slug 
            ? generateSlug(updates.name)
            : updates.slug;
          return {
            ...product,
            ...updates,
            ...(slug && { slug }),
            updated_at: new Date().toISOString(),
          };
        }
        return product;
      })
    );
  };

  const deleteProduct = (id: number) => {
    setBaseProducts((prev) => prev.filter((p) => p.id !== id));
    setProductVariants((prev) => prev.filter((v) => v.product_id !== id));
    setProductImages((prev) => prev.filter((img) => img.product_id !== id));
  };

  // ============================================
  // CATEGORY ACTIONS
  // ============================================
  const addCategory = (category: Omit<Category, "id" | "created_at">) => {
    setCategories((prev) => {
      const newId = Math.max(...prev.map((c) => c.id), 0) + 1;
      const slug = category.slug || generateSlug(category.name);
      const newCategory: Category = {
        ...category,
        id: newId,
        slug,
        category_code: category.category_code || `CAT${newId.toString().padStart(6, "0")}`,
        created_at: new Date().toISOString(),
      };
      return [...prev, newCategory];
    });
  };

  const updateCategory = (id: number, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const slug = updates.name && !updates.slug 
            ? generateSlug(updates.name)
            : updates.slug;
          return { ...cat, ...updates, ...(slug && { slug }) };
        }
        return cat;
      })
    );
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // ============================================
  // BRAND ACTIONS
  // ============================================
  const addBrand = (brand: Omit<Brand, "id" | "created_at">) => {
    setBrands((prev) => {
      const newId = Math.max(...prev.map((b) => b.id), 0) + 1;
      const newBrand: Brand = {
        ...brand,
        id: newId,
        brand_code: brand.brand_code || `BRD${newId.toString().padStart(6, "0")}`,
        created_at: new Date().toISOString(),
      };
      return [...prev, newBrand];
    });
  };

  const updateBrand = (id: number, updates: Partial<Brand>) => {
    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === id ? { ...brand, ...updates } : brand
      )
    );
  };

  const deleteBrand = (id: number) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
  };

  // ============================================
  // CUSTOMER ACTIONS
  // ============================================
  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setBaseCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? { ...customer, ...updates, updated_at: new Date().toISOString() }
          : customer
      )
    );
  };

  const deleteCustomer = (id: number) => {
    setBaseCustomers((prev) => prev.filter((customer) => customer.id !== id));
    setBaseOrders((prev) => prev.filter((order) => order.user_id !== id));
  };

  // ============================================
  // ORDER ACTIONS
  // ============================================
  const addOrder = (order: Omit<Order, "id" | "created_at" | "updated_at">) => {
    setBaseOrders((prev) => {
      const newId = Math.max(...prev.map((o) => o.id), 0) + 1;
      const newOrder: Order = {
        ...order,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return [...prev, newOrder];
    });

    // Auto-update inventory
    if (order.status === "confirmed" || order.status === "processing") {
      order.items?.forEach((item) => {
        setProductVariants((prev) =>
          prev.map((v) =>
            v.id === item.variant_id
              ? { ...v, stock: v.stock - item.quantity, updated_at: new Date().toISOString() }
              : v
          )
        );
      });
    }
  };

  const updateOrder = (id: number, updates: Partial<Order>) => {
    setBaseOrders((prev) => {
      const oldOrder = prev.find((o) => o.id === id);
      
      // Auto-update payment status: COD delivered = paid
      if (oldOrder && updates.order_status === "delivered") {
        if (oldOrder.payment_method === "cod" && oldOrder.payment_status === "unpaid") {
          updates.payment_status = "paid";
        }
      }
      
      // Auto-update inventory based on status changes
      if (oldOrder && updates.order_status) {
        const isConfirming = 
          (oldOrder.order_status === "pending" || oldOrder.order_status === "confirmed") &&
          (updates.order_status === "processing" || updates.order_status === "shipping");
        
        const isCancelling = 
          (oldOrder.order_status !== "cancelled" && oldOrder.order_status !== "delivered") &&
          updates.order_status === "cancelled";

        if (isConfirming) {
          oldOrder.items?.forEach((item) => {
            setProductVariants((variants) =>
              variants.map((v) =>
                v.id === item.variant_id
                  ? { ...v, stock: v.stock - item.quantity, updated_at: new Date().toISOString() }
                  : v
              )
            );
          });
        } else if (isCancelling) {
          oldOrder.items?.forEach((item) => {
            setProductVariants((variants) =>
              variants.map((v) =>
                v.id === item.variant_id
                  ? { ...v, stock: v.stock + item.quantity, updated_at: new Date().toISOString() }
                  : v
              )
            );
          });
        }
      }

      return prev.map((order) =>
        order.id === id 
          ? { ...order, ...updates, updated_at: new Date().toISOString() } 
          : order
      );
    });
  };

  const deleteOrder = (id: number) => {
    setBaseOrders((prev) => {
      const order = prev.find((o) => o.id === id);
      
      // Restore stock if needed
      if (order && (order.status === "processing" || order.status === "shipping")) {
        order.items?.forEach((item) => {
          setProductVariants((variants) =>
            variants.map((v) =>
              v.id === item.variant_id
                ? { ...v, stock: v.stock + item.quantity, updated_at: new Date().toISOString() }
                : v
            )
          );
        });
      }

      return prev.filter((order) => order.id !== id);
    });
  };

  // ============================================
  // ORDER ITEM ACTIONS
  // ============================================
  const addOrderItem = (item: Omit<OrderItem, "id" | "created_at">) => {
    setOrderItems((prev) => {
      const newId = Math.max(...prev.map((i) => i.id), 0) + 1;
      const newOrderItem: OrderItem = {
        ...item,
        id: newId,
        created_at: new Date().toISOString(),
      };
      return [...prev, newOrderItem];
    });
  };

  const updateOrderItem = (id: number, updates: Partial<OrderItem>) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteOrderItem = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ============================================
  // COUPON ACTIONS
  // ============================================
  const addCoupon = (coupon: Omit<Coupon, "id" | "created_at">) => {
    setCoupons((prev) => {
      const newId = Math.max(...prev.map((c) => c.id), 0) + 1;
      const newCoupon: Coupon = {
        ...coupon,
        id: newId,
        created_at: new Date().toISOString(),
      };
      return [...prev, newCoupon];
    });
  };

  const updateCoupon = (id: number, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, ...updates } : coupon
      )
    );
  };

  const deleteCoupon = (id: number) => {
    setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
  };

  // ============================================
  // PRODUCT VARIANT ACTIONS
  // ============================================
  const addProductVariant = (variant: Omit<ProductVariant, "id" | "created_at">) => {
    setProductVariants((prev) => {
      const newId = Math.max(...prev.map((v) => v.id), 0) + 1;
      
      const newVariant: ProductVariant = {
        ...variant,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return [...prev, newVariant];
    });
  };

  const updateProductVariant = (id: number, updates: Partial<ProductVariant>) => {
    setProductVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === id) {
          return {
            ...variant,
            ...updates,
            updated_at: new Date().toISOString(),
          };
        }
        return variant;
      })
    );
  };

  const deleteProductVariant = (id: number) => {
    setProductVariants((prev) => prev.filter((variant) => variant.id !== id));
  };

  // ============================================
  // PRODUCT IMAGE ACTIONS
  // ============================================
  const addProductImage = (image: Omit<ProductImage, "id">) => {
    setProductImages((prev) => {
      const newId = Math.max(...prev.map((img) => img.id), 0) + 1;
      const newImage: ProductImage = {
        ...image,
        id: newId,
      };
      return [...prev, newImage];
    });
  };

  const updateProductImage = (id: number, updates: Partial<ProductImage>) => {
    setProductImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      )
    );
  };

  const deleteProductImage = (id: number) => {
    setProductImages((prev) => prev.filter((img) => img.id !== id));
  };

  // ============================================
  // STOCK MOVEMENT ACTIONS
  // ============================================
  const addStockMovement = (movement: Omit<StockMovement, "id" | "created_at">) => {
    setStockMovements((prev) => {
      const newId = Math.max(...prev.map((m) => m.id), 0) + 1;
      const newMovement: StockMovement = {
        ...movement,
        id: newId,
        created_at: new Date().toISOString(),
      };
      return [...prev, newMovement];
    });
  };

  const updateStockMovement = (id: number, updates: Partial<StockMovement>) => {
    setStockMovements((prev) =>
      prev.map((movement) =>
        movement.id === id ? { ...movement, ...updates } : movement
      )
    );
  };

  const deleteStockMovement = (id: number) => {
    setStockMovements((prev) => prev.filter((movement) => movement.id !== id));
  };

  // ============================================
  // RETURN REQUEST ACTIONS
  // ============================================
  const addReturnRequest = (request: Omit<ReturnRequest, "id" | "created_at">) => {
    setReturnRequests((prev) => {
      const newId = Math.max(...prev.map((r) => r.id), 0) + 1;
      const newRequest: ReturnRequest = {
        ...request,
        id: newId,
        created_at: new Date().toISOString(),
      };
      return [...prev, newRequest];
    });
  };

  const updateReturnRequest = (id: number, updates: Partial<ReturnRequest>) => {
    setReturnRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const deleteReturnRequest = (id: number) => {
    setReturnRequests((prev) => prev.filter((request) => request.id !== id));
  };

  // ============================================
  // SYSTEM CONFIG ACTIONS
  // ============================================
  const updateSystemConfig = (updates: Partial<SystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...updates }));
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value: DataContextType = {
    // Data (all auto-synced)
    products,
    categories,
    brands,
    customers,
    orders,
    orderItems,
    coupons,
    productVariants,
    productImages,
    stockMovements,
    returnRequests,
    systemConfig,

    // Actions
    addProduct,
    updateProduct,
    deleteProduct,

    addCategory,
    updateCategory,
    deleteCategory,

    addBrand,
    updateBrand,
    deleteBrand,

    updateCustomer,
    deleteCustomer,

    addOrder,
    updateOrder,
    deleteOrder,

    addOrderItem,
    updateOrderItem,
    deleteOrderItem,

    addCoupon,
    updateCoupon,
    deleteCoupon,

    addProductVariant,
    updateProductVariant,
    deleteProductVariant,

    addProductImage,
    updateProductImage,
    deleteProductImage,

    addStockMovement,
    updateStockMovement,
    deleteStockMovement,

    addReturnRequest,
    updateReturnRequest,
    deleteReturnRequest,

    updateSystemConfig,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Export useData hook for consuming the context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}