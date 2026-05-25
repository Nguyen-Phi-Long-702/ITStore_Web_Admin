import { api, unwrapList } from "../lib/api";

export interface NotificationItem {
  id?: string;
  _id?: string;
  title: string;
  body: string;
  type?: string;
  createdAt?: string;
  created_at?: string;
}

export interface NotificationResponse {
  data: NotificationItem[];
  total: number;
}

export const notificationService = {
  getNotifications: async (page: number = 1, limit: number = 10) => {
    const res = await api.get<unknown>(`/api/admin/notifications?page=${page}&limit=${limit}`);
    const data = unwrapList<NotificationItem>(res);
    return {
      data,
      total:
        (res as { pagination?: { total?: number } })?.pagination?.total ??
        (res as { total?: number; meta?: { total?: number } })?.total ??
        (res as { meta?: { total?: number } })?.meta?.total ??
        data.length,
    } satisfies NotificationResponse;
  },

  createNotification: (data: { title: string; body: string }) =>
    api.post<unknown>("/api/admin/notifications", data),
};
