import api from "./axios.js";

export function loginApi(payload) {
  return api.post("/auth/login", payload);
}

export function registerApi(payload) {
  return api.post("/auth/register", payload);
}

export function meApi() {
  return api.get("/auth/me");
}