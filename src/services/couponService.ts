import { api, unwrapList, unwrapData } from "../lib/api";
import { Coupon } from "../types";

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    const res = await api.get("/api/admin/coupons");
    return unwrapList<Coupon>(res);
  },

  async create(data: Omit<Coupon, "id" | "created_at">): Promise<Coupon> {
    const res = await api.post("/api/admin/coupons", data);
    return unwrapData<Coupon>(res);
  },

  async update(id: number, data: Partial<Coupon>): Promise<void> {
    await api.put(`/api/admin/coupons/${id}`, data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/coupons/${id}`);
  },
};
