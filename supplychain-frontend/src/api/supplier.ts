import { api } from "./index";

export const SupplierAPI = {
  list: () => api.get("/suppliers"),
  get: (id: string) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post("/suppliers", data),
  bids: (id: string) => api.get(`/suppliers/${id}/bids`),
  won: (id: string) => api.get(`/suppliers/${id}/won`),
};
