import { api } from "./client";
import { TRANSACTIONS } from "../mocks/seed";

const MOCK_DELAY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), MOCK_DELAY));

export function getTransactions() {
  // return api.get("/transactions");
  return delay(TRANSACTIONS);
}

export function topUp({ amount, method }) {
  // return api.post("/transactions/topup", { amount, method });
  return delay({ date: new Date().toISOString().slice(0, 10), action: "Top up", amount, desc: method, status: 1 });
}

export function transferBalance({ amount, toZedId }) {
  // return api.post("/transactions/transfer", { amount, toZedId });
  return delay({ date: new Date().toISOString().slice(0, 10), action: "Balance transfer", amount: -amount, desc: `To ${toZedId}`, status: 1 });
}
