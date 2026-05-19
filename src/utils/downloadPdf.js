import api from "../api/axios.js";

export async function downloadPdfFromApi(url, filename) {
  const response = await api.get(url, { responseType: "blob" });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(link.href);
}
