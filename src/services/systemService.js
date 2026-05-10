import { api, unwrapData } from "../lib/api";
export const systemService = {
    async getConfig() {
        try {
            const res = await api.get("/api/admin/system-config");
            return unwrapData(res);
        }
        catch {
            return null;
        }
    },
    async updateConfig(data) {
        await api.patch("/api/admin/system-config", data);
    },
};
