import api from "./axios.js";

export const getActivityLogsApi = (params) => api.get("/activity-logs", { params });
export const getActivityLogApi = (id) => api.get(`/activity-logs/${id}`);
