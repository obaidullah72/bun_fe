import api from "./axios.js";

export const getLowStockAlertsApi = () => api.get("/alerts/low-stock");
export const getOutOfStockAlertsApi = () => api.get("/alerts/out-of-stock");
export const getAlertSummaryApi = () => api.get("/alerts/summary");
