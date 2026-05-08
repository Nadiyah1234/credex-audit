// All prices in USD per user per month
// Sources tracked in PRICING_DATA.md — update before submission

export const PRICING = {
  cursor: {
    hobby: { price: 0, label: 'Hobby (Free)' },
    pro: { price: 20, label: 'Pro' },
    business: { price: 40, label: 'Business' },
    enterprise: { price: null, label: 'Enterprise (custom)' },
  },
  github_copilot: {
    individual: { price: 10, label: 'Individual' },
    business: { price: 19, label: 'Business' },
    enterprise: { price: 39, label: 'Enterprise' },
  },
  claude: {
    free: { price: 0, label: 'Free' },
    pro: { price: 20, label: 'Pro' },
    max: { price: 100, label: 'Max' },
    team: { price: 30, label: 'Team' },
    enterprise: { price: null, label: 'Enterprise (custom)' },
    api_direct: { price: null, label: 'API Direct (usage-based)' },
  },
  chatgpt: {
    free: { price: 0, label: 'Free' },
    pro: { price: 20, label: 'Plus' },
    team: { price: 30, label: 'Team' },
    enterprise: { price: null, label: 'Enterprise (custom)' },
    api_direct: { price: null, label: 'API Direct (usage-based)' },
  },
  anthropic_api: {
    api_direct: { price: null, label: 'API Direct (usage-based)' },
  },
  openai_api: {
    api_direct: { price: null, label: 'API Direct (usage-based)' },
  },
  gemini: {
    free: { price: 0, label: 'Free' },
    pro: { price: 19.99, label: 'Google One AI Premium' },
    ultra: { price: null, label: 'Ultra (custom)' },
    api_direct: { price: null, label: 'API Direct (usage-based)' },
  },
  windsurf: {
    free: { price: 0, label: 'Free' },
    pro: { price: 15, label: 'Pro' },
    team: { price: 35, label: 'Team' },
  },
};