import api from "./axios.js";

export const getProductsApi = (params) => api.get("/products", { params });
export const getProductApi = (id) => api.get(`/products/${id}`);
export const createProductApi = (data) => api.post("/products", data);
export const updateProductApi = (id, data) => api.put(`/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);
export const scanProductApi = (code) => api.get(`/products/scan/${code}`);
export const getLowStockProductsApi = () => api.get("/products/alerts/low-stock");
