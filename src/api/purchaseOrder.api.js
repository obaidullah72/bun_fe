import api from "./axios.js";

export const getPurchaseOrdersApi = () => api.get("/purchase-orders");
export const getPurchaseOrderApi = (id) => api.get(`/purchase-orders/${id}`);
export const createPurchaseOrderApi = (data) => api.post("/purchase-orders", data);
export const updatePurchaseOrderApi = (id, data) => api.put(`/purchase-orders/${id}`, data);
export const deletePurchaseOrderApi = (id) => api.delete(`/purchase-orders/${id}`);
export const receivePurchaseOrderApi = (id) => api.put(`/purchase-orders/${id}/receive`);
