import { api, unwrapList, unwrapData } from "../lib/api";
export const orderService = {
    async getAll() {
        const res = await api.get("/api/admin/orders");
        return unwrapList(res);
    },
    async getDetail(id) {
        const res = await api.get(`/api/admin/orders/${id}`);
        return unwrapData(res);
    },
    async getItems() {
        const res = await api.get("/api/admin/order-items");
        return unwrapList(res);
    },
    async updateStatus(id, order_status, note) {
        await api.patch(`/api/admin/orders/${id}/status`, { order_status, ...(note ? { note } : {}) });
    },
    async cancelOrder(id, cancel_reason) {
        await api.patch(`/api/admin/orders/${id}/cancel`, { cancel_reason });
    },
    async remove(id) {
        await api.delete(`/api/admin/orders/${id}`);
    },
};
