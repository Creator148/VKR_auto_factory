import { api } from "./index";

export const TenderAPI = {
  create: (data: any) => api.post("/tenders", data),
  list: () => api.get("/tenders"),
  get: (id: string) => api.get(`/tenders/${id}`),
  submitBid: (id: string, data: any) => api.post(`/tenders/${id}/bids`, data),
  awardBid: (id: string, data: any) => api.post(`/tenders/${id}/award`, data),
  getBids: (id: string) => api.get(`/tenders/${id}/bids`),
};
