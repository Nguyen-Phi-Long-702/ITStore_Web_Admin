import { api, unwrapList } from "../lib/api";
import { Customer } from "../types";

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const res = await api.get("/api/admin/users");
    return unwrapList<Customer>(res);
  },

  async getDetail(id: number): Promise<Customer> {
    const res = await api.get<any>(`/api/admin/users/${id}`);
    return res.data ?? res;
  },

  async updateStatus(id: number, isActive: boolean): Promise<void> {
    await api.patch(`/api/admin/users/${id}/status`, { is_active: isActive });
  },

  async update(id: number, data: Partial<Customer>): Promise<void> {
    await api.patch(`/api/admin/users/${id}/status`, { is_active: data.is_active });
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/users/${id}`);
  },
};
