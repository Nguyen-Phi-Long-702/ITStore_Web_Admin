import { api, unwrapList } from "../lib/api";
export const brandService = {
    async getAll() {
        const res = await api.get("/api/brands");
        return unwrapList(res);
    },
    async create(data) {
        if (!data.logo_file)
            throw new Error("Vui lòng chọn logo thương hiệu");
        const form = new FormData();
        form.append("name", data.name);
        form.append("logo", data.logo_file);
        await api.postForm("/api/admin/brands", form);
    },
    async update(id, data) {
        const form = new FormData();
        if (data.name)
            form.append("name", data.name);
        if (data.logo_file)
            form.append("logo", data.logo_file);
        await api.putForm(`/api/admin/brands/${id}`, form);
    },
    async remove(id) {
        await api.delete(`/api/admin/brands/${id}`);
    },
};
