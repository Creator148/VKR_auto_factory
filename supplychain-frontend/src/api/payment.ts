import { api } from "./index";

export const PaymentAPI = {
  deposit: (tenderId: string, data: any) => api.post(`/payments/${tenderId}/deposit`, data),
  release: (tenderId: string, data?: any) => api.post(`/payments/${tenderId}/release`, data),
  refund: (tenderId: string, data: any) => api.post(`/payments/${tenderId}/refund`, data),
  escrow: (tenderId: string) => api.get(`/payments/${tenderId}/escrow`),
  byTender: (tenderId: string) => api.get(`/payments/tender/${tenderId}`),
};
