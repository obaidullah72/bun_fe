import api from "./axios.js";

export const getSalesOrdersApi = () => api.get("/sales-orders");
export const getSalesOrderApi = (id) => api.get(`/sales-orders/${id}`);
export const createSalesOrderApi = (data) => api.post("/sales-orders", data);
export const updateSalesOrderApi = (id, data) => api.put(`/sales-orders/${id}`, data);
export const deleteSalesOrderApi = (id) => api.delete(`/sales-orders/${id}`);
export const downloadSalesOrderPdfApi = (id) =>
  import("../utils/downloadPdf.js").then(function (m) {
    return m.downloadPdfFromApi(`/sales-orders/${id}/pdf`, `sales-order-${id}.pdf`);
  });
