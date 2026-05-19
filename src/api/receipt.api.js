import api from "./axios.js";

export const getReceiptApi = (id) => api.get(`/pos/receipt/${id}`);
export const downloadReceiptPdfApi = (id) => api.get(`/pos/receipt/${id}/pdf`, { responseType: "blob" });
