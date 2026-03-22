import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
import { generateSlug } from "../utils/slugUtils";

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
  systemConfig: SystemConfig;
  productFetchError: string | null;
  brandFetchError: string | null;

  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<number>;
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
    variant: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File }
  ) => Promise<void>;
  updateProductVariant: (id: number, updates: Partial<ProductVariant>) => Promise<void>;
  deleteProductVariant: (id: number) => Promise<void>;

  addProductImage: (image: Omit<ProductImage, "id"> & { image_file?: File }) => Promise<void>;
  updateProductImage: (id: number, updates: Partial<ProductImage>) => Promise<void>;
  deleteProductImage: (id: number) => Promise<void>;
  setPrimaryProductImage: (id: number) => Promise<void>;

  addStockMovement: (movement: Omit<StockMovement, "id" | "created_at">) => Promise<void>;
  updateStockMovement: (id: number, updates: Partial<StockMovement>) => Promise<void>;
  deleteStockMovement: (id: number) => Promise<void>;
  updateReturnRequest: (id: number, updates: Partial<ReturnRequest>) => Promise<void>;

  updateSystemConfig: (updates: Partial<SystemConfig>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3000";
const REQUEST_TIMEOUT_MS = 8000;
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token";
const PRODUCTS_CACHE_KEY = "data_cache_products";
const BRANDS_CACHE_KEY = "data_cache_brands";
const CATEGORIES_CACHE_KEY = "data_cache_categories";

const RESOURCE_PATHS: Record<string, string[]> = {
  products: ["/api/admin/products", "/api/products", "/__webadmin/db/products"],
  productsWrite: ["/api/admin/products"],
  categories: ["/__webadmin/db/categories", "/api/admin/categories", "/api/categories", "/categories"],
  brands: ["/__webadmin/db/brands", "/api/brands"],
  brandsWrite: ["/api/admin/brands"],
  customers: ["/api/admin/users", "/customers", "/users?role=customer"],
  customersWrite: ["/api/admin/users", "/customers", "/users"],
  orders: ["/api/admin/orders", "/orders"],
  orderItems: ["/api/admin/order-items", "/order-items", "/orderItems", "/order_items"],
  coupons: ["/api/admin/coupons", "/coupons", "/__webadmin/db/coupons"],
  couponsWrite: ["/api/admin/coupons"],
  productVariants: ["/__webadmin/db/product-variants", "/api/admin/variants", "/product-variants", "/productVariants", "/product_variants"],
  productVariantsWrite: ["/api/admin/variants", "/product-variants", "/productVariants", "/product_variants"],
  productImages: ["/api/admin/product-images", "/product-images", "/productImages", "/product_images", "/__webadmin/db/product-images"],
  stockMovements: ["/api/admin/stock/logs", "/stock-movements", "/stockMovements", "/stock_movements"],
  returnRequests: ["/api/admin/returns", "/return-requests", "/returnRequests", "/return_requests"],
  systemConfig: ["/api/admin/system-config", "/system-config", "/systemConfig", "/system_config"],
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  items?: T;
  result?: T;
  payload?: T;
};

type FetchResult<T> = {
  ok: boolean;
  data: T;
  error: string | null;
};

function normalizePayload<T>(payload: unknown, fallback: T): T {
  if (payload == null) {
    return fallback;
  }

  if (Array.isArray(fallback)) {
    if (Array.isArray(payload)) {
      return payload as T;
    }

    if (typeof payload === "object") {
      const envelope = payload as ApiEnvelope<unknown>;
      if (Array.isArray(envelope.data)) {
        return envelope.data as T;
      }
      if (Array.isArray(envelope.items)) {
        return envelope.items as T;
      }
      if (Array.isArray(envelope.result)) {
        return envelope.result as T;
      }
      if (Array.isArray(envelope.payload)) {
        return envelope.payload as T;
      }
      if (
        envelope.data &&
        typeof envelope.data === "object" &&
        Array.isArray((envelope.data as Record<string, unknown>).items)
      ) {
        return (envelope.data as Record<string, unknown>).items as T;
      }
    }

    return fallback;
  }

  if (typeof payload === "object") {
    const envelope = payload as ApiEnvelope<unknown>;
    if (envelope.data !== undefined && !Array.isArray(envelope.data)) {
      return envelope.data as T;
    }
    if (envelope.result !== undefined && !Array.isArray(envelope.result)) {
      return envelope.result as T;
    }
    if (envelope.payload !== undefined && !Array.isArray(envelope.payload)) {
      return envelope.payload as T;
    }
  }

  return payload as T;
}

function flattenCategoryTree(input: unknown): Category[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const result: Category[] = [];

  const normalizeDateValue = (value: unknown): string | null => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return null;
      }

      const time = new Date(trimmed).getTime();
      return Number.isNaN(time) ? null : trimmed;
    }

    if (typeof value === "number") {
      const date = new Date(value);
      const time = date.getTime();
      return Number.isNaN(time) ? null : date.toISOString();
    }

    if (value instanceof Date) {
      const time = value.getTime();
      return Number.isNaN(time) ? null : value.toISOString();
    }

    return null;
  };

  const resolveCreatedAt = (record: Record<string, unknown>): string => {
    const candidates = [
      record.created_at,
      record.createdAt,
      record.create_at,
      record.created_date,
      record.createdDate,
    ];

    for (const candidate of candidates) {
      const normalized = normalizeDateValue(candidate);
      if (normalized) {
        return normalized;
      }
    }

    return "";
  };

  const walk = (nodes: unknown[]) => {
    for (const node of nodes) {
      if (!node || typeof node !== "object") {
        continue;
      }

      const current = node as Record<string, unknown>;
      const category: Category = {
        id: Number(current.id),
        name: String(current.name ?? ""),
        slug: String(current.slug ?? ""),
        parent_id:
          current.parent_id === null || current.parent_id === undefined
            ? undefined
            : Number(current.parent_id),
        category_code:
          typeof current.category_code === "string"
            ? current.category_code
            : `CAT${String(current.id ?? "0").padStart(6, "0")}`,
        created_at: resolveCreatedAt(current),
      };

      if (!Number.isNaN(category.id) && category.name) {
        result.push(category);
      }

      if (Array.isArray(current.children)) {
        walk(current.children);
      }
    }
  };

  walk(input);
  return result;
}

function normalizeBrands(input: unknown): Brand[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const current = item as Record<string, unknown>;
      const id = Number(current.id);

      return {
        id,
        name: String(current.name ?? ""),
        logo_url: typeof current.logo_url === "string" ? current.logo_url : undefined,
        brand_code:
          typeof current.brand_code === "string"
            ? current.brand_code
            : `BRD${String(Number.isNaN(id) ? 0 : id).padStart(6, "0")}`,
        created_at:
          typeof current.created_at === "string" && current.created_at.length > 0
            ? current.created_at
            : new Date().toISOString(),
      } as Brand;
    })
    .filter((brand) => !Number.isNaN(brand.id) && !!brand.name);
}

function normalizeProductStatus(status: unknown): Product["status"] {
  if (status === "discontinued") {
    return "discontinued";
  }

  return "active";
}

function toApiProductStatus(status: unknown): string | undefined {
  if (status === "discontinued") {
    return "discontinued";
  }

  if (status === "out_of_stock") {
    return "out_of_stock";
  }

  if (status === "available") {
    return "available";
  }

  if (status === "active") {
    return "available";
  }

  return undefined;
}

function normalizeProducts(input: unknown): Product[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const current = item as Record<string, unknown>;
      const id = Number(current.id);
      const categoryObj =
        current.category && typeof current.category === "object"
          ? (current.category as Record<string, unknown>)
          : undefined;
      const brandObj =
        current.brand && typeof current.brand === "object"
          ? (current.brand as Record<string, unknown>)
          : undefined;

      const categoryId = Number(
        current.category_id ?? (categoryObj ? categoryObj.id : undefined),
      );
      const brandId = Number(current.brand_id ?? (brandObj ? brandObj.id : undefined));
      const nestedVariants = Array.isArray(current.variants)
        ? normalizeVariants(
            current.variants.map((variant) => {
              if (!variant || typeof variant !== "object") {
                return variant;
              }

              const rawVariant = variant as Record<string, unknown>;
              if (rawVariant.product_id === undefined && rawVariant.productId === undefined) {
                return {
                  ...rawVariant,
                  product_id: id,
                };
              }

              return rawVariant;
            })
          )
        : undefined;
      const rawSpecifications =
        current.specifications && typeof current.specifications === "object"
          ? (current.specifications as Record<string, unknown>)
          : undefined;
      const descriptionCandidates = [
        current.description,
        current.product_description,
        current.productDescription,
        current.short_description,
        current.shortDescription,
        current.desc,
        current.product_desc,
        current.content,
        current.details,
        current.summary,
        rawSpecifications?.description,
        rawSpecifications?.product_description,
        rawSpecifications?.short_description,
      ];
      const normalizedDescription = descriptionCandidates.find(
        (value) => typeof value === "string" && value.trim().length > 0,
      ) as string | undefined;

      return {
        id,
        sku: typeof current.sku === "string" ? current.sku : undefined,
        name: String(current.name ?? ""),
        slug: String(current.slug ?? generateSlug(String(current.name ?? "product"))),
        description: normalizedDescription,
        category_id: Number.isNaN(categoryId) ? 0 : categoryId,
        brand_id: Number.isNaN(brandId) ? 0 : brandId,
        specifications: current.specifications,
        status: normalizeProductStatus(current.status),
        product_code:
          typeof current.product_code === "string"
            ? current.product_code
            : typeof current.sku === "string"
              ? current.sku
              : `SP${String(Number.isNaN(id) ? 0 : id).padStart(6, "0")}`,
        created_at:
          typeof current.created_at === "string" && current.created_at.length > 0
            ? current.created_at
            : new Date().toISOString(),
        updated_at:
          typeof current.updated_at === "string" && current.updated_at.length > 0
            ? current.updated_at
            : undefined,
        variants: nestedVariants,
      } as Product;
    })
    .filter((product) => !Number.isNaN(product.id) && !!product.name && product.category_id > 0 && product.brand_id > 0);
}

function normalizeCoupons(input: unknown): Coupon[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const current = item as Record<string, unknown>;
      const id = Number(current.id);
      const discountType = current.discount_type === "fixed" ? "fixed" : "percent";
      const discountValue = Number(current.discount_value);
      const minOrderValue =
        current.min_order_value === null || current.min_order_value === undefined
          ? undefined
          : Number(current.min_order_value);
      const maxUses =
        current.max_uses === null || current.max_uses === undefined
          ? undefined
          : Number(current.max_uses);
      const usedCount = Number(current.used_count ?? 0);

      return {
        id,
        code: String(current.code ?? ""),
        discount_type: discountType,
        discount_value: Number.isNaN(discountValue) ? 0 : discountValue,
        min_order_value: minOrderValue !== undefined && !Number.isNaN(minOrderValue) ? minOrderValue : undefined,
        max_uses: maxUses !== undefined && !Number.isNaN(maxUses) ? maxUses : undefined,
        used_count: Number.isNaN(usedCount) ? 0 : usedCount,
        expires_at:
          typeof current.expires_at === "string" && current.expires_at.length > 0
            ? current.expires_at
            : undefined,
        is_active: current.is_active === true || String(current.is_active) === "true",
        created_at:
          typeof current.created_at === "string" && current.created_at.length > 0
            ? current.created_at
            : new Date().toISOString(),
      } as Coupon;
    })
    .filter((coupon) => !Number.isNaN(coupon.id) && !!coupon.code);
}

function normalizeVariants(input: unknown): ProductVariant[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const current = item as Record<string, unknown>;
      const id = Number(current.id);
      const nestedProduct =
        current.product && typeof current.product === "object"
          ? (current.product as Record<string, unknown>)
          : undefined;
      const productId = Number(
        current.product_id ?? current.productId ?? (nestedProduct ? nestedProduct.id : undefined),
      );
      const price = Number(current.price);
      const compareAt =
        current.compare_at_price === null || current.compare_at_price === undefined
          ? undefined
          : Number(current.compare_at_price);
      const stock = Number(current.stock);

      return {
        id,
        product_id: productId,
        sku: String(current.sku ?? ""),
        version: typeof current.version === "string" ? current.version : undefined,
        color: typeof current.color === "string" ? current.color : undefined,
        color_hex: typeof current.color_hex === "string" ? current.color_hex : undefined,
        price: Number.isNaN(price) ? 0 : price,
        compare_at_price: compareAt !== undefined && !Number.isNaN(compareAt) ? compareAt : undefined,
        stock: Number.isNaN(stock) ? 0 : stock,
        is_active: current.is_active === true || String(current.is_active) === "true",
        created_at:
          typeof current.created_at === "string" && current.created_at.length > 0
            ? current.created_at
            : new Date().toISOString(),
        updated_at:
          typeof current.updated_at === "string" && current.updated_at.length > 0
            ? current.updated_at
            : undefined,
      } as ProductVariant;
    })
    .filter((variant) => !Number.isNaN(variant.id) && !Number.isNaN(variant.product_id) && !!variant.sku);
}

function normalizeProductImages(input: unknown): ProductImage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const current = item as Record<string, unknown>;
      const id = Number(current.id);
      const productId = Number(current.product_id);
      const variantId =
        current.variant_id === null || current.variant_id === undefined
          ? undefined
          : Number(current.variant_id);
      const sortOrder = Number(current.sort_order ?? 0);

      return {
        id,
        product_id: productId,
        variant_id: variantId,
        image_url: String(current.image_url ?? ""),
        is_primary: current.is_primary === true || String(current.is_primary) === "true",
        sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
      } as ProductImage;
    })
    .filter((img) => !Number.isNaN(img.id) && !Number.isNaN(img.product_id) && !!img.image_url);
}

function getAuthHeaders(headers?: HeadersInit): HeadersInit {
  const rawToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const token = rawToken?.trim();
  if (!token || token === "undefined" || token === "null") {
    if (rawToken) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
    return headers ?? {};
  }

  return {
    ...(headers ?? {}),
    Authorization: `Bearer ${token}`,
  };
}

async function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      cache: "no-store",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        ...getAuthHeaders(init?.headers),
      },
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function buildRequestUrl(path: string): string {
  if (path.startsWith('/__webadmin/')) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

async function fetchFirstAvailable<T>(paths: string[], fallback: T): Promise<T> {
  const result = await fetchFirstAvailableDetailed(paths, fallback);
  return result.data;
}

async function fetchFirstAvailableDetailed<T>(paths: string[], fallback: T): Promise<FetchResult<T>> {
  let bestError: string | null = null;

  for (const path of paths) {
    try {
      const response = await fetchWithTimeout(buildRequestUrl(path));
      if (!response.ok) {
        try {
          const payload = (await response.json()) as Record<string, unknown>;
          const message = typeof payload?.message === "string" ? payload.message : null;
          const currentError = message || `HTTP ${response.status}`;

          if (typeof message === "string" && message.toLowerCase().includes("cloud_name")) {
            return {
              ok: false,
              data: fallback,
              error: message,
            };
          }

          if (!bestError || bestError === `HTTP 404`) {
            bestError = currentError;
          }
        } catch {
          const currentError = `HTTP ${response.status}`;
          if (!bestError || bestError === `HTTP 404`) {
            bestError = currentError;
          }
        }
        continue;
      }
      const data = await response.json();
      return {
        ok: true,
        data: normalizePayload<T>(data, fallback),
        error: null,
      };
    } catch {
      bestError = "Không thể kết nối backend";
      continue;
    }
  }

  return {
    ok: false,
    data: fallback,
    error: bestError,
  };
}

async function requestFirstAvailable(
  paths: string[],
  init: RequestInit,
  id?: number | string,
): Promise<boolean> {
  for (const path of paths) {
    const targetPath = id === undefined ? path : `${path}/${id}`;
    try {
      const response = await fetchWithTimeout(buildRequestUrl(targetPath), {
        ...init,
        headers: getAuthHeaders(init.headers),
      });
      if (response.ok) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

async function createRecord(paths: string[], payload: unknown): Promise<boolean> {
  return requestFirstAvailable(paths, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function createRecordWithResponse<T>(paths: string[], payload: unknown): Promise<FetchResult<T | null>> {
  let bestError: string | null = null;

  for (const path of paths) {
    try {
      const isFormDataPayload = payload instanceof FormData;
      const response = await fetchWithTimeout(buildRequestUrl(path), {
        method: "POST",
        headers: isFormDataPayload
          ? getAuthHeaders()
          : getAuthHeaders({ "Content-Type": "application/json" }),
        body: isFormDataPayload ? payload : JSON.stringify(payload),
      });

      if (!response.ok) {
        try {
          const data = (await response.json()) as Record<string, unknown>;
          const message = typeof data?.message === "string" ? data.message : null;
          if (response.status === 401 || response.status === 403) {
            return {
              ok: false,
              data: null,
              error: message || "Phiên đăng nhập hết hạn hoặc không đủ quyền",
            };
          }

          const currentError = message || `HTTP ${response.status}`;
          if (!bestError || bestError === "HTTP 404") {
            bestError = currentError;
          }
        } catch {
          if (response.status === 401 || response.status === 403) {
            return {
              ok: false,
              data: null,
              error: "Phiên đăng nhập hết hạn hoặc không đủ quyền",
            };
          }

          const currentError = `HTTP ${response.status}`;
          if (!bestError || bestError === "HTTP 404") {
            bestError = currentError;
          }
        }
        continue;
      }

      try {
        const text = await response.text();
        if (!text) {
          return { ok: true, data: null, error: null };
        }

        const parsed = JSON.parse(text) as unknown;
        return {
          ok: true,
          data: normalizePayload<T | null>(parsed, null),
          error: null,
        };
      } catch {
        return { ok: true, data: null, error: null };
      }
    } catch {
      bestError = "Không thể kết nối backend";
      continue;
    }
  }

  return {
    ok: false,
    data: null,
    error: bestError,
  };
}

async function createBrandRecord(
  paths: string[],
  payload: Omit<Brand, "id" | "created_at"> & { logo_file?: File },
): Promise<boolean> {
  if (!payload.logo_file) {
    throw new Error("Vui lòng chọn logo thương hiệu");
  }

  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("logo", payload.logo_file);

  const result = await createRecordWithResponse<Brand>(paths, formData);
  if (!result.ok) {
    throw new Error(result.error || "Không thể lưu thương hiệu lên backend");
  }

  return true;
}

async function updateBrandRecord(
  path: string,
  id: number,
  payload: Partial<Brand> & { logo_file?: File },
): Promise<boolean> {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.logo_file) {
    formData.append("logo", payload.logo_file);
  }

  const response = await fetchWithTimeout(buildRequestUrl(`${path}/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = (await response.json()) as Record<string, unknown>;
      if (typeof data.message === "string" && data.message.length > 0) {
        message = data.message;
      }
    } catch {
    }
    throw new Error(message);
  }

  return true;
}

async function createProductVariantForProduct(
  productId: number,
  payload: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File },
): Promise<boolean> {
  if (!payload.variant_image_file) {
    throw new Error("Backend hiện không hỗ trợ tạo biến thể mới khi thiếu ảnh");
  }

  const formData = new FormData();
  formData.append("sku", payload.sku);
  formData.append("price", String(payload.price));
  formData.append("stock", String(payload.stock));
  formData.append("variant_image", payload.variant_image_file);

  if (payload.version) {
    formData.append("version", payload.version);
  }
  if (payload.color) {
    formData.append("color", payload.color);
  }
  if (payload.color_hex) {
    formData.append("color_hex", payload.color_hex);
  }
  if (payload.compare_at_price !== undefined) {
    formData.append("compare_at_price", String(payload.compare_at_price));
  }
  if (payload.is_active !== undefined) {
    formData.append("is_active", String(payload.is_active));
  }

  const response = await fetchWithTimeout(buildRequestUrl(`/api/admin/products/${productId}/variants`), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = (await response.json()) as Record<string, unknown>;
      if (typeof data.message === "string" && data.message.length > 0) {
        message = data.message;
      }
    } catch {
    }
    throw new Error(message);
  }

  return true;
}

async function uploadProductImageFile(
  productId: number,
  file: File,
  options?: { is_primary?: boolean; sort_order?: number },
): Promise<FetchResult<null>> {
  const endpointConfigs = [
    { path: `/api/admin/products/${productId}/images`, includeProductId: false },
    { path: `/admin/products/${productId}/images`, includeProductId: false },
    { path: "/api/admin/product-images", includeProductId: true },
    { path: "/admin/product-images", includeProductId: true },
  ];
  const fileFields = ["avatar", "image", "file", "images", "product_image", "productImage"];
  let bestError: string | null = null;

  for (const endpointConfig of endpointConfigs) {
    for (const fileField of fileFields) {
      try {
        const formData = new FormData();
        formData.append(fileField, file);
        if (endpointConfig.includeProductId) {
          formData.append("product_id", String(productId));
        }
        if (typeof options?.is_primary === "boolean") {
          formData.append("is_primary", String(options.is_primary));
        }
        if (typeof options?.sort_order === "number") {
          formData.append("sort_order", String(options.sort_order));
        }

        const response = await fetchWithTimeout(buildRequestUrl(endpointConfig.path), {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });

        if (response.ok) {
          return { ok: true, data: null, error: null };
        }

        try {
          const payload = (await response.json()) as Record<string, unknown>;
          const message = typeof payload?.message === "string" ? payload.message : null;
          if (message) {
            bestError = message;
          } else if (!bestError) {
            bestError = `HTTP ${response.status}`;
          }
        } catch {
          if (!bestError) {
            bestError = `HTTP ${response.status}`;
          }
        }
      } catch {
        bestError = "Không thể kết nối backend";
      }
    }
  }

  return {
    ok: false,
    data: null,
    error: bestError || "Không thể upload ảnh sản phẩm lên backend",
  };
}

async function markProductImageAsPrimary(id: number): Promise<boolean> {
  const endpoints = [
    `/api/admin/product-images/${id}/primary`,
    `/admin/product-images/${id}/primary`,
  ];

  for (const endpoint of endpoints) {
    for (const method of ["PATCH", "PUT"] as const) {
      try {
        const response = await fetchWithTimeout(buildRequestUrl(endpoint), {
          method,
          headers: getAuthHeaders({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({}),
        });

        if (response.ok) {
          return true;
        }
      } catch {
        continue;
      }
    }
  }

  return false;
}

async function updateRecord(paths: string[], id: number, payload: unknown): Promise<boolean> {
  const patchOk = await requestFirstAvailable(
    paths,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    id,
  );

  if (patchOk) {
    return true;
  }

  return requestFirstAvailable(
    paths,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    id,
  );
}

async function updateRecordWithResponse(
  paths: string[],
  id: number,
  payload: unknown,
): Promise<FetchResult<null>> {
  let bestError: string | null = null;

  for (const method of ["PATCH", "PUT"] as const) {
    for (const path of paths) {
      try {
        const response = await fetchWithTimeout(buildRequestUrl(`${path}/${id}`), {
          method,
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          return { ok: true, data: null, error: null };
        }

        try {
          const data = (await response.json()) as Record<string, unknown>;
          const message = typeof data?.message === "string" ? data.message : null;

          if (response.status === 401 || response.status === 403) {
            return {
              ok: false,
              data: null,
              error: message || "Phiên đăng nhập hết hạn hoặc không đủ quyền",
            };
          }

          const currentError = message || `HTTP ${response.status}`;
          if (!bestError || bestError === "HTTP 404") {
            bestError = currentError;
          }
        } catch {
          if (response.status === 401 || response.status === 403) {
            return {
              ok: false,
              data: null,
              error: "Phiên đăng nhập hết hạn hoặc không đủ quyền",
            };
          }

          const currentError = `HTTP ${response.status}`;
          if (!bestError || bestError === "HTTP 404") {
            bestError = currentError;
          }
        }
      } catch {
        bestError = "Không thể kết nối backend";
      }
    }
  }

  return {
    ok: false,
    data: null,
    error: bestError,
  };
}

async function deleteRecord(paths: string[], id: number): Promise<boolean> {
  return requestFirstAvailable(
    paths,
    {
      method: "DELETE",
    },
    id,
  );
}

async function updateSingleton(paths: string[], payload: unknown): Promise<boolean> {
  const patchOk = await requestFirstAvailable(paths, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (patchOk) {
    return true;
  }

  const putOk = await requestFirstAvailable(paths, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (putOk) {
    return true;
  }

  return requestFirstAvailable(paths, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function fetchVariantsByProductIds(productIds: number[]): Promise<ProductVariant[]> {
  if (productIds.length === 0) {
    return [];
  }

  const variantBatches = await Promise.all(
    productIds.map(async (productId) => {
      try {
        const response = await fetchWithTimeout(buildRequestUrl(`/api/admin/products/${productId}/variants`));
        if (!response.ok) {
          return [] as ProductVariant[];
        }

        const data = (await response.json()) as unknown;
        const normalized = normalizePayload<unknown[]>(data, []);
        const enriched = normalized.map((item) => {
          if (!item || typeof item !== "object") {
            return item;
          }

          const current = item as Record<string, unknown>;
          if (current.product_id === undefined && current.productId === undefined) {
            return { ...current, product_id: productId };
          }

          return current;
        });

        return normalizeVariants(enriched);
      } catch {
        return [] as ProductVariant[];
      }
    })
  );

  const merged = variantBatches.flat();
  const uniqueById = new Map<number, ProductVariant>();
  for (const variant of merged) {
    uniqueById.set(variant.id, variant);
  }

  return Array.from(uniqueById.values());
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [baseProducts, setBaseProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [baseCustomers, setBaseCustomers] = useState<Customer[]>([]);
  const [baseOrders, setBaseOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [productFetchError, setProductFetchError] = useState<string | null>(null);
  const [brandFetchError, setBrandFetchError] = useState<string | null>(null);
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

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const syncingRef = useRef(false);

  useEffect(() => {
    try {
      const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);
      if (cachedProducts) {
        const parsed = JSON.parse(cachedProducts) as unknown;
        setBaseProducts(normalizeProducts(parsed));
      }

      const cachedBrands = localStorage.getItem(BRANDS_CACHE_KEY);
      if (cachedBrands) {
        const parsed = JSON.parse(cachedBrands) as unknown;
        setBrands(normalizeBrands(parsed));
      }

      const cachedCategories = localStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cachedCategories) {
        const parsed = JSON.parse(cachedCategories) as unknown;
        setCategories(flattenCategoryTree(parsed));
      }
    } catch {
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
      localStorage.removeItem(BRANDS_CACHE_KEY);
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
    }
  }, []);

  const loadBackendData = useCallback(async () => {
    if (syncingRef.current) {
      return;
    }

    syncingRef.current = true;

    try {
      const [
        productsResult,
        categoriesResult,
        brandsResult,
        customersData,
        ordersData,
        orderItemsData,
        couponsData,
        productVariantsData,
        productImagesData,
        stockMovementsData,
        returnRequestsData,
        systemConfigData,
      ] = await Promise.all([
        fetchFirstAvailableDetailed<Product[]>(RESOURCE_PATHS.products, []),
        fetchFirstAvailableDetailed<Category[]>(RESOURCE_PATHS.categories, []),
        fetchFirstAvailableDetailed<Brand[]>(RESOURCE_PATHS.brands, []),
        fetchFirstAvailable<Customer[]>(RESOURCE_PATHS.customers, []),
        fetchFirstAvailable<Order[]>(RESOURCE_PATHS.orders, []),
        fetchFirstAvailable<OrderItem[]>(RESOURCE_PATHS.orderItems, []),
        fetchFirstAvailable<Coupon[]>(RESOURCE_PATHS.coupons, []),
        fetchFirstAvailable<ProductVariant[]>(RESOURCE_PATHS.productVariants, []),
        fetchFirstAvailable<ProductImage[]>(RESOURCE_PATHS.productImages, []),
        fetchFirstAvailable<StockMovement[]>(RESOURCE_PATHS.stockMovements, []),
        fetchFirstAvailable<ReturnRequest[]>(RESOURCE_PATHS.returnRequests, []),
        fetchFirstAvailable<SystemConfig | null>(RESOURCE_PATHS.systemConfig, null),
      ]);

      let normalizedProducts: Product[] = [];

      if (productsResult.ok) {
        normalizedProducts = normalizeProducts(productsResult.data);

        if (normalizedProducts.length > 0) {
          const publicProductsData = await fetchFirstAvailable<Product[]>(["/api/products", "/__webadmin/db/products"], []);
          const normalizedPublicProducts = normalizeProducts(publicProductsData);

          if (normalizedPublicProducts.length > 0) {
            const publicById = new Map<number, Product>();
            const publicBySlug = new Map<string, Product>();
            const publicByName = new Map<string, Product>();

            for (const publicProduct of normalizedPublicProducts) {
              publicById.set(publicProduct.id, publicProduct);
              if (publicProduct.slug) {
                publicBySlug.set(publicProduct.slug.trim().toLowerCase(), publicProduct);
              }
              if (publicProduct.name) {
                publicByName.set(publicProduct.name.trim().toLowerCase(), publicProduct);
              }
            }

            normalizedProducts = normalizedProducts.map((product) => {
              if (typeof product.description === "string" && product.description.trim().length > 0) {
                return product;
              }

              const byId = publicById.get(product.id);
              const bySlug = product.slug ? publicBySlug.get(product.slug.trim().toLowerCase()) : undefined;
              const byName = product.name ? publicByName.get(product.name.trim().toLowerCase()) : undefined;
              const matched = byId || bySlug || byName;

              if (!matched || !matched.description || matched.description.trim().length === 0) {
                return product;
              }

              return {
                ...product,
                description: matched.description,
              };
            });
          }
        }

        setBaseProducts(normalizedProducts);
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(normalizedProducts));
        setProductFetchError(null);
      } else {
        setProductFetchError(productsResult.error);
      }

      if (categoriesResult.ok) {
        const normalizedCategories = flattenCategoryTree(categoriesResult.data);
        setCategories(normalizedCategories);
        localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(normalizedCategories));
      }

      if (brandsResult.ok) {
        const normalizedBrands = normalizeBrands(brandsResult.data);
        setBrands(normalizedBrands);
        localStorage.setItem(BRANDS_CACHE_KEY, JSON.stringify(normalizedBrands));
        setBrandFetchError(null);
      } else {
        setBrandFetchError(brandsResult.error);
      }

      setBaseCustomers(customersData);
      setBaseOrders(ordersData);
      setOrderItems(orderItemsData);
      setCoupons(normalizeCoupons(couponsData));

      let mergedVariants = normalizeVariants(productVariantsData);
      if (normalizedProducts.length > 0) {
        const existingProductIds = new Set(mergedVariants.map((variant) => variant.product_id));
        const missingProductIds = normalizedProducts
          .map((product) => product.id)
          .filter((productId) => !existingProductIds.has(productId));

        if (missingProductIds.length > 0) {
          const fallbackVariants = await fetchVariantsByProductIds(missingProductIds);
          if (fallbackVariants.length > 0) {
            const uniqueById = new Map<number, ProductVariant>();
            for (const variant of mergedVariants) {
              uniqueById.set(variant.id, variant);
            }
            for (const variant of fallbackVariants) {
              uniqueById.set(variant.id, variant);
            }
            mergedVariants = Array.from(uniqueById.values());
          }
        }
      }

      setProductVariants(mergedVariants);
      setProductImages(normalizeProductImages(productImagesData));
      setStockMovements(stockMovementsData);
      setReturnRequests(returnRequestsData);

      if (systemConfigData) {
        setSystemConfig(systemConfigData);
      }
    } finally {
      syncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadBackendData();

    const intervalId = window.setInterval(() => {
      void loadBackendData();
    }, 300);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadBackendData]);

  useEffect(() => {
    const syncedProducts = baseProducts.map((product) => {
      const category = categories.find((c) => c.id === product.category_id);
      const brand = brands.find((b) => b.id === product.brand_id);
      const syncedVariants = productVariants
        .filter((v) => v.product_id === product.id)
        .map((v) => ({
          ...v,
          product: baseProducts.find((p) => p.id === v.product_id),
        }));
      const fallbackVariants = (product.variants || []).map((v) => ({
        ...v,
        product: baseProducts.find((p) => p.id === v.product_id),
      }));
      const variants = syncedVariants.length > 0 ? syncedVariants : fallbackVariants;
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

  useEffect(() => {
    const syncedCustomers = baseCustomers.map((customer) => {
      const customerOrders = baseOrders.filter((o) => o.user_id === customer.id);
      const totalOrders = customerOrders.length;
      
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

  useEffect(() => {
    const syncedOrders = baseOrders.map((order) => {
      const user = baseCustomers.find((c) => c.id === order.user_id);
      const sourceItems =
        order.items && order.items.length > 0
          ? order.items
          : orderItems.filter((item) => item.order_id === order.id);
      
      const items = sourceItems.map((item) => {
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
  }, [baseOrders, baseCustomers, baseProducts, productVariants, orderItems]);

  const syncAfterMutation = useCallback(
    async (mutation: () => Promise<boolean>) => {
      const ok = await mutation();
      if (!ok) {
        throw new Error("Không thể cập nhật dữ liệu lên backend");
      }
      await loadBackendData();
    },
    [loadBackendData],
  );

  const addProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    const slug = product.slug || generateSlug(product.name);
    const payload = {
      ...product,
      slug,
      ...(product.status ? { status: toApiProductStatus(product.status) } : {}),
    };

    const payloadCandidates: Array<Record<string, unknown>> = [payload as Record<string, unknown>];
    if (Object.prototype.hasOwnProperty.call(product, "description")) {
      payloadCandidates.push({
        ...payload,
        product_description: product.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        productDescription: product.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        short_description: product.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        shortDescription: product.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        product_desc: product.description,
      } as Record<string, unknown>);
    }

    let createdResult: FetchResult<Product | null> | null = null;
    for (const payloadCandidate of payloadCandidates) {
      createdResult = await createRecordWithResponse<Product>(RESOURCE_PATHS.productsWrite, payloadCandidate);
      if (createdResult.ok) {
        break;
      }
    }

    if (!createdResult || !createdResult.ok) {
      throw new Error(createdResult?.error || "Không thể cập nhật dữ liệu lên backend");
    }

    await loadBackendData();

    const createdFromResponse = createdResult.data
      ? normalizeProducts([createdResult.data]).find((item) => item.slug === slug)
      : undefined;

    if (createdFromResponse) {
      return createdFromResponse.id;
    }

    const refreshedProducts = await fetchFirstAvailable<Product[]>(RESOURCE_PATHS.products, []);
    const normalizedRefreshedProducts = normalizeProducts(refreshedProducts);
    const createdFromList = normalizedRefreshedProducts.find((item) => item.slug === slug);

    if (createdFromList) {
      return createdFromList.id;
    }

    throw new Error("Tạo sản phẩm thành công nhưng không thể lấy ID sản phẩm mới");
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    const payload = {
      ...updates,
      ...(updates.name && !updates.slug ? { slug: generateSlug(updates.name) } : {}),
      ...(updates.status ? { status: toApiProductStatus(updates.status) } : {}),
    };

    const updatePaths = Array.from(new Set([...RESOURCE_PATHS.productsWrite, "/admin/products"]));
    const expectedStatus = updates.status;
    const mappedStatus = updates.status ? toApiProductStatus(updates.status) : undefined;

    const payloadCandidates: Array<Record<string, unknown>> = [payload as Record<string, unknown>];

    if (Object.prototype.hasOwnProperty.call(updates, "description")) {
      payloadCandidates.push({
        ...payload,
        product_description: updates.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        productDescription: updates.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        short_description: updates.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        shortDescription: updates.description,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        product_desc: updates.description,
      } as Record<string, unknown>);
    }

    if (expectedStatus) {
      payloadCandidates.push({
        ...payload,
        status: mappedStatus,
        product_status: mappedStatus,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        status: mappedStatus,
        productStatus: mappedStatus,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        status: expectedStatus,
      } as Record<string, unknown>);
      payloadCandidates.push({
        ...payload,
        is_active: expectedStatus === "active",
      } as Record<string, unknown>);
    }

    let lastError = "Không thể cập nhật dữ liệu lên backend";

    const verifyPersistedStatus = async () => {
      if (!expectedStatus) {
        return true;
      }

      const refreshedProducts = await fetchFirstAvailable<Product[]>(RESOURCE_PATHS.products, []);
      const normalizedProducts = normalizeProducts(refreshedProducts);
      const updatedProduct = normalizedProducts.find((item) => item.id === id);

      return !!updatedProduct && updatedProduct.status === expectedStatus;
    };

    for (const payloadCandidate of payloadCandidates) {
      const updatedResult = await updateRecordWithResponse(updatePaths, id, payloadCandidate);
      if (!updatedResult.ok) {
        if (updatedResult.error) {
          lastError = updatedResult.error;
        }
        continue;
      }

      if (await verifyPersistedStatus()) {
        await loadBackendData();
        return;
      }
    }

    if (expectedStatus) {
      const statusEndpoints = [
        `/api/admin/products/${id}/status`,
        `/admin/products/${id}/status`,
        `/api/products/${id}/status`,
      ];
      const statusPayloads: Array<Record<string, unknown>> = [
        { status: mappedStatus },
        { status: expectedStatus },
        { product_status: mappedStatus },
        { productStatus: mappedStatus },
        { is_active: expectedStatus === "active" },
      ];

      for (const method of ["PATCH", "PUT", "POST"] as const) {
        for (const endpoint of statusEndpoints) {
          for (const statusPayload of statusPayloads) {
            try {
              const response = await fetchWithTimeout(buildRequestUrl(endpoint), {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(statusPayload),
              });

              if (!response.ok) {
                const payloadData = (await response.json().catch(() => null)) as Record<string, unknown> | null;
                const message = payloadData && typeof payloadData.message === "string" ? payloadData.message : null;
                if (message) {
                  lastError = message;
                } else {
                  lastError = `HTTP ${response.status}`;
                }
                continue;
              }

              if (await verifyPersistedStatus()) {
                await loadBackendData();
                return;
              }
            } catch {
              lastError = "Không thể kết nối backend";
            }
          }
        }
      }
    }

    throw new Error(lastError);
  };

  const deleteProduct = async (id: number) => {
    try {
      let lastError = "Không thể xóa sản phẩm";

      const relatedVariants = productVariants.filter((v) => v.product_id === id);
      for (const variant of relatedVariants) {
        try {
          await deleteRecord(RESOURCE_PATHS.productVariantsWrite, variant.id);
        } catch {
        }
      }

      const relatedImages = productImages.filter((img) => img.product_id === id);
      for (const image of relatedImages) {
        try {
          await deleteRecord(RESOURCE_PATHS.productImages, image.id);
        } catch {
        }
      }

      const deleted = await deleteRecord(
        Array.from(new Set([
          ...RESOURCE_PATHS.productsWrite,
          "/admin/products",
        ])),
        id
      );

      if (deleted) {
        await loadBackendData();
        return;
      }

      const softDeleteStatusEndpoints = [
        `/api/admin/products/${id}/status`,
        `/admin/products/${id}/status`,
      ];
      const softDeleteStatusPayloads = [
        { status: "discontinued" },
        { status: "inactive" },
        { is_active: false },
      ];

      for (const endpoint of softDeleteStatusEndpoints) {
        for (const payload of softDeleteStatusPayloads) {
          for (const method of ["PATCH", "PUT", "POST"] as const) {
            try {
              const response = await fetchWithTimeout(buildRequestUrl(endpoint), {
                method,
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify(payload),
              });

              if (response.ok) {
                await loadBackendData();
                return;
              }

              try {
                const payloadData = (await response.json()) as Record<string, unknown>;
                const message = typeof payloadData?.message === "string" ? payloadData.message : null;
                if (message) {
                  lastError = message;
                } else {
                  lastError = `HTTP ${response.status}`;
                }
              } catch {
                lastError = `HTTP ${response.status}`;
              }
            } catch {
              lastError = "Không thể kết nối backend";
            }
          }
        }
      }

      const softDeletePaths = Array.from(new Set([
        ...RESOURCE_PATHS.productsWrite,
        "/admin/products",
      ]));

      const softDeletePayloads = [
        { status: "discontinued" },
        { status: "inactive" },
        { is_active: false },
      ];

      for (const path of softDeletePaths) {
        for (const payload of softDeletePayloads) {
          for (const method of ["PATCH", "PUT"] as const) {
          try {
            const response = await fetchWithTimeout(buildRequestUrl(`${path}/${id}`), {
              method,
              headers: getAuthHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              await loadBackendData();
              return;
            }

            try {
              const payloadData = (await response.json()) as Record<string, unknown>;
              const message = typeof payloadData?.message === "string" ? payloadData.message : null;
              if (message) {
                lastError = message;
              } else {
                lastError = `HTTP ${response.status}`;
              }
            } catch {
              lastError = `HTTP ${response.status}`;
            }
          } catch {
            lastError = "Không thể kết nối backend";
          }
          }
        }
      }

      throw new Error(lastError);
    } catch (error) {
      try {
        await loadBackendData();
      } catch {
      }
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, "id" | "created_at">) => {
    const payload = {
      ...category,
      slug: category.slug || generateSlug(category.name),
      created_at: new Date().toISOString(),
    };
    await syncAfterMutation(() => createRecord(RESOURCE_PATHS.categories, payload));
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    const payload = {
      ...updates,
      ...(updates.name && !updates.slug ? { slug: generateSlug(updates.name) } : {}),
    };
    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.categories, id, payload));
  };

  const deleteCategory = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.categories, id));
  };

  const addBrand = async (brand: Omit<Brand, "id" | "created_at"> & { logo_file?: File }) => {
    await syncAfterMutation(() => createBrandRecord(RESOURCE_PATHS.brandsWrite, brand));
  };

  const updateBrand = async (id: number, updates: Partial<Brand> & { logo_file?: File }) => {
    await syncAfterMutation(() => updateBrandRecord(RESOURCE_PATHS.brandsWrite[0], id, updates));
  };

  const deleteBrand = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.brandsWrite, id));
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    const payloadCandidates: Array<Record<string, unknown>> = [];

    const hasIsActiveField = Object.prototype.hasOwnProperty.call(updates, "is_active");
    const isActiveValue = updates.is_active;
    const restUpdates = { ...updates } as Partial<Customer>;
    delete restUpdates.is_active;

    if (Object.keys(restUpdates).length > 0) {
      payloadCandidates.push(restUpdates as Record<string, unknown>);
    }

    if (hasIsActiveField && typeof isActiveValue === "boolean") {
      const statusValue = isActiveValue ? "active" : "inactive";
      payloadCandidates.push({ ...restUpdates, is_active: isActiveValue } as Record<string, unknown>);
      payloadCandidates.push({ ...restUpdates, active: isActiveValue } as Record<string, unknown>);
      payloadCandidates.push({ ...restUpdates, isActive: isActiveValue } as Record<string, unknown>);
      payloadCandidates.push({ ...restUpdates, status: statusValue } as Record<string, unknown>);
    }

    if (payloadCandidates.length === 0) {
      return;
    }

    let lastError = "Không thể cập nhật dữ liệu lên backend";

    for (const payload of payloadCandidates) {
      const updatedResult = await updateRecordWithResponse(
        RESOURCE_PATHS.customersWrite,
        id,
        payload,
      );

      if (updatedResult.ok) {
        await loadBackendData();
        return;
      }

      if (updatedResult.error) {
        lastError = updatedResult.error;
      }
    }

    if (hasIsActiveField && typeof isActiveValue === "boolean") {
      const statusEndpoints = [
        `/api/admin/users/${id}/status`,
        `/api/admin/users/${id}/active`,
        `/api/users/${id}/status`,
        `/users/${id}/status`,
        `/customers/${id}/status`,
      ];

      for (const method of ["PATCH", "PUT", "POST"] as const) {
        for (const endpoint of statusEndpoints) {
          for (const payload of payloadCandidates) {
            try {
              const response = await fetchWithTimeout(buildRequestUrl(endpoint), {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              if (response.ok) {
                await loadBackendData();
                return;
              }

              try {
                const data = (await response.json()) as Record<string, unknown>;
                if (typeof data.message === "string" && data.message.length > 0) {
                  lastError = data.message;
                } else {
                  lastError = `HTTP ${response.status}`;
                }
              } catch {
                lastError = `HTTP ${response.status}`;
              }
            } catch {
              lastError = "Không thể kết nối backend";
            }
          }
        }
      }
    }

    throw new Error(lastError);
  };

  const deleteCustomer = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.customersWrite, id));
  };

  const addOrder = async (order: Omit<Order, "id" | "created_at" | "updated_at">) => {
    const payload = {
      ...order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await syncAfterMutation(() => createRecord(RESOURCE_PATHS.orders, payload));
  };

  const updateOrder = async (id: number, updates: Partial<Order>) => {
    const oldOrder = baseOrders.find((o) => o.id === id);
    const payload = {
      ...updates,
      ...(oldOrder && updates.order_status === "delivered" && oldOrder.payment_method === "cod" && oldOrder.payment_status === "unpaid"
        ? { payment_status: "paid" }
        : {}),
      updated_at: new Date().toISOString(),
    };
    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.orders, id, payload));
  };

  const deleteOrder = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.orders, id));
  };

  const addCoupon = async (coupon: Omit<Coupon, "id" | "created_at">) => {
    const payload = {
      ...coupon,
      used_count: coupon.used_count ?? 0,
      created_at: new Date().toISOString(),
    };
    const createdResult = await createRecordWithResponse<Coupon>(RESOURCE_PATHS.couponsWrite, payload);
    if (!createdResult.ok) {
      throw new Error(createdResult.error || "Không thể cập nhật dữ liệu lên backend");
    }

    await loadBackendData();
  };

  const updateCoupon = async (id: number, updates: Partial<Coupon>) => {
    const updatedResult = await updateRecordWithResponse(
      RESOURCE_PATHS.couponsWrite,
      id,
      updates,
    );

    if (!updatedResult.ok) {
      throw new Error(updatedResult.error || "Không thể cập nhật dữ liệu lên backend");
    }

    await loadBackendData();
  };

  const deleteCoupon = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.couponsWrite, id));
  };

  const addProductVariant = async (
    variant: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File }
  ) => {
    await syncAfterMutation(() => createProductVariantForProduct(variant.product_id, variant));
  };

  const updateProductVariant = async (id: number, updates: Partial<ProductVariant>) => {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.productVariantsWrite, id, payload));
  };

  const deleteProductVariant = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.productVariantsWrite, id));
  };

  const addProductImage = async (image: Omit<ProductImage, "id"> & { image_file?: File }) => {
    if (image.image_file) {
      const uploadedResult = await uploadProductImageFile(image.product_id, image.image_file as File, {
        is_primary: image.is_primary,
        sort_order: image.sort_order,
      });
      if (!uploadedResult.ok) {
        throw new Error(uploadedResult.error || "Không thể upload ảnh sản phẩm lên backend");
      }

      await loadBackendData();
      return;
    }

    await syncAfterMutation(() =>
      createRecord(RESOURCE_PATHS.productImages, {
        ...image,
        image_file: undefined,
      }),
    );
  };

  const updateProductImage = async (id: number, updates: Partial<ProductImage>) => {
    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.productImages, id, updates));
  };

  const deleteProductImage = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.productImages, id));
  };

  const setPrimaryProductImage = async (id: number) => {
    const ok = await markProductImageAsPrimary(id);
    if (ok) {
      await loadBackendData();
      return;
    }

    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.productImages, id, { is_primary: true }));
  };

  const addStockMovement = async (movement: Omit<StockMovement, "id" | "created_at">) => {
    const payload = {
      ...movement,
      created_at: new Date().toISOString(),
    };
    await syncAfterMutation(() => createRecord(RESOURCE_PATHS.stockMovements, payload));
  };

  const updateStockMovement = async (id: number, updates: Partial<StockMovement>) => {
    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.stockMovements, id, updates));
  };

  const deleteStockMovement = async (id: number) => {
    await syncAfterMutation(() => deleteRecord(RESOURCE_PATHS.stockMovements, id));
  };

  const updateReturnRequest = async (id: number, updates: Partial<ReturnRequest>) => {
    await syncAfterMutation(() => updateRecord(RESOURCE_PATHS.returnRequests, id, updates));
  };

  const updateSystemConfig = async (updates: Partial<SystemConfig>) => {
    const payload = {
      ...systemConfig,
      ...updates,
    };
    await syncAfterMutation(() => updateSingleton(RESOURCE_PATHS.systemConfig, payload));
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
    systemConfig,
    productFetchError,
    brandFetchError,

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

    updateSystemConfig,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
