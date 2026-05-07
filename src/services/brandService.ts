import { api, unwrapList, unwrapData } from "../lib/api";
import { Brand } from "../types";

export const brandService = {
  async getAll(): Promise<Brand[]> {
    const res = await api.get("/api/brands");
    return unwrapList<Brand>(res);
  },

  async create(data: Omit<Brand, "id" | "created_at"> & { logo_file?: File }): Promise<void> {
    if (!data.logo_file) throw new Error("Vui lòng chọn logo thương hiệu");
    const form = new FormData();
    form.append("name", data.name);
    form.append("logo", data.logo_file);
    await api.postForm("/api/admin/brands", form);
  },

  async update(id: number, data: Partial<Brand> & { logo_file?: File }): Promise<void> {
    const form = new FormData();
    if (data.name) form.append("name", data.name);
    if (data.logo_file) form.append("logo", data.logo_file);
    await api.putForm(`/api/admin/brands/${id}`, form);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/brands/${id}`);
  },
};
