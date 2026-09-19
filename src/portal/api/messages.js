import { api } from "./client";
import { MESSAGES, SENT } from "../mocks/seed";

const MOCK_DELAY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), MOCK_DELAY));

export function getMessages(numberId) {
  // return api.get(`/numbers/${numberId}/messages`);
  return delay(numberId ? MESSAGES.filter((m) => m.numberId === numberId) : MESSAGES);
}

export function getSent(numberId) {
  // return api.get(`/numbers/${numberId}/sent`);
  return delay(numberId ? SENT.filter((s) => s.numberId === numberId) : SENT);
}

export function sendSms(numberId, { to, body }) {
  // return api.post(`/numbers/${numberId}/sent`, { to, body });
  return delay({ id: Date.now(), numberId, to, body, time: "just now", status: "delivered" });
}
