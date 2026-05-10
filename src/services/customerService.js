import { api, unwrapList } from "../lib/api";
export const customerService = {
    async getAll() {
        const res = await api.get("/api/admin/users");
        return unwrapList(res);
    },
    async updateStatus(id, isActive) {
        await api.patch(`/api/admin/users/${id}/status`, { is_active: isActive });
    },
    async update(id, data) {
        await api.patch(`/api/admin/users/${id}/status`, { is_active: data.is_active });
    },
    async remove(id) {
        await api.delete(`/api/admin/users/${id}`);
    },
};
