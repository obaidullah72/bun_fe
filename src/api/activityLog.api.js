import api from "./axios.js";

export const getActivityLogsApi = (params) => api.get("/activity-logs", { params });
