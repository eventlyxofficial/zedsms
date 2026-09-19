import { api } from "./client";
import { SERVICES } from "../mocks/seed";

const MOCK_DELAY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), MOCK_DELAY));

export function getServices() {
  // return api.get("/services");
  return delay(SERVICES);
}
