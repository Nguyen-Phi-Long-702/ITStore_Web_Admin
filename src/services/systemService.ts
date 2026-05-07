import { api, unwrapData } from "../lib/api";
import { SystemConfig } from "../types";

export const systemService = {
  async getConfig(): Promise<SystemConfig | null> {
    try {
      const res = await api.get("/api/admin/system-config");
      return unwrapData<SystemConfig>(res);
    } catch {
      return null;
    }
  },

  async updateConfig(data: Partial<SystemConfig>): Promise<void> {
    await api.patch("/api/admin/system-config", data);
  },
};
