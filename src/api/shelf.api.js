import api from "./axios.js";

export const getShelvesApi = () => api.get("/shelves");
export const getShelfApi = (id) => api.get(`/shelves/${id}`);
export const getShelfProductsApi = (id) => api.get(`/shelves/${id}/products`);
export const createShelfApi = (data) => api.post("/shelves", data);
export const updateShelfApi = (id, data) => api.put(`/shelves/${id}`, data);
export const deleteShelfApi = (id) => api.delete(`/shelves/${id}`);
