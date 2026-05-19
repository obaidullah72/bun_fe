import api from "./axios.js";

export const loginApi = (data) => api.post("/auth/login", data);
export const registerApi = (data) => api.post("/auth/register", data);
export const meApi = () => api.get("/auth/me");
export const logoutApi = (refreshToken) => api.post("/auth/logout", { refreshToken });
export const forgotPasswordApi = (data) => api.post("/auth/forgot-password", data);
export const resetPasswordApi = (data) => api.post("/auth/reset-password", data);
export const updateProfileApi = (data) => api.put("/auth/profile", data);
export const changePasswordApi = (data) => api.put("/auth/change-password", data);
