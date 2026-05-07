import { api, unwrapList } from "../lib/api";
import { ReturnRequest } from "../types";

export const returnService = {
  async getAll(): Promise<ReturnRequest[]> {
    const res = await api.get("/api/admin/return-requests");
    return unwrapList<ReturnRequest>(res);
  },

  async update(id: number, data: Partial<ReturnRequest>): Promise<void> {
    await api.patch(`/api/admin/return-requests/${id}`, data);
  },
};
