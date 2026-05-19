import api from "./axios.js";

export const createSaleApi = (data) => api.post("/pos/sales", data);
export const getTodaySalesApi = () => api.get("/pos/sales/today");
export const getSaleApi = (id) => api.get(`/pos/sales/${id}`);
export const scanPosProductApi = (code) => api.post("/pos/scan", { code });
export const getReceiptApi = (id) => api.get(`/pos/receipt/${id}`);
