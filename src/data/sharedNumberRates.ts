export type SharedDuration = "1week" | "2weeks" | "1month";

// country cca2 → service id → duration → price (numeric only, USD).
const ratesByCountryAndService: Record<string, Record<string, Record<SharedDuration, number>>> = {
  US: {
    whatsapp: { "1week": 0.45, "2weeks": 0.8, "1month": 1.5 },
  },
  GB: {
    whatsapp: { "1week": 0.52, "2weeks": 0.9, "1month": 1.6 },
  },
  CA: {
    whatsapp: { "1week": 0.48, "2weeks": 0.85, "1month": 1.55 },
  },
  AU: {
    whatsapp: { "1week": 0.55, "2weeks": 0.95, "1month": 1.7 },
  },
};

// Deterministic hash so an undefined country/service/duration combination always
// resolves to the same demo price instead of a fresh random value each time.
function hashCode(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pseudoPrice(seed: string, min = 0.3, max = 2.5): number {
  const n = (hashCode(seed) * 2654435761) >>> 0;
  const t = (n % 1000) / 1000;
  return Math.round((min + t * (max - min)) * 100) / 100;
}

const durationScale: Record<SharedDuration, number> = {
  "1week": 1,
  "2weeks": 1.8,
  "1month": 3.2,
};

function generateFallbackPrice(countryCode: string, serviceId: string, duration: SharedDuration): number {
  const base = pseudoPrice(`${countryCode}:${serviceId}`);
  return Math.round(base * durationScale[duration] * 100) / 100;
}

export function getSharedNumberPrice(countryCode: string, serviceId: string, duration: SharedDuration): number {
  return ratesByCountryAndService[countryCode]?.[serviceId]?.[duration] ?? generateFallbackPrice(countryCode, serviceId, duration);
}
