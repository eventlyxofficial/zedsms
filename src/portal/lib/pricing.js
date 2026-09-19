import { SERVICES, COUNTRIES } from "../mocks/seed";

// Pure pricing helpers. Screens still driven by mock data call these directly;
// screens wired to live catalogs (via useServices()/useCountries()) should
// inline the same math against query data instead of importing SERVICES/COUNTRIES here.
export const svcPriceOf = (name) => (SERVICES.find((s) => s.name === name)?.price) || 0.70;
export const countryRentOf = (iso) => (COUNTRIES.find((c) => c.iso === iso)?.rent) || 2.00;

// Base weekly price for a number (used for both buy + renew).
export const weeklyPriceOf = ({ type, service, iso }) =>
  type === "Private" ? countryRentOf(iso) : svcPriceOf(service);
