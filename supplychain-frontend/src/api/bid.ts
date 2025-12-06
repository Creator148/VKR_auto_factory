import { api } from "./index";

export const BidAPI = {
  get: (id: string) => api.get(`/bids/${id}`),
  byTender: (tenderId: string) => api.get(`/bids/tender/${tenderId}`),
  bySupplier: (supplierId: string) => api.get(`/bids/supplier/${supplierId}`),
  update: (id: string, data: any) => api.put(`/bids/${id}`, data),
  delete: (id: string) => api.delete(`/bids/${id}`),
};
