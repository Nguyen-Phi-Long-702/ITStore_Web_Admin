import { api, unwrapData } from "../lib/api";
import { generateSlug } from "../utils/slugUtils";
function flattenTree(nodes) {
    const result = [];
    function walk(items) {
        for (const item of items) {
            if (!item || typeof item !== "object")
                continue;
            const node = item;
            result.push({
                id: Number(node.id),
                name: String(node.name ?? ""),
                slug: String(node.slug ?? ""),
                parent_id: node.parent_id != null ? Number(node.parent_id) : undefined,
                category_code: typeof node.category_code === "string" ? node.category_code : undefined,
                created_at: String(node.created_at ?? ""),
            });
            if (Array.isArray(node.children))
                walk(node.children);
        }
    }
    walk(nodes);
    return result.filter((c) => c.id && c.name);
}
export const categoryService = {
    async getAll() {
        const res = await api.get("/api/categories");
        const raw = Array.isArray(res) ? res : (res?.data ?? []);
        return flattenTree(raw);
    },
    async create(data) {
        const payload = { ...data, slug: data.slug || generateSlug(data.name) };
        const res = await api.post("/api/admin/categories", payload);
        return unwrapData(res);
    },
    async update(id, data) {
        const payload = {
            ...data,
            ...(data.name && !data.slug ? { slug: generateSlug(data.name) } : {}),
        };
        await api.put(`/api/admin/categories/${id}`, payload);
    },
    async remove(id) {
        await api.delete(`/api/admin/categories/${id}`);
    },
};
