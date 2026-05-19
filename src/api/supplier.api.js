import api from "./axios.js";

export const getSuppliersApi = () => api.get("/suppliers");
export const getSupplierApi = (id) => api.get(`/suppliers/${id}`);
export const createSupplierApi = (data) => api.post("/suppliers", data);
export const updateSupplierApi = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplierApi = (id) => api.delete(`/suppliers/${id}`);
export const getSupplierProductsApi = (id) => api.get(`/suppliers/${id}/products`);
export const getSupplierPurchaseOrdersApi = (id) => api.get(`/suppliers/${id}/purchase-orders`);
