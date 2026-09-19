export const NAV = [
  { section: null, items: [{ id: "home", label: "Overview", icon: "home" }] },
  { section: "Numbers", items: [
    { id: "numbers", label: "My Numbers", icon: "grid" },
    { id: "buy", label: "Buy Number", icon: "plus" },
  ] },
  { section: "Wallet", items: [
    { id: "topup", label: "Top Up", icon: "wallet" },
    { id: "transfer", label: "Transfer", icon: "transfer" },
    { id: "transactions", label: "Transactions", icon: "receipt" },
  ] },
  { section: "Account", items: [
    { id: "settings", label: "Settings", icon: "settings" },
  ] },
];

export const PAGE_TITLES = {
  home: "Overview", numbers: "My Numbers", buy: "Buy a Number",
  topup: "Top Up Balance", transfer: "Balance Transfer", transactions: "Transactions", settings: "Settings",
};
