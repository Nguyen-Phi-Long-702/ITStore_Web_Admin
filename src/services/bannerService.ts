import { api, unwrapList, unwrapData } from "../lib/api";
import { Banner, BannerFilter } from "../types";

export const bannerService = {
  getBanners: async (filter?: BannerFilter) => {
    const params = new URLSearchParams();
    if (filter?.sort) params.append("sort", filter.sort);
    if (filter?.is_active !== undefined) {
      params.append("is_active", String(filter.is_active));
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get(`/api/admin/banners${query}`);
    return unwrapList<Banner>(res);
  },

  createBanner: async (data: FormData) => {
    const res = await api.postForm(`/api/admin/banners`, data);
    return unwrapData<Banner>(res);
  },

  updateBanner: async (id: number, data: FormData) => {
    const res = await api.putForm(`/api/admin/banners/${id}`, data);
    return unwrapData<Banner>(res);
  },

  deleteBanner: async (id: number) => {
    return api.delete(`/api/admin/banners/${id}`);
  },
};
