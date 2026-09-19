import { api } from "./client";
import { USER } from "../mocks/seed";

const MOCK_DELAY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), MOCK_DELAY));

export function getMe() {
  // return api.get("/auth/me");
  return delay(USER);
}

export function login({ email, password }) {
  // return api.post("/auth/login", { email, password });
  return delay({ token: "mock-token", user: USER });
}

export function logout() {
  // return api.post("/auth/logout");
  localStorage.removeItem("zedsms-token");
  return delay({ ok: true });
}
