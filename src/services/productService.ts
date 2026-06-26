import { api, unwrapList, unwrapData } from "../lib/api";
import { Product, ProductVariant, ProductImage, StockMovement } from "../types";
import { generateSlug } from "../utils/slugUtils";

export type ProductDetail = {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  specifications?: any;
  status: string;
  category: { id: number; name: string; slug: string };
  brand: { id: number; name: string; logo_url: string | null };
  images: Array<{ id: number; image_url: string; is_primary: boolean; sort_order: number }>;
  variants: Array<{
    id: number;
    sku: string;
    version: string | null;
    color: string | null;
    color_hex: string | null;
    price: number;
    compare_at_price: number | null;
    stock: number;
    variant_image: string | null;
  }>;
};

export const productService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    category_id?: number;
    brand_id?: number;
    price_min?: number;
    price_max?: number;
    status?: string;
  }): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const query = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) query.append("page", String(params.page));
      if (params.limit !== undefined) query.append("limit", String(params.limit));
      if (params.keyword !== undefined) query.append("keyword", params.keyword);
      if (params.category_id !== undefined) query.append("category_id", String(params.category_id));
      if (params.brand_id !== undefined) query.append("brand_id", String(params.brand_id));
      if (params.price_min !== undefined) query.append("price_min", String(params.price_min));
      if (params.price_max !== undefined) query.append("price_max", String(params.price_max));
      if (params.status !== undefined) query.append("status", params.status);
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await api.get<any>(`/api/admin/products${queryString}`);
    
    // Unwrap the list or return structured pagination data
    const data = unwrapList<Product>(res);
    
    let total = data.length;
    let page = 1;
    let limit = 20;

    if (res && typeof res === "object") {
      const pagination = (res as any).pagination;
      if (pagination && typeof pagination === "object") {
        if (pagination.total !== undefined) total = Number(pagination.total);
        if (pagination.page !== undefined) page = Number(pagination.page);
        if (pagination.limit !== undefined) limit = Number(pagination.limit);
      } else {
        if ((res as any).total !== undefined) total = Number((res as any).total);
        if ((res as any).page !== undefined) page = Number((res as any).page);
        if ((res as any).limit !== undefined) limit = Number((res as any).limit);
      }
    }

    return { data, total, page, limit };
  },

  async getDetail(slug: string): Promise<ProductDetail> {
    const res = await api.get(`/api/products/${slug}`);
    return unwrapData<ProductDetail>(res);
  },

  async getAdminDetail(id: number, slug: string, originalStatus: string): Promise<ProductDetail> {
    try {
      const res = await api.get(`/api/admin/products/${id}`);
      const unwrapped = unwrapData<any>(res);
      if (unwrapped && (unwrapped.data?.id || unwrapped.id)) {
        return unwrapped?.data || unwrapped;
      }
      throw new Error("Fallback required");
    } catch {
      if (originalStatus === "available") {
        return this.getDetail(slug);
      }
      await this.updateStatus(id, "available");
      try {
        const detail = await this.getDetail(slug);
        await this.updateStatus(id, originalStatus);
        return detail;
      } catch (e) {
        await this.updateStatus(id, originalStatus);
        throw e;
      }
    }
  },

  async create(
    data: Omit<Product, "id" | "created_at" | "updated_at" | "slug"> & { slug?: string },
  ): Promise<Product> {
    const form = new FormData();
    form.append("sku", data.sku);
    form.append("name", data.name);
    form.append("category_id", String(data.category_id));
    form.append("brand_id", String(data.brand_id));
    if (data.description) form.append("description", data.description);
    if (data.specifications) form.append("specifications", typeof data.specifications === "string" ? data.specifications : JSON.stringify(data.specifications));
    if (data.status) form.append("status", data.status);
    const slug = data.slug || generateSlug(data.name);
    form.append("slug", slug);
    const res = await api.postForm("/api/admin/products", form);
    return unwrapData<Product>(res);
  },

  async update(id: number, data: Partial<Product>): Promise<void> {
    const payload: Record<string, unknown> = { ...data };
    if (data.name && !data.slug) payload.slug = generateSlug(data.name);
    await api.put(`/api/admin/products/${id}`, payload);
  },

  async updateStatus(id: number, status: string): Promise<void> {
    await api.patch(`/api/admin/products/${id}/status`, { status });
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/products/${id}`);
  },

  async getVariantsByProduct(productId: number): Promise<ProductVariant[]> {
    const res = await api.get(`/api/admin/products/${productId}/variants`);
    const variants = unwrapList<ProductVariant>(res);
    return variants.map((v) => ({ ...v, product_id: productId }));
  },


  async createVariant(
    productId: number,
    data: Omit<ProductVariant, "id" | "created_at"> & { variant_image_file?: File },
  ): Promise<void> {
    const form = new FormData();
    form.append("sku", data.sku);
    form.append("price", String(data.price));
    form.append("stock", String(data.stock));
    if (data.version) form.append("version", data.version);
    if (data.color) form.append("color", data.color);
    if (data.color_hex) form.append("color_hex", data.color_hex);
    if (data.compare_at_price !== undefined)
      form.append("compare_at_price", String(data.compare_at_price));
    if (data.is_active !== undefined) form.append("is_active", String(data.is_active));
    if (data.variant_image_file) form.append("variant_image", data.variant_image_file);
    await api.postForm(`/api/admin/products/${productId}/variants`, form);
  },

  async updateVariant(id: number, data: Partial<ProductVariant> & { variant_image_file?: File }): Promise<void> {
    const form = new FormData();
    if (data.sku) form.append("sku", data.sku);
    if (data.price !== undefined) form.append("price", String(data.price));
    if (data.stock !== undefined) form.append("stock", String(data.stock));
    if (data.version) form.append("version", data.version);
    if (data.color) form.append("color", data.color);
    if (data.color_hex) form.append("color_hex", data.color_hex);
    if (data.compare_at_price !== undefined)
      form.append("compare_at_price", String(data.compare_at_price));
    if (data.variant_image_file) form.append("variant_image", data.variant_image_file);
    await api.putForm(`/api/admin/variants/${id}`, form);
  },

  async removeVariant(id: number): Promise<void> {
    await api.delete(`/api/admin/variants/${id}`);
  },

  async updateVariantStatus(id: number, isActive: boolean): Promise<void> {
    await api.patch(`/api/admin/variants/${id}/status`, { is_active: isActive });
  },

  async getImages(): Promise<ProductImage[]> {
    const res = await api.get("/api/admin/product-images");
    return unwrapList<ProductImage>(res);
  },

  async uploadImages(productId: number, files: File[]): Promise<void> {
    const form = new FormData();
    for (const file of files) {
      form.append("images", file);
    }
    await api.postForm(`/api/admin/products/${productId}/images`, form);
  },

  async updateImage(id: number, data: Partial<ProductImage>): Promise<void> {
    await api.patch(`/api/admin/product-images/${id}`, data);
  },

  async removeImage(id: number): Promise<void> {
    await api.delete(`/api/admin/product-images/${id}`);
  },

  async setPrimaryImage(id: number): Promise<void> {
    await api.patch(`/api/admin/product-images/${id}/primary`, {});
  },

  async getStockMovements(): Promise<StockMovement[]> {
    const res = await api.get("/api/admin/stock/logs");
    return unwrapList<StockMovement>(res);
  },

  async getLowStock(threshold?: number): Promise<ProductVariant[]> {
    const query = threshold !== undefined ? `?threshold=${threshold}` : "";
    const res = await api.get(`/api/admin/stock/low-stock${query}`);
    return unwrapList<ProductVariant>(res);
  },

  async createStockMovement(data: Omit<StockMovement, "id" | "created_at">): Promise<void> {
    await api.post("/api/admin/stock/inbound", [
      {
        variant_id: data.variant_id,
        change_qty: data.change_qty,
        note: data.note,
      },
    ]);
  },

  async updateStockMovement(id: number, data: Partial<StockMovement>): Promise<void> {
    await api.patch(`/api/admin/stock/logs/${id}`, data);
  },

  async removeStockMovement(id: number): Promise<void> {
    await api.delete(`/api/admin/stock/logs/${id}`);
  },
};
