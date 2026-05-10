import { api, unwrapList } from "../lib/api";
export const returnService = {
    async getAll() {
        const res = await api.get("/api/admin/return-requests");
        return unwrapList(res);
    },
    async getDetail(id) {
        const res = await api.get(`/api/admin/return-requests/${id}`);
        return res.data?.data || res.data;
    },
    async update(id, data) {
        if (data.status === "approved") {
            await api.patch(`/api/admin/return-requests/${id}/approve`, {
                admin_note: data.admin_note,
                refund_amount: data.refund_amount,
            });
            return;
        }
        if (data.status === "rejected") {
            await api.patch(`/api/admin/return-requests/${id}/reject`, {
                admin_note: data.admin_note,
            });
            return;
        }
        if (data.status === "received") {
            await api.patch(`/api/admin/return-requests/${id}/received`, {});
            return;
        }
        await api.patch(`/api/admin/return-requests/${id}/complete`, {});
    },
};
