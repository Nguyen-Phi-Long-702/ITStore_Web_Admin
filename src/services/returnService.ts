import { api, unwrapList } from "../lib/api";
import { ReturnRequest } from "../types";

export type ReturnRequestUpdate =
  | { status: "approved"; admin_note?: string; refund_amount: number }
  | { status: "rejected"; admin_note: string }
  | { status: "received" }
  | { status: "completed" };

export const returnService = {
  async getAll(): Promise<ReturnRequest[]> {
    const res = await api.get("/api/admin/return-requests");
    return unwrapList<ReturnRequest>(res);
  },

  async getDetail(id: number): Promise<ReturnRequest> {
    const res = await api.get(`/api/admin/return-requests/${id}`);
    return ((res as any).data as any)?.data || (res as any).data as ReturnRequest;
  },

  async update(id: number, data: ReturnRequestUpdate): Promise<void> {
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
