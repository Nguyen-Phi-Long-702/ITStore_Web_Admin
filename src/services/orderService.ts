import { api, unwrapList, unwrapData } from "../lib/api";
import { Order, OrderItem } from "../types";

export const orderService = {
  async getAll(): Promise<Order[]> {
    const res = await api.get("/api/admin/orders");
    return unwrapList<Order>(res);
  },

  async getDetail(id: number): Promise<Order> {
    const res = await api.get(`/api/admin/orders/${id}`);
    const unwrapped = unwrapData<any>(res);
    return unwrapped?.data || unwrapped;
  },

  async getItems(): Promise<OrderItem[]> {
    const res = await api.get("/api/admin/order-items");
    return unwrapList<OrderItem>(res);
  },

  async updateStatus(id: number, order_status: string, note?: string): Promise<void> {
    await api.patch(`/api/admin/orders/${id}/status`, { order_status, ...(note ? { note } : {}) });
  },

  async cancelOrder(id: number, cancel_reason: string): Promise<void> {
    await api.patch(`/api/admin/orders/${id}/cancel`, { cancel_reason });
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/orders/${id}`);
  },
};
