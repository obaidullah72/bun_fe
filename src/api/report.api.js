import api from "./axios.js";

export const getInventoryReportApi = (params) => api.get("/reports/inventory", { params });
export const getSalesReportApi = (params) => api.get("/reports/sales", { params });
export const getPurchasesReportApi = () => api.get("/reports/purchases");
export const getLowStockReportApi = () => api.get("/reports/low-stock");
export const getShelfStockReportApi = () => api.get("/reports/shelf-stock");
export const getPosDailyReportApi = (params) => api.get("/reports/pos-daily", { params });
export const getMovementsReportApi = () => api.get("/reports/movements");
