import { api, unwrapList, unwrapData } from "../lib/api";
import { generateSlug } from "../utils/slugUtils";
export const productService = {
    async getAll() {
        const res = await api.get("/api/admin/products");
        return unwrapList(res);
    },
    async getDetail(slug) {
        const res = await api.get(`/api/products/${slug}`);
        return unwrapData(res);
    },
    async create(data) {
        const form = new FormData();
        form.append("sku", data.sku);
        form.append("name", data.name);
        form.append("category_id", String(data.category_id));
        form.append("brand_id", String(data.brand_id));
        if (data.description)
            form.append("description", data.description);
        if (data.status)
            form.append("status", data.status);
        const slug = data.slug || generateSlug(data.name);
        form.append("slug", slug);
        const res = await api.postForm("/api/admin/products", form);
        return unwrapData(res);
    },
    async update(id, data) {
        const payload = { ...data };
        if (data.name && !data.slug)
            payload.slug = generateSlug(data.name);
        await api.put(`/api/admin/products/${id}`, payload);
    },
    async updateStatus(id, status) {
        await api.patch(`/api/admin/products/${id}/status`, { status });
    },
    async remove(id) {
        await api.delete(`/api/admin/products/${id}`);
    },
    async getVariantsByProduct(productId) {
        const res = await api.get(`/api/admin/products/${productId}/variants`);
        const variants = unwrapList(res);
        return variants.map((v) => ({ ...v, product_id: productId }));
    },
    async createVariant(productId, data) {
        const form = new FormData();
        form.append("sku", data.sku);
        form.append("price", String(data.price));
        form.append("stock", String(data.stock));
        if (data.version)
            form.append("version", data.version);
        if (data.color)
            form.append("color", data.color);
        if (data.color_hex)
            form.append("color_hex", data.color_hex);
        if (data.compare_at_price !== undefined)
            form.append("compare_at_price", String(data.compare_at_price));
        if (data.is_active !== undefined)
            form.append("is_active", String(data.is_active));
        if (data.variant_image_file)
            form.append("variant_image", data.variant_image_file);
        await api.postForm(`/api/admin/products/${productId}/variants`, form);
    },
    async updateVariant(id, data) {
        const form = new FormData();
        if (data.sku)
            form.append("sku", data.sku);
        if (data.price !== undefined)
            form.append("price", String(data.price));
        if (data.stock !== undefined)
            form.append("stock", String(data.stock));
        if (data.version)
            form.append("version", data.version);
        if (data.color)
            form.append("color", data.color);
        if (data.color_hex)
            form.append("color_hex", data.color_hex);
        if (data.compare_at_price !== undefined)
            form.append("compare_at_price", String(data.compare_at_price));
        await api.putForm(`/api/admin/variants/${id}`, form);
    },
    async removeVariant(id) {
        await api.delete(`/api/admin/variants/${id}`);
    },
    async getImages() {
        const res = await api.get("/api/admin/product-images");
        return unwrapList(res);
    },
    async uploadImages(productId, files) {
        const form = new FormData();
        for (const file of files) {
            form.append("images", file);
        }
        await api.postForm(`/api/admin/products/${productId}/images`, form);
    },
    async updateImage(id, data) {
        await api.patch(`/api/admin/product-images/${id}`, data);
    },
    async removeImage(id) {
        await api.delete(`/api/admin/product-images/${id}`);
    },
    async setPrimaryImage(id) {
        await api.patch(`/api/admin/product-images/${id}/primary`, {});
    },
    async getStockMovements() {
        const res = await api.get("/api/admin/stock/logs");
        return unwrapList(res);
    },
    async createStockMovement(data) {
        await api.post("/api/admin/stock/inbound", [
            {
                variant_id: data.variant_id,
                change_qty: data.change_qty,
                note: data.note,
            },
        ]);
    },
    async updateStockMovement(id, data) {
        await api.patch(`/api/admin/stock/logs/${id}`, data);
    },
    async removeStockMovement(id) {
        await api.delete(`/api/admin/stock/logs/${id}`);
    },
};
