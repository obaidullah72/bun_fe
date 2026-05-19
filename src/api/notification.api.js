import api from "./axios.js";

export const getNotificationsApi = (params) => api.get("/notifications", { params });
export const getUnreadNotificationsCountApi = () => api.get("/notifications/unread-count");
export const getNotificationApi = (id) => api.get(`/notifications/${id}`);
export const markNotificationReadApi = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsReadApi = () => api.put("/notifications/mark-all-read");
export const deleteNotificationApi = (id) => api.delete(`/notifications/${id}`);
