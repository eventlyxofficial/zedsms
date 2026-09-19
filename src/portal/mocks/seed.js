// Mock seed data — stands in for real API responses until the backend is wired up.
// Every export here matches the shape src/api/*.js resolves to, so swapping a
// mock function for a real fetch() is a one-line change with no screen edits.

export const SERVICES = [
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", letter: "W", price: 0.85 },
  { id: "telegram", name: "Telegram", color: "#2AABEE", letter: "T", price: 0.60 },
  { id: "google", name: "Google", color: "#EA4335", letter: "G", price: 0.45 },
  { id: "instagram", name: "Instagram", color: "#E1306C", letter: "I", price: 0.75 },
  { id: "tiktok", name: "TikTok", color: "#111", letter: "K", price: 0.90 },
  { id: "openai", name: "OpenAI", color: "#10A37F", letter: "O", price: 1.10 },
  { id: "discord", name: "Discord", color: "#5865F2", letter: "D", price: 0.55 },
  { id: "uber", name: "Uber", color: "#000", letter: "U", price: 0.95 },
  { id: "facebook", name: "Facebook", color: "#1877F2", letter: "F", price: 0.70 },
  { id: "x", name: "X / Twitter", color: "#111", letter: "X", price: 0.65 },
  { id: "amazon", name: "Amazon", color: "#FF9900", letter: "A", price: 0.80 },
  { id: "apple", name: "Apple", color: "#555", letter: "A", price: 1.05 },
  { id: "microsoft", name: "Microsoft", color: "#00A4EF", letter: "M", price: 0.75 },
  { id: "netflix", name: "Netflix", color: "#E50914", letter: "N", price: 0.85 },
  { id: "paypal", name: "PayPal", color: "#003087", letter: "P", price: 1.20 },
  { id: "snapchat", name: "Snapchat", color: "#FFFC00", letter: "S", price: 0.50 },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", letter: "L", price: 0.70 },
  { id: "spotify", name: "Spotify", color: "#1DB954", letter: "S", price: 0.60 },
  { id: "binance", name: "Binance", color: "#F0B90B", letter: "B", price: 1.15 },
  { id: "coinbase", name: "Coinbase", color: "#0052FF", letter: "C", price: 1.25 },
  { id: "tinder", name: "Tinder", color: "#FE3C72", letter: "T", price: 0.90 },
  { id: "airbnb", name: "Airbnb", color: "#FF5A5F", letter: "A", price: 0.95 },
  { id: "revolut", name: "Revolut", color: "#191C1F", letter: "R", price: 1.10 },
  { id: "wechat", name: "WeChat", color: "#07C160", letter: "W", price: 0.80 },
  { id: "line", name: "LINE", color: "#06C755", letter: "L", price: 0.65 },
  { id: "viber", name: "Viber", color: "#7360F2", letter: "V", price: 0.55 },
  { id: "signal", name: "Signal", color: "#3A76F0", letter: "S", price: 0.60 },
  { id: "yahoo", name: "Yahoo", color: "#6001D2", letter: "Y", price: 0.45 },
  { id: "steam", name: "Steam", color: "#1B2838", letter: "S", price: 0.70 },
  { id: "epic", name: "Epic Games", color: "#2A2A2A", letter: "E", price: 0.75 },
  { id: "twitch", name: "Twitch", color: "#9146FF", letter: "T", price: 0.65 },
  { id: "reddit", name: "Reddit", color: "#FF4500", letter: "R", price: 0.55 },
  { id: "pinterest", name: "Pinterest", color: "#E60023", letter: "P", price: 0.50 },
  { id: "grab", name: "Grab", color: "#00B14F", letter: "G", price: 0.85 },
  { id: "lazada", name: "Lazada", color: "#0F146D", letter: "L", price: 0.80 },
  { id: "shopee", name: "Shopee", color: "#EE4D2D", letter: "S", price: 0.80 },
];

// `rent` = weekly price of a PRIVATE number for this country (renew is priced from this).
// Each country is priced differently. Shared numbers are priced by service instead (SERVICES.price).
export const COUNTRIES = [
  { iso: "gb", name: "United Kingdom", code: "+44", avail: 860, rent: 3.80 },
  { iso: "us", name: "United States", code: "+1", avail: 1420, rent: 4.50 },
  { iso: "ca", name: "Canada", code: "+1", avail: 620, rent: 4.20 },
  { iso: "au", name: "Australia", code: "+61", avail: 480, rent: 3.90 },
];

// Private numbers are NOT tied to a service (service: null) — they receive codes from any service.
// Shared numbers belong to exactly one service.
export const NUMBERS = [
  { id: 1, number: "+1 415 555 0142", iso: "us", country: "United States", service: null, type: "Private", provider: "Verizon", days: 21, status: "active", unread: 2 },
  { id: 2, number: "+44 7700 900 318", iso: "gb", country: "United Kingdom", service: "Telegram", type: "Shared", provider: "Vodafone", days: 6, status: "active", unread: 1 },
  { id: 3, number: "+63 917 700 2204", iso: "ph", country: "Philippines", service: null, type: "Private", provider: "Globe", days: 44, status: "active", unread: 0 },
  { id: 4, number: "+62 812 4490 117", iso: "id", country: "Indonesia", service: "Instagram", type: "Shared", provider: "Telkomsel", days: 2, status: "active", unread: 0 },
  { id: 5, number: "+91 98100 33421", iso: "in", country: "India", service: null, type: "Private", provider: "Airtel", days: 0, status: "expired", unread: 0 },
  { id: 6, number: "+49 1512 3344 21", iso: "de", country: "Germany", service: "Discord", type: "Shared", provider: "O2", days: 0, status: "expired", unread: 0 },
];

// Curated recent codes (drive the dashboard "Latest codes" + today count).
export const MESSAGES_RECENT = [
  { id: 1, numberId: 1, service: "WhatsApp", color: "#25D366", letter: "W", from: "WhatsApp", body: "Your WhatsApp code is 729-301. Don't share this code with others.", code: "729301", time: "2 min ago", unread: true },
  { id: 2, numberId: 2, service: "Telegram", color: "#2AABEE", letter: "T", from: "Telegram", body: "Login code: 51824. Do not give this code to anyone, even if they say they are from Telegram.", code: "51824", time: "14 min ago", unread: true },
  { id: 3, numberId: 1, service: "WhatsApp", color: "#25D366", letter: "W", from: "WhatsApp", body: "Your verification code is 884-209. Valid for 5 minutes.", code: "884209", time: "38 min ago", unread: false },
  { id: 4, numberId: 3, service: "Google", color: "#EA4335", letter: "G", from: "Google", body: "G-449201 is your Google verification code.", code: "449201", time: "1 hr ago", unread: false },
  { id: 5, numberId: 4, service: "Instagram", color: "#E1306C", letter: "I", from: "Instagram", body: "318 502 is your Instagram code. Don't share it.", code: "318502", time: "3 hr ago", unread: false },
  { id: 6, numberId: 3, service: "OpenAI", color: "#10A37F", letter: "O", from: "OpenAI", body: "Your OpenAI verification code is 026 774.", code: "026774", time: "5 hr ago", unread: false },
];

// Generated history so a private number genuinely has 100+ messages (proves the inbox at scale).
const _svcByName = Object.fromEntries(SERVICES.map((s) => [s.name, s]));
const _histTimes = ["Yesterday", "Yesterday", "2 days ago", "3 days ago", "4 days ago", "Jun 2", "Jun 1", "May 31", "May 30", "May 29", "May 28", "May 27", "May 26", "May 24"];
const _genInbox = () => {
  const pool = ["WhatsApp", "Telegram", "Google", "Instagram", "OpenAI", "Discord", "Uber", "TikTok"];
  const out = [];
  let id = 100;
  for (let i = 0; i < 132; i++) {
    const name = pool[(i * 3) % pool.length];
    const s = _svcByName[name];
    const code = String(Math.floor(100000 + Math.random() * 899999));
    const nid = i % 6 === 0 ? 3 : 1; // most land on the US private number, some on the PH private number
    out.push({ id: id++, numberId: nid, service: name, color: s.color, letter: s.letter, from: name, body: `Your ${name} code is ${code}. Don't share it with anyone.`, code, time: _histTimes[i % _histTimes.length], unread: false });
  }
  return out;
};
export const MESSAGES = [...MESSAGES_RECENT, ..._genInbox()];

// Outgoing SMS history (private numbers can send). Seeded examples; new sends are added at runtime.
export const SENT = [
  { id: 9001, numberId: 1, to: "+1 415 555 0199", body: "Hey! Here's the door code for tonight: 4821. See you at 7.", time: "1 hr ago", status: "delivered" },
  { id: 9002, numberId: 1, to: "+1 628 555 0142", body: "Running about 10 minutes late, sorry!", time: "Yesterday", status: "delivered" },
  { id: 9003, numberId: 1, to: "+44 7700 900 511", body: "Confirmed your booking for Saturday. Reply STOP to cancel.", time: "2 days ago", status: "delivered" },
  { id: 9004, numberId: 3, to: "+63 917 000 1122", body: "Salamat! Order received and on the way.", time: "3 days ago", status: "delivered" },
];

export const TRANSACTIONS = [
  { date: "2026-06-07", action: "Number purchase", amount: -0.85, desc: "WhatsApp · United States", status: 1 },
  { date: "2026-06-06", action: "Top up", amount: 25.00, desc: "Visa ···· 4242", status: 1 },
  { date: "2026-06-05", action: "Number purchase", amount: -0.60, desc: "Telegram · United Kingdom", status: 1 },
  { date: "2026-06-04", action: "Balance transfer", amount: -10.00, desc: "To 99310042118", status: 1 },
  { date: "2026-06-03", action: "Number purchase", amount: -0.45, desc: "Google · Philippines", status: 0 },
  { date: "2026-06-01", action: "Top up", amount: 50.00, desc: "MixPay · Binance Pay", status: 1 },
  { date: "2026-05-29", action: "Number purchase", amount: -1.10, desc: "OpenAI · India", status: 3 },
  { date: "2026-05-27", action: "Refund", amount: 0.45, desc: "Code not received · Google", status: 2 },
  { date: "2026-05-26", action: "Number purchase", amount: -0.70, desc: "Instagram · Indonesia", status: 1 },
  { date: "2026-05-24", action: "Balance transfer", amount: 15.00, desc: "From 16565956596", status: 1 },
  { date: "2026-05-22", action: "Top up", amount: 20.00, desc: "NOWPayments · USDT", status: 1 },
  { date: "2026-05-21", action: "Number purchase", amount: -0.55, desc: "Tinder · Germany", status: 1 },
  { date: "2026-05-19", action: "Number purchase", amount: -0.90, desc: "Discord · United States", status: 1 },
  { date: "2026-05-18", action: "Refund", amount: 0.55, desc: "Code not received · Tinder", status: 1 },
  { date: "2026-05-16", action: "Top up", amount: 30.00, desc: "Visa ···· 4242", status: 1 },
  { date: "2026-05-15", action: "Number purchase", amount: -0.40, desc: "Facebook · Brazil", status: 1 },
  { date: "2026-05-13", action: "Number purchase", amount: -1.25, desc: "Coinbase · United States", status: 0 },
  { date: "2026-05-11", action: "Balance transfer", amount: -8.00, desc: "To 33186655072", status: 1 },
  { date: "2026-05-10", action: "Number purchase", amount: -0.65, desc: "Telegram · Nigeria", status: 1 },
  { date: "2026-05-08", action: "Top up", amount: 40.00, desc: "MixPay · Bybit Pay", status: 1 },
  { date: "2026-05-06", action: "Number purchase", amount: -0.50, desc: "WhatsApp · Philippines", status: 1 },
  { date: "2026-05-05", action: "Number purchase", amount: -0.95, desc: "Uber · Mexico", status: 3 },
  { date: "2026-05-03", action: "Refund", amount: 0.95, desc: "Declined charge · Uber", status: 1 },
  { date: "2026-05-01", action: "Top up", amount: 25.00, desc: "NOWPayments · BTC", status: 1 },
  { date: "2026-04-29", action: "Number purchase", amount: -0.75, desc: "Signal · United Kingdom", status: 1 },
  { date: "2026-04-27", action: "Balance transfer", amount: 12.00, desc: "From 90241187340", status: 1 },
];

export const USER = { email: "alex.mercer@gmail.com", zedId: "48273910556", balance: 53.40, loginMethod: "email" };

// sign-in methods — accounts have no name/username; identity is email (or social) + generated ZEDSMS ID
export const LOGIN_METHODS = {
  email: { label: "Email & password", color: "#6B6F76" },
  google: { label: "Google", color: "#EA4335" },
  telegram: { label: "Telegram", color: "#229ED9" },
  apple: { label: "Apple", color: "#16171A" },
};
