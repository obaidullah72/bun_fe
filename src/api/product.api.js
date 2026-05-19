import api from "./axios.js";

export function getProductsApi() {
  return api.get("/products");
}

export function getProductApi(id) {
  return api.get(`/products/${id}`);
}

export function createProductApi(payload) {
  return api.post("/products", payload);
}

export function scanProductApi(code) {
  return api.get(`/products/scan/${code}`);
}