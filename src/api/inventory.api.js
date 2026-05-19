import api from "./axios.js";

export const getStockApi = () => api.get("/inventory/stock");
export const getLowStockApi = () => api.get("/inventory/low-stock");
export const getAdjustmentsApi = () => api.get("/inventory/adjustments");
export const getAdjustmentApi = (id) => api.get(`/inventory/adjustments/${id}`);
export const createAdjustmentApi = (data) => api.post("/inventory/adjustments", data);
export const getMovementsApi = (productId) => api.get(`/inventory/movements/${productId}`);
