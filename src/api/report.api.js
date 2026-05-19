import api from "./axios.js";
import { downloadPdfFromApi } from "../utils/downloadPdf.js";

export const getInventoryReportApi = (params) => api.get("/reports/inventory", { params });
export const getSalesReportApi = (params) => api.get("/reports/sales", { params });
export const getPurchasesReportApi = () => api.get("/reports/purchases");
export const getLowStockReportApi = () => api.get("/reports/low-stock");
export const getShelfStockReportApi = () => api.get("/reports/shelf-stock");
export const getPosDailyReportApi = (params) => api.get("/reports/pos-daily", { params });
export const getMovementsReportApi = (productId) =>
  api.get(productId ? `/reports/product-movement/${productId}` : "/reports/movements");

const dateSuffix = () => new Date().toISOString().split("T")[0];

export const downloadInventoryPdfApi = () =>
  downloadPdfFromApi("/reports/inventory/pdf", `inventory-report-${dateSuffix()}.pdf`);
export const downloadSalesPdfApi = () =>
  downloadPdfFromApi("/reports/sales/pdf", `sales-report-${dateSuffix()}.pdf`);
export const downloadPurchasePdfApi = () =>
  downloadPdfFromApi("/reports/purchases/pdf", `purchase-report-${dateSuffix()}.pdf`);
export const downloadLowStockPdfApi = () =>
  downloadPdfFromApi("/reports/low-stock/pdf", `low-stock-report-${dateSuffix()}.pdf`);
export const downloadOutOfStockPdfApi = () =>
  downloadPdfFromApi("/reports/out-of-stock/pdf", `out-of-stock-report-${dateSuffix()}.pdf`);
export const downloadShelfStockPdfApi = () =>
  downloadPdfFromApi("/reports/shelf-stock/pdf", `shelf-stock-report-${dateSuffix()}.pdf`);
export const downloadDailyPosPdfApi = () =>
  downloadPdfFromApi("/reports/pos-daily/pdf", `pos-daily-report-${dateSuffix()}.pdf`);
export const downloadProductMovementPdfApi = (productId) =>
  downloadPdfFromApi(
    `/reports/product-movement/${productId}/pdf`,
    `product-movement-${productId}-${dateSuffix()}.pdf`
  );
