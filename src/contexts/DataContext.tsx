import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  Product,
  Category,
  Brand,
  Customer,
  Order,
  OrderItem,
  ReturnItem,
  Coupon,
  ProductVariant,
  ProductImage,
  StockMovement,
  ReturnRequest,
} from "../types";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { brandService } from "../services/brandService";
import { orderService } from "../services/orderService";
import { customerService } from "../services/customerService";
import { couponService } from "../services/couponService";
import { returnService } from "../services/returnService";
import type { ReturnRequestUpdate } from "../services/returnService";

interface DataContextType {
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
  productFetchError: string | null;
  brandFetchError: string | null;
  refreshData: () => Promise<void>;

  fetchCategories: (force?: boolean) => Promise<void>;
  fetchBrands: (force?: boolean) => Promise<void>;
  fetchCustomers: (force?: boolean) => Promise<void>;
  fetchOrders: (force?: boolean) => Promise<void>;
  fetchCoupons: (force?: boolean) => Promise<void>;
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchProductImages: (force?: boolean) => Promise<void>;
  fetchStockMovements: (force?: boolean) => Promise<void>;
  fetchReturnRequests: (force?: boolean) => Promise<void>;

  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at" | "slug"> & { slug?: string }) => Promise<number>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  addCategory: (category: Omit<Category, "id" | "created_at">) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  addBrand: (brand: Omit<Brand, "id" | "created_at"> & { logo_file?: File }) => Promise<void>;
  updateBrand: (id: number, updates: Partial<Brand> & { logo_file?: File }) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;

  updateCustomer: (id: number, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;

  addOrder: (order: Omit<Order, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateOrder: (id: number, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;

  addCoupon: (coupon: Omit<Coupon, "id" | "created_at">) => Promise<void>;
  updateCoupon: (id: number, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: number) => Promise<void>;

  addProductVariant: (
    variant: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File },
  ) => Promise<void>;
  updateProductVariant: (id: number, updates: Partial<ProductVariant> & { variant_image_file?: File }) => Promise<void>;
  deleteProductVariant: (id: number) => Promise<void>;

  addProductImage: (image: Omit<ProductImage, "id"> & { image_file?: File }) => Promise<void>;
  updateProductImage: (id: number, updates: Partial<ProductImage>) => Promise<void>;
  deleteProductImage: (id: number) => Promise<void>;
  setPrimaryProductImage: (id: number) => Promise<void>;

  addStockMovement: (movement: Omit<StockMovement, "id" | "created_at">) => Promise<void>;
  updateStockMovement: (id: number, updates: Partial<StockMovement>) => Promise<void>;
  deleteStockMovement: (id: number) => Promise<void>;

  updateReturnRequest: (id: number, updates: ReturnRequestUpdate) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function normalizeReturnRequests(
  requests: ReturnRequest[],
  orderItems: OrderItem[],
  productVariants: ProductVariant[],
): ReturnRequest[] {
  return requests.map((request) => {
    const rawItems =
      (request as ReturnRequest & { return_items?: ReturnItem[] }).items ??
      (request as ReturnRequest & { return_items?: ReturnItem[] }).return_items ??
      [];
    const requestOrderItems =
      (request.order as Order | undefined)?.items ??
      ((request.order as Order & { order_items?: OrderItem[] } | undefined)
        ?.order_items ??
        []);

    const items = rawItems.map((item) => {
      const embeddedOrderItem = item.order_item;
      const matchedRequestOrderItem = requestOrderItems.find(
        (orderItemEntry) => String(orderItemEntry.id) === String(item.order_item_id),
      );
      const matchedGlobalOrderItem = orderItems.find(
        (orderItemEntry) => String(orderItemEntry.id) === String(item.order_item_id),
      );
      const orderItem =
        embeddedOrderItem ?? matchedRequestOrderItem ?? matchedGlobalOrderItem;
      const matchedVariant =
        orderItem?.variant_id == null
          ? undefined
          : productVariants.find(
              (variantEntry) =>
                String(variantEntry.id) === String(orderItem.variant_id),
            );
      const variant =
        orderItem?.variant ??
        (orderItem as OrderItem & { product_variant?: ProductVariant })?.product_variant ??
        matchedVariant;

      return {
        ...item,
        condition:
          item.condition ??
          (item as ReturnItem & { return_condition?: ReturnItem["condition"] })
            .return_condition,
        order_item: orderItem ? { ...orderItem, variant } : item.order_item,
      };
    });

    return {
      ...request,
      items,
    };
  });
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [rawCustomers, setRawCustomers] = useState<Customer[]>([]);
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [productFetchError, setProductFetchError] = useState<string | null>(null);
  const [brandFetchError, setBrandFetchError] = useState<string | null>(null);

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [couponsLoaded, setCouponsLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [stockLoaded, setStockLoaded] = useState(false);
  const [returnsLoaded, setReturnsLoaded] = useState(false);

  const fetchCategories = useCallback(async (force = false) => {
    if (categoriesLoaded && !force) return;
    try {
      const res = await categoryService.getAll();
      setCategories(res);
      setCategoriesLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [categoriesLoaded]);

  const fetchBrands = useCallback(async (force = false) => {
    if (brandsLoaded && !force) return;
    try {
      const res = await brandService.getAll();
      setBrands(res);
      setBrandFetchError(null);
      setBrandsLoaded(true);
    } catch (e) {
      setBrandFetchError(e instanceof Error ? e.message : "Không thể tải thương hiệu");
    }
  }, [brandsLoaded]);

  const fetchCustomers = useCallback(async (force = false) => {
    if (customersLoaded && !force) return;
    try {
      const res = await customerService.getAll();
      setRawCustomers(res);
      setCustomersLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [customersLoaded]);

  const fetchOrders = useCallback(async (force = false) => {
    if (ordersLoaded && !force) return;
    try {
      const res = await orderService.getAll();
      setRawOrders(res);
      setOrdersLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [ordersLoaded]);

  const fetchCoupons = useCallback(async (force = false) => {
    if (couponsLoaded && !force) return;
    try {
      const res = await couponService.getAll();
      setCoupons(res);
      setCouponsLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [couponsLoaded]);

  const fetchProducts = useCallback(async (force = false) => {
    if (productsLoaded && !force) return;
    try {
      const res = await productService.getAll({ page: 1, limit: 1000 });
      setRawProducts(res.data);
      const variants = res.data.flatMap((p) =>
        (p.variants || []).map((v) => ({ ...v, product_id: p.id })),
      );
      setProductVariants(variants);
      setProductsLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [productsLoaded]);

  const fetchProductImages = useCallback(async (force = false) => {
    if (imagesLoaded && !force) return;
    try {
      const res = await productService.getImages();
      setProductImages(res);
      setImagesLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [imagesLoaded]);

  const fetchStockMovements = useCallback(async (force = false) => {
    if (stockLoaded && !force) return;
    try {
      const res = await productService.getStockMovements();
      setStockMovements(res);
      setStockLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [stockLoaded]);

  const fetchReturnRequests = useCallback(async (force = false) => {
    if (returnsLoaded && !force) return;
    try {
      const res = await returnService.getAll();
      setReturnRequests(normalizeReturnRequests(res, [], []));
      setReturnsLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }, [returnsLoaded]);

  const products: Product[] = rawProducts.map((p) => ({
    ...p,
    variants: productVariants.filter((v) => v.product_id === p.id),
    images: productImages.filter((img) => img.product_id === p.id),
  }));

  const customers: Customer[] = useMemo(
    () =>
      rawCustomers.map((c) => {
        const paidOrders = rawOrders.filter(
          (o) => o.user_id === c.id && o.payment_status === "paid",
        );
        return {
          ...c,
          totalOrders: paidOrders.length,
          totalSpent: paidOrders.reduce((sum, o) => sum + o.total, 0),
        };
      }),
    [rawCustomers, rawOrders],
  );

  const orders: Order[] = useMemo(
    () =>
      rawOrders.map((o) => {
        const rawItemsFromOrder =
          (o as any).items ?? (o as any).order_items ?? (o as any).orderItems ?? [];
        const itemsSource = (Array.isArray(rawItemsFromOrder) && rawItemsFromOrder.length)
          ? rawItemsFromOrder
          : orderItems.filter((i) => String(i.order_id) === String(o.id));

        const items = itemsSource.map((item) => {
          const variant = productVariants.find((v) => String(v.id) === String(item.variant_id));
          return { ...item, variant };
        });
        return {
          ...o,
          user: rawCustomers.find((c) => c.id === o.user_id) ?? o.user,
          items,
        };
      }),
    [rawOrders, orderItems, productVariants, rawCustomers],
  );

  const refreshData = useCallback(async () => {
    const promises = [];
    if (categoriesLoaded) promises.push(fetchCategories(true));
    if (brandsLoaded) promises.push(fetchBrands(true));
    if (customersLoaded) promises.push(fetchCustomers(true));
    if (ordersLoaded) promises.push(fetchOrders(true));
    if (couponsLoaded) promises.push(fetchCoupons(true));
    if (productsLoaded) promises.push(fetchProducts(true));
    if (imagesLoaded) promises.push(fetchProductImages(true));
    if (stockLoaded) promises.push(fetchStockMovements(true));
    if (returnsLoaded) promises.push(fetchReturnRequests(true));
    await Promise.allSettled(promises);
  }, [
    categoriesLoaded, fetchCategories,
    brandsLoaded, fetchBrands,
    customersLoaded, fetchCustomers,
    ordersLoaded, fetchOrders,
    couponsLoaded, fetchCoupons,
    productsLoaded, fetchProducts,
    imagesLoaded, fetchProductImages,
    stockLoaded, fetchStockMovements,
    returnsLoaded, fetchReturnRequests
  ]);

  const addProduct = async (data: Omit<Product, "id" | "created_at" | "updated_at" | "slug"> & { slug?: string }) => {
    const created = await productService.create(data);
    await fetchProducts(true);
    return created.id;
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    if (updates.status) {
      await productService.updateStatus(id, updates.status);
    }
    const { status, ...rest } = updates;
    if (Object.keys(rest).length > 0) {
      await productService.update(id, rest);
    }
    await fetchProducts(true);
  };

  const deleteProduct = async (id: number) => {
    await productService.remove(id);
    await fetchProducts(true);
  };

  const addCategory = async (data: Omit<Category, "id" | "created_at">) => {
    await categoryService.create(data);
    await fetchCategories(true);
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    await categoryService.update(id, updates);
    await fetchCategories(true);
  };

  const deleteCategory = async (id: number) => {
    await categoryService.remove(id);
    await fetchCategories(true);
  };

  const addBrand = async (data: Omit<Brand, "id" | "created_at"> & { logo_file?: File }) => {
    await brandService.create(data);
    await fetchBrands(true);
  };

  const updateBrand = async (id: number, updates: Partial<Brand> & { logo_file?: File }) => {
    await brandService.update(id, updates);
    await fetchBrands(true);
  };

  const deleteBrand = async (id: number) => {
    await brandService.remove(id);
    await fetchBrands(true);
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    await customerService.updateStatus(id, updates.is_active ?? true);
    await fetchCustomers(true);
  };

  const deleteCustomer = async (id: number) => {
    await customerService.remove(id);
    await fetchCustomers(true);
  };

  const addOrder = async (_data: Omit<Order, "id" | "created_at" | "updated_at">): Promise<void> => {
    await fetchOrders(true);
  };

  const updateOrder = async (id: number, updates: Partial<Order>) => {
    if (updates.order_status === "cancelled" && (updates as any).cancel_reason) {
      await orderService.cancelOrder(id, (updates as any).cancel_reason);
    } else if (updates.order_status) {
      await orderService.updateStatus(id, updates.order_status);
    }
    await fetchOrders(true);
  };

  const deleteOrder = async (id: number) => {
    await orderService.remove(id);
    await fetchOrders(true);
  };

  const addCoupon = async (data: Omit<Coupon, "id" | "created_at">) => {
    await couponService.create(data);
    await fetchCoupons(true);
  };

  const updateCoupon = async (id: number, updates: Partial<Coupon>) => {
    await couponService.update(id, updates);
    await fetchCoupons(true);
  };

  const deleteCoupon = async (id: number) => {
    await couponService.remove(id);
    await fetchCoupons(true);
  };

  const addProductVariant = async (
    data: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File },
  ) => {
    await productService.createVariant(data.product_id, data);
    await fetchProducts(true);
  };

  const updateProductVariant = async (id: number, updates: Partial<ProductVariant> & { variant_image_file?: File }) => {
    await productService.updateVariant(id, updates);
    await fetchProducts(true);
  };

  const deleteProductVariant = async (id: number) => {
    await productService.removeVariant(id);
    await fetchProducts(true);
  };

  const addProductImage = async (data: Omit<ProductImage, "id"> & { image_file?: File }) => {
    if (data.image_file) {
      await productService.uploadImages(data.product_id, [data.image_file!]);
      await fetchProductImages(true);
    }
  };

  const updateProductImage = async (id: number, updates: Partial<ProductImage>) => {
    await productService.updateImage(id, updates);
    await fetchProductImages(true);
  };

  const deleteProductImage = async (id: number) => {
    await productService.removeImage(id);
    await fetchProductImages(true);
  };

  const setPrimaryProductImage = async (id: number) => {
    await productService.setPrimaryImage(id);
    await fetchProductImages(true);
  };

  const addStockMovement = async (data: Omit<StockMovement, "id" | "created_at">) => {
    await productService.createStockMovement(data);
    await fetchStockMovements(true);
  };

  const updateStockMovement = async (id: number, updates: Partial<StockMovement>) => {
    await productService.updateStockMovement(id, updates);
    await fetchStockMovements(true);
  };

  const deleteStockMovement = async (id: number) => {
    await productService.removeStockMovement(id);
    await fetchStockMovements(true);
  };

  const updateReturnRequest = async (id: number, updates: ReturnRequestUpdate) => {
    await returnService.update(id, updates);
    await fetchReturnRequests(true);
  };

  const value: DataContextType = {
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
    productFetchError,
    brandFetchError,
    refreshData,
    fetchCategories,
    fetchBrands,
    fetchCustomers,
    fetchOrders,
    fetchCoupons,
    fetchProducts,
    fetchProductImages,
    fetchStockMovements,
    fetchReturnRequests,
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
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant,
    addProductImage,
    updateProductImage,
    deleteProductImage,
    setPrimaryProductImage,
    addStockMovement,
    updateStockMovement,
    deleteStockMovement,
    updateReturnRequest,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
