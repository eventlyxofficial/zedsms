import { api } from "./client";

// Get mobile number available countries
export async function getCountries() {
  return api.get("/mobile-number-countries");
}

// Get private number countries
export async function getPrivateCountries() {
  return api.get("/private-number-countries");
}

// Get country details
export async function getCountryDetails(iso) {
  try {
    return api.get(`/countries/${iso}`);
  } catch (err) {
    throw new Error("Failed to get country details");
  }
}
