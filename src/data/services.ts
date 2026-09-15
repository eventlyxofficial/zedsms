export type Service = {
  id: string;
  name: string;
  /** Simple Icons slug (https://simpleicons.org) used to build the logo URL below. */
  slug: string;
  category: string;
};

// Real-world services a shared/verification number gets used with. Icons are served from
// the Simple Icons CDN by slug (https://cdn.simpleicons.org/<slug>) so we don't have to vendor
// 120+ brand logos as local assets. Add/remove entries here — the UI just maps over this list.
export const services: Service[] = [
  // Messaging
  { id: "whatsapp", name: "WhatsApp", slug: "whatsapp", category: "Messaging" },
  { id: "telegram", name: "Telegram", slug: "telegram", category: "Messaging" },
  { id: "signal", name: "Signal", slug: "signal", category: "Messaging" },
  { id: "viber", name: "Viber", slug: "viber", category: "Messaging" },
  { id: "line", name: "LINE", slug: "line", category: "Messaging" },
  { id: "wechat", name: "WeChat", slug: "wechat", category: "Messaging" },
  { id: "messenger", name: "Messenger", slug: "messenger", category: "Messaging" },
  { id: "discord", name: "Discord", slug: "discord", category: "Messaging" },
  { id: "slack", name: "Slack", slug: "slack", category: "Messaging" },
  { id: "skype", name: "Skype", slug: "skype", category: "Messaging" },
  { id: "kakaotalk", name: "KakaoTalk", slug: "kakaotalk", category: "Messaging" },
  { id: "googlechat", name: "Google Chat", slug: "googlechat", category: "Messaging" },
  { id: "mattermost", name: "Mattermost", slug: "mattermost", category: "Messaging" },
  { id: "threema", name: "Threema", slug: "threema", category: "Messaging" },

  // Social
  { id: "facebook", name: "Facebook", slug: "facebook", category: "Social" },
  { id: "instagram", name: "Instagram", slug: "instagram", category: "Social" },
  { id: "x", name: "X (Twitter)", slug: "x", category: "Social" },
  { id: "tiktok", name: "TikTok", slug: "tiktok", category: "Social" },
  { id: "snapchat", name: "Snapchat", slug: "snapchat", category: "Social" },
  { id: "reddit", name: "Reddit", slug: "reddit", category: "Social" },
  { id: "pinterest", name: "Pinterest", slug: "pinterest", category: "Social" },
  { id: "linkedin", name: "LinkedIn", slug: "linkedin", category: "Social" },
  { id: "tumblr", name: "Tumblr", slug: "tumblr", category: "Social" },
  { id: "mastodon", name: "Mastodon", slug: "mastodon", category: "Social" },
  { id: "threads", name: "Threads", slug: "threads", category: "Social" },
  { id: "vk", name: "VK", slug: "vk", category: "Social" },
  { id: "quora", name: "Quora", slug: "quora", category: "Social" },
  { id: "clubhouse", name: "Clubhouse", slug: "clubhouse", category: "Social" },
  { id: "flickr", name: "Flickr", slug: "flickr", category: "Social" },
  { id: "meetup", name: "Meetup", slug: "meetup", category: "Social" },
  { id: "bumble", name: "Bumble", slug: "bumble", category: "Social" },
  { id: "tinder", name: "Tinder", slug: "tinder", category: "Social" },
  { id: "okcupid", name: "OkCupid", slug: "okcupid", category: "Social" },

  // Search / Google & Microsoft ecosystem
  { id: "google", name: "Google", slug: "google", category: "Tech" },
  { id: "google-voice", name: "Google Voice", slug: "google", category: "Tech" },
  { id: "google-workspace", name: "Google Workspace", slug: "googleworkspace", category: "Tech" },
  { id: "gmail", name: "Gmail", slug: "gmail", category: "Email" },
  { id: "google-drive", name: "Google Drive", slug: "googledrive", category: "Tech" },
  { id: "google-maps", name: "Google Maps", slug: "googlemaps", category: "Tech" },
  { id: "google-pay", name: "Google Pay", slug: "googlepay", category: "Finance" },
  { id: "google-meet", name: "Google Meet", slug: "googlemeet", category: "Productivity" },
  { id: "youtube", name: "YouTube", slug: "youtube", category: "Entertainment" },
  { id: "microsoft", name: "Microsoft", slug: "microsoft", category: "Tech" },
  { id: "microsoft-teams", name: "Microsoft Teams", slug: "microsoftteams", category: "Productivity" },
  { id: "outlook", name: "Outlook", slug: "microsoftoutlook", category: "Email" },
  { id: "onedrive", name: "OneDrive", slug: "microsoftonedrive", category: "Tech" },
  { id: "xbox", name: "Xbox", slug: "xbox", category: "Gaming" },
  { id: "office", name: "Microsoft Office", slug: "microsoftoffice", category: "Productivity" },

  // Apple ecosystem
  { id: "apple", name: "Apple", slug: "apple", category: "Tech" },
  { id: "apple-id", name: "Apple ID", slug: "apple", category: "Tech" },
  { id: "icloud", name: "iCloud", slug: "icloud", category: "Tech" },
  { id: "app-store", name: "App Store", slug: "appstore", category: "Tech" },
  { id: "apple-music", name: "Apple Music", slug: "applemusic", category: "Entertainment" },
  { id: "apple-pay", name: "Apple Pay", slug: "applepay", category: "Finance" },

  // Dev / productivity
  { id: "github", name: "GitHub", slug: "github", category: "Developer" },
  { id: "gitlab", name: "GitLab", slug: "gitlab", category: "Developer" },
  { id: "bitbucket", name: "Bitbucket", slug: "bitbucket", category: "Developer" },
  { id: "notion", name: "Notion", slug: "notion", category: "Productivity" },
  { id: "trello", name: "Trello", slug: "trello", category: "Productivity" },
  { id: "asana", name: "Asana", slug: "asana", category: "Productivity" },
  { id: "jira", name: "Jira", slug: "jira", category: "Productivity" },
  { id: "confluence", name: "Confluence", slug: "confluence", category: "Productivity" },
  { id: "figma", name: "Figma", slug: "figma", category: "Productivity" },
  { id: "canva", name: "Canva", slug: "canva", category: "Productivity" },
  { id: "dropbox", name: "Dropbox", slug: "dropbox", category: "Tech" },
  { id: "zoom", name: "Zoom", slug: "zoom", category: "Productivity" },
  { id: "evernote", name: "Evernote", slug: "evernote", category: "Productivity" },
  { id: "todoist", name: "Todoist", slug: "todoist", category: "Productivity" },
  { id: "airtable", name: "Airtable", slug: "airtable", category: "Productivity" },
  { id: "monday", name: "monday.com", slug: "mondaydotcom", category: "Productivity" },
  { id: "clickup", name: "ClickUp", slug: "clickup", category: "Productivity" },
  { id: "miro", name: "Miro", slug: "miro", category: "Productivity" },
  { id: "loom", name: "Loom", slug: "loom", category: "Productivity" },
  { id: "wordpress", name: "WordPress", slug: "wordpress", category: "Developer" },
  { id: "wix", name: "Wix", slug: "wix", category: "Developer" },
  { id: "squarespace", name: "Squarespace", slug: "squarespace", category: "Developer" },

  // Email
  { id: "yahoo", name: "Yahoo", slug: "yahoo", category: "Email" },
  { id: "protonmail", name: "Proton Mail", slug: "protonmail", category: "Email" },
  { id: "zoho", name: "Zoho Mail", slug: "zoho", category: "Email" },
  { id: "aol", name: "AOL", slug: "aol", category: "Email" },

  // Finance
  { id: "paypal", name: "PayPal", slug: "paypal", category: "Finance" },
  { id: "stripe", name: "Stripe", slug: "stripe", category: "Finance" },
  { id: "venmo", name: "Venmo", slug: "venmo", category: "Finance" },
  { id: "cashapp", name: "Cash App", slug: "cashapp", category: "Finance" },
  { id: "wise", name: "Wise", slug: "wise", category: "Finance" },
  { id: "revolut", name: "Revolut", slug: "revolut", category: "Finance" },
  { id: "coinbase", name: "Coinbase", slug: "coinbase", category: "Finance" },
  { id: "binance", name: "Binance", slug: "binance", category: "Finance" },
  { id: "americanexpress", name: "American Express", slug: "americanexpress", category: "Finance" },
  { id: "visa", name: "Visa", slug: "visa", category: "Finance" },
  { id: "mastercard", name: "Mastercard", slug: "mastercard", category: "Finance" },
  { id: "robinhood", name: "Robinhood", slug: "robinhood", category: "Finance" },

  // Shopping
  { id: "amazon", name: "Amazon", slug: "amazon", category: "Shopping" },
  { id: "ebay", name: "eBay", slug: "ebay", category: "Shopping" },
  { id: "etsy", name: "Etsy", slug: "etsy", category: "Shopping" },
  { id: "shopify", name: "Shopify", slug: "shopify", category: "Shopping" },
  { id: "walmart", name: "Walmart", slug: "walmart", category: "Shopping" },
  { id: "aliexpress", name: "AliExpress", slug: "aliexpress", category: "Shopping" },
  { id: "alibaba", name: "Alibaba", slug: "alibaba", category: "Shopping" },
  { id: "target", name: "Target", slug: "target", category: "Shopping" },

  // Travel & delivery
  { id: "uber", name: "Uber", slug: "uber", category: "Travel" },
  { id: "uber-eats", name: "Uber Eats", slug: "ubereats", category: "Delivery" },
  { id: "lyft", name: "Lyft", slug: "lyft", category: "Travel" },
  { id: "airbnb", name: "Airbnb", slug: "airbnb", category: "Travel" },
  { id: "booking", name: "Booking.com", slug: "bookingdotcom", category: "Travel" },
  { id: "expedia", name: "Expedia", slug: "expedia", category: "Travel" },
  { id: "tripadvisor", name: "Tripadvisor", slug: "tripadvisor", category: "Travel" },
  { id: "doordash", name: "DoorDash", slug: "doordash", category: "Delivery" },
  { id: "grubhub", name: "Grubhub", slug: "grubhub", category: "Delivery" },
  { id: "deliveroo", name: "Deliveroo", slug: "deliveroo", category: "Delivery" },
  { id: "instacart", name: "Instacart", slug: "instacart", category: "Delivery" },

  // Entertainment
  { id: "netflix", name: "Netflix", slug: "netflix", category: "Entertainment" },
  { id: "spotify", name: "Spotify", slug: "spotify", category: "Entertainment" },
  { id: "twitch", name: "Twitch", slug: "twitch", category: "Entertainment" },
  { id: "hulu", name: "Hulu", slug: "hulu", category: "Entertainment" },
  { id: "disneyplus", name: "Disney+", slug: "disneyplus", category: "Entertainment" },
  { id: "primevideo", name: "Prime Video", slug: "primevideo", category: "Entertainment" },
  { id: "soundcloud", name: "SoundCloud", slug: "soundcloud", category: "Entertainment" },
  { id: "pandora", name: "Pandora", slug: "pandora", category: "Entertainment" },
  { id: "vimeo", name: "Vimeo", slug: "vimeo", category: "Entertainment" },

  // Gaming
  { id: "steam", name: "Steam", slug: "steam", category: "Gaming" },
  { id: "epicgames", name: "Epic Games", slug: "epicgames", category: "Gaming" },
  { id: "playstation", name: "PlayStation", slug: "playstation", category: "Gaming" },
  { id: "nintendo", name: "Nintendo", slug: "nintendo", category: "Gaming" },
  { id: "ea", name: "EA", slug: "ea", category: "Gaming" },
  { id: "riotgames", name: "Riot Games", slug: "riotgames", category: "Gaming" },
  { id: "roblox", name: "Roblox", slug: "roblox", category: "Gaming" },

  // Business / support
  { id: "mailchimp", name: "Mailchimp", slug: "mailchimp", category: "Business" },
  { id: "hubspot", name: "HubSpot", slug: "hubspot", category: "Business" },
  { id: "salesforce", name: "Salesforce", slug: "salesforce", category: "Business" },
  { id: "zendesk", name: "Zendesk", slug: "zendesk", category: "Business" },
  { id: "intercom", name: "Intercom", slug: "intercom", category: "Business" },
  { id: "docusign", name: "DocuSign", slug: "docusign", category: "Business" },
];
