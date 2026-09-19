import { api } from "./client";
import { COUNTRIES } from "../mocks/seed";

const MOCK_DELAY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), MOCK_DELAY));

export function getCountries() {
  // return api.get("/countries");
  return delay(COUNTRIES);
}
