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

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled([
      productService.getAll(),
      categoryService.getAll(),
      brandService.getAll(),
      customerService.getAll(),
      orderService.getAll(),
      orderService.getItems(),
      couponService.getAll(),
      productService.getImages(),
      productService.getStockMovements(),
      returnService.getAll(),
    ]);

    const [
      productsRes,
      categoriesRes,
      brandsRes,
      customersRes,
      ordersRes,
      itemsRes,
      couponsRes,
      imagesRes,
      stockRes,
      returnsRes,
    ] = results;

    let loadedVariants: ProductVariant[] = [];

    if (productsRes.status === "fulfilled") {
      const loadedProducts = productsRes.value;
      setRawProducts(loadedProducts);
      setProductFetchError(null);

      const variantResults = await Promise.allSettled(
        loadedProducts.map((p) => productService.getVariantsByProduct(p.id)),
      );
      const allVariants = variantResults
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => (r as PromiseFulfilledResult<ProductVariant[]>).value)
        .map((variant) => ({
          ...variant,
          product: loadedProducts.find((product) => product.id === variant.product_id),
        }));
      loadedVariants = allVariants;
      setProductVariants(loadedVariants);
    } else {
      setProductFetchError(productsRes.reason?.message ?? "Không thể tải sản phẩm");
    }

    if (categoriesRes.status === "fulfilled") setCategories(categoriesRes.value);
    if (brandsRes.status === "fulfilled") {
      setBrands(brandsRes.value);
      setBrandFetchError(null);
    } else {
      setBrandFetchError(brandsRes.reason?.message ?? "Không thể tải thương hiệu");
    }
    if (customersRes.status === "fulfilled") setRawCustomers(customersRes.value);
    if (ordersRes.status === "fulfilled") setRawOrders(ordersRes.value);
    if (itemsRes.status === "fulfilled") setOrderItems(itemsRes.value);
    if (ordersRes.status === "fulfilled" && itemsRes.status !== "fulfilled") {
      try {
        const detailResults = await Promise.allSettled(
          ordersRes.value.map((o: Order) => orderService.getDetail(o.id)),
        );
        const enrichedOrders = ordersRes.value.map((o: Order, idx: number) => {
          const dr = detailResults[idx] as PromiseSettledResult<any>;
          if (dr && dr.status === "fulfilled" && dr.value) {
            const detail = dr.value;
            const itemsFromDetail = (detail as any).items ?? (detail as any).order_items ?? [];
            return { ...o, ...(itemsFromDetail.length ? { items: itemsFromDetail } : {}) };
          }
          return o;
        });
        setRawOrders(enrichedOrders);
      } catch (e) {
      }
    }
    if (couponsRes.status === "fulfilled") setCoupons(couponsRes.value);
    if (imagesRes.status === "fulfilled") setProductImages(imagesRes.value);
    if (stockRes.status === "fulfilled") setStockMovements(stockRes.value);
    if (returnsRes.status === "fulfilled") {
      setReturnRequests(
        normalizeReturnRequests(
          returnsRes.value,
          itemsRes.status === "fulfilled" ? itemsRes.value : [],
          loadedVariants,
        ),
      );
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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

  async function withRefresh<T>(fn: () => Promise<T>): Promise<T> {
    const result = await fn();
    await fetchAll();
    return result;
  }

  const addProduct = async (data: Omit<Product, "id" | "created_at" | "updated_at" | "slug"> & { slug?: string }) => {
    const created = await withRefresh(() => productService.create(data));
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
    await fetchAll();
  };


  const deleteProduct = (id: number) => withRefresh(() => productService.remove(id));

  const addCategory = (data: Omit<Category, "id" | "created_at">) =>
    withRefresh(() => categoryService.create(data).then(() => undefined));

  const updateCategory = (id: number, updates: Partial<Category>) =>
    withRefresh(() => categoryService.update(id, updates));

  const deleteCategory = (id: number) => withRefresh(() => categoryService.remove(id));

  const addBrand = (data: Omit<Brand, "id" | "created_at"> & { logo_file?: File }) =>
    withRefresh(() => brandService.create(data));

  const updateBrand = (id: number, updates: Partial<Brand> & { logo_file?: File }) =>
    withRefresh(() => brandService.update(id, updates));

  const deleteBrand = (id: number) => withRefresh(() => brandService.remove(id));

  const updateCustomer = (id: number, updates: Partial<Customer>) =>
    withRefresh(() => customerService.updateStatus(id, updates.is_active ?? true));

  const deleteCustomer = (id: number) => withRefresh(() => customerService.remove(id));

  const addOrder = async (_data: Omit<Order, "id" | "created_at" | "updated_at">): Promise<void> => {
    await fetchAll();
  };

  const updateOrder = async (id: number, updates: Partial<Order>) => {
    if (updates.order_status === "cancelled" && (updates as any).cancel_reason) {
      await orderService.cancelOrder(id, (updates as any).cancel_reason);
    } else if (updates.order_status) {
      await orderService.updateStatus(id, updates.order_status);
    }
    await fetchAll();
  };

  const deleteOrder = (id: number) => withRefresh(() => orderService.remove(id));

  const addCoupon = (data: Omit<Coupon, "id" | "created_at">) =>
    withRefresh(() => couponService.create(data).then(() => undefined));

  const updateCoupon = (id: number, updates: Partial<Coupon>) =>
    withRefresh(() => couponService.update(id, updates));

  const deleteCoupon = (id: number) => withRefresh(() => couponService.remove(id));

  const addProductVariant = (
    data: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File },
  ) => withRefresh(() => productService.createVariant(data.product_id, data));

  const updateProductVariant = (id: number, updates: Partial<ProductVariant> & { variant_image_file?: File }) =>
    withRefresh(() => productService.updateVariant(id, updates));

  const deleteProductVariant = (id: number) =>
    withRefresh(() => productService.removeVariant(id));

  const addProductImage = async (data: Omit<ProductImage, "id"> & { image_file?: File }) => {
    if (data.image_file) {
      await withRefresh(() =>
        productService.uploadImages(data.product_id, [data.image_file!]),
      );
    }
  };

  const updateProductImage = (id: number, updates: Partial<ProductImage>) =>
    withRefresh(() => productService.updateImage(id, updates));

  const deleteProductImage = (id: number) => withRefresh(() => productService.removeImage(id));

  const setPrimaryProductImage = (id: number) =>
    withRefresh(() => productService.setPrimaryImage(id));

  const addStockMovement = (data: Omit<StockMovement, "id" | "created_at">) =>
    withRefresh(() => productService.createStockMovement(data));

  const updateStockMovement = (id: number, updates: Partial<StockMovement>) =>
    withRefresh(() => productService.updateStockMovement(id, updates));

  const deleteStockMovement = (id: number) =>
    withRefresh(() => productService.removeStockMovement(id));

  const updateReturnRequest = (id: number, updates: ReturnRequestUpdate) =>
    withRefresh(() => returnService.update(id, updates));

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
    refreshData: fetchAll,
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
