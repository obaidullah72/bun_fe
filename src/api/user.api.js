import api from "./axios.js";

export const getUsersApi = () => api.get("/users");
export const getUserApi = (id) => api.get(`/users/${id}`);
export const createUserApi = (data) => api.post("/users", data);
export const updateUserApi = (id, data) => api.put(`/users/${id}`, data);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);
