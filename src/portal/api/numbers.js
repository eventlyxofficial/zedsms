import { api } from "./client";
import { NUMBERS } from "../mocks/seed";

// No backend wired up yet — resolves mock data on a fake network delay.
// Swap each body for the commented `api.*` call once the endpoint exists;
// the return shape is already what the real endpoint should produce.
const MOCK_DELAY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), MOCK_DELAY));

export function getNumbers() {
  // return api.get("/numbers");
  return delay(NUMBERS);
}

export function buyNumber({ type, service, iso, plan }) {
  // return api.post("/numbers", { type, service, iso, plan });
  return delay({ id: Date.now(), type, service, iso, status: "active", days: plan ?? 7, unread: 0 });
}

export function renewNumber(numberId, { plan } = {}) {
  // return api.post(`/numbers/${numberId}/renew`, { plan });
  return delay({ id: numberId, ok: true });
}

export function releaseNumber(numberId) {
  // return api.delete(`/numbers/${numberId}`);
  return delay({ id: numberId, ok: true });
}

export function renameNumber(numberId, label) {
  // return api.patch(`/numbers/${numberId}`, { label });
  return delay({ id: numberId, label });
}
