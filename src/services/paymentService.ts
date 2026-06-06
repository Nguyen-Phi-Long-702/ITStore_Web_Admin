import { api } from "../lib/api";
import { PaymentHistoryItem } from "../types";

interface PaymentListParams {
  page?: number;
  limit?: number;
  payment_status?: string;
  method?: string;
  user_id?: number;
}

export interface PaymentListResponse {
  data: PaymentHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export const paymentService = {
  async getAll(params: PaymentListParams = {}): Promise<PaymentListResponse> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.payment_status) query.set("payment_status", params.payment_status);
    if (params.method) query.set("method", params.method);
    if (params.user_id !== undefined) query.set("user_id", String(params.user_id));
    const res = await api.get<any>(`/api/admin/payments?${query.toString()}`);
    return {
      data: res.data ?? [],
      pagination: res.pagination ?? { total: 0, page: 1, limit: 10, hasMore: false },
    };
  },
};