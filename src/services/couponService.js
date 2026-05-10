import { api, unwrapList, unwrapData } from "../lib/api";
export const couponService = {
    async getAll() {
        const res = await api.get("/api/admin/coupons");
        return unwrapList(res);
    },
    async create(data) {
        const res = await api.post("/api/admin/coupons", data);
        return unwrapData(res);
    },
    async update(id, data) {
        await api.put(`/api/admin/coupons/${id}`, data);
    },
    async remove(id) {
        await api.delete(`/api/admin/coupons/${id}`);
    },
};
