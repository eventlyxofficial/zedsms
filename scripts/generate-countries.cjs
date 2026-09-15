// Regenerates src/data/countries.generated.ts from the world-countries dataset.
// Run with: node scripts/generate-countries.cjs
// world-countries ships every field (currencies, borders, translations, ...) which would
// bloat the app bundle if imported directly, so we flatten it to just {code, name, flag} once
// at dev time and check the small generated file into the repo instead.
const fs = require("fs");
const path = require("path");
const countries = require("world-countries");

const list = countries
  .map((c) => ({ code: c.cca2, name: c.name.common, flag: c.flag }))
  .sort((a, b) => a.name.localeCompare(b.name));

const out =
  "export type WorldCountry = {\n  code: string;\n  name: string;\n  flag: string;\n};\n\n" +
  "// Generated from the world-countries npm package (name, cca2 code, emoji flag) — see scripts/generate-countries.cjs.\n" +
  `export const allCountries: WorldCountry[] = ${JSON.stringify(list, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, "../src/data/countries.generated.ts"), out);
console.log(`wrote ${list.length} countries`);
