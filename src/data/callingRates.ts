// Inbound SMS pricing is either a flat metered per-message rate (after a free
// monthly allowance) or fully free for the country — kept as a discriminated
// union so the UI can never accidentally render a stale/mismatched string.
export type InboundSmsRate = { type: "free" } | { type: "metered"; rate: number };

export type CallingRates = {
  mobile: number;
  landline: number;
  inboundSms: InboundSmsRate;
  outboundSms: number;
};

// Keyed by ISO cca2 code. Numeric-only — the UI owns the fixed labels/units
// (¢/Min, ¢/Msg, "Free/mo, then ..."). Add a country here to give it real rates;
// any country without an entry gets a deterministic fallback below.
const ratesByCountry: Record<string, CallingRates> = {
  BD: { mobile: 2.4, landline: 2.4, inboundSms: { type: "metered", rate: 1.5 }, outboundSms: 2.4 },
  US: { mobile: 3.1, landline: 2.8, inboundSms: { type: "metered", rate: 1.4 }, outboundSms: 2.2 },
  // United Kingdom: inbound SMS is free — no allowance/overage pricing applies.
  GB: { mobile: 3.2, landline: 2.8, inboundSms: { type: "free" }, outboundSms: 1.3 },
  CA: { mobile: 2.7, landline: 2.5, inboundSms: { type: "metered", rate: 1.4 }, outboundSms: 2.3 },
  AU: { mobile: 3.0, landline: 2.6, inboundSms: { type: "metered", rate: 1.6 }, outboundSms: 2.2 },
};

// Deterministic hash so a country without manual rates always gets the same
// demo numbers on every selection, instead of a fresh random value each time.
function hashCode(code: string): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Maps a hash to a realistic-looking decimal in [min, max], rounded to 1 decimal.
function pseudoRate(seed: number, salt: number, min = 0.5, max = 5.0): number {
  const n = (seed * 2654435761 + salt * 40503) >>> 0;
  const t = (n % 1000) / 1000;
  return Math.round((min + t * (max - min)) * 10) / 10;
}

function generateFallbackRates(countryCode: string): CallingRates {
  const seed = hashCode(countryCode);
  return {
    mobile: pseudoRate(seed, 1),
    landline: pseudoRate(seed, 2),
    inboundSms: { type: "metered", rate: pseudoRate(seed, 3, 0.5, 2.5) },
    outboundSms: pseudoRate(seed, 4, 0.5, 2.5),
  };
}

export function getCallingRates(countryCode: string): CallingRates {
  return ratesByCountry[countryCode] ?? generateFallbackRates(countryCode);
}
