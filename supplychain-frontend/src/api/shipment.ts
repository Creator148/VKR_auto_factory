import { api } from "./index";

export const ShipmentAPI = {
  create: (data: any) => api.post("/shipments", data),
  confirm: (id: string) => api.post(`/shipments/${id}/confirm`),
  get: (id: string) => api.get(`/shipments/${id}`),
  byTender: (tenderId: string) => api.get(`/shipments/tender/${tenderId}`),
};
