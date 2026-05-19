import api from "./axios.js";

export const getDashboardStatsApi = () => api.get("/dashboard/stats");
export const getRecentActivityApi = () => api.get("/dashboard/recent-activity");
export const getSalesSummaryApi = () => api.get("/dashboard/sales-summary");
export const getStockSummaryApi = () => api.get("/dashboard/stock-summary");
