export const qpsQuestions = {
  presence: {
    key: "presence",
    name: "Quiet Presence",
    tag: "P",
    tagline: "How people feel when they interact with the business.",
    introOwner:
      "We look at whether people feel comfortable, at ease and aligned when they interact with your brand or space.",
    introClient:
      "We look at whether you feel comfortable, at ease and aligned when you interact with this brand or space.",
    questions: [
      { id: "P1", you: "Do people feel comfortable approaching you when they need something?", client: "Do you feel comfortable approaching them when you need something?" },
      { id: "P2", you: "After interacting with you, do people seem more at ease than when they arrived?", client: "After interacting with them, did you feel more at ease?" },
      { id: "P3", you: "In difficult situations, do people feel they can approach you calmly?", client: "In difficult situations, did you feel you could approach them calmly?" },
      { id: "P4", you: "When something important happens, do people reach out to you without hesitation?", client: "When something important happened, did you reach out to them without hesitation?" },
      { id: "P5", you: "When people talk about your business, do they describe it in similar ways?", client: "When people talk about this business, do they describe it in similar ways?" }
    ]
  },
  digital: {
    key: "digital",
    name: "Quiet Digital",
    tag: "D",
    tagline: "How the business comes across online.",
    introOwner:
      "We look at what your brand quietly says when people search, scroll or click your website, profiles and key online touchpoints – and whether the digital layer matches the feeling you promise.",
    introClient:
      "We look at what this brand quietly communicates to you when you search, scroll or click their website, profiles and key online touchpoints – and whether it matches the feeling they promise.",
    questions: [
      { id: "D1", you: "When people visit your online presence, do they understand what your business offers?", client: "When you visited their online presence, did you understand what they offer?" },
      { id: "D2", you: "Does your online presence give people the same impression as real life?", client: "Did their online presence give you the same impression as real life?" },
      { id: "D3", you: "Do people give your business positive feedback about your online presence?", client: "Did you feel positive about their online presence overall?" },
      { id: "D4", you: "Can visitors easily find the information they need online?", client: "Could you easily find the information you needed online?" },
      { id: "D5", you: "Do your online channels look and feel consistent with each other?", client: "Did their online channels look and feel consistent with each other?" }
    ]
  },
  space: {
    key: "space",
    name: "Quiet Space",
    tag: "S",
    tagline: "How the physical space feels and flows.",
    introOwner:
      "We look at whether your physical space feels comfortable, cared for and easy to move through – so people can relax into the experience you offer.",
    introClient:
      "We look at whether their physical space feels comfortable, cared for and easy to move through – so you can relax into the experience they offer.",
    questions: [
      { id: "S1", you: "When people enter your space, do they feel comfortable right away?", client: "When you entered their space, did you feel comfortable right away?" },
      { id: "S2", you: "Can people find their way without much guidance?", client: "Could you find your way without much guidance?" },
      { id: "S3", you: "Do people notice thoughtful details in your space?", client: "Did you notice thoughtful details in their space?" },
      { id: "S4", you: "Does your space reflect what your business stands for?", client: "Did their space feel aligned with what they say they stand for?" },
      { id: "S5", you: "Do people stay longer because they feel comfortable in your space?", client: "Did you stay longer than expected because the space felt comfortable?" }
    ]
  },
  narrative: {
    key: "narrative",
    name: "Quiet Narrative",
    tag: "N",
    tagline: "How clearly the story is told.",
    introOwner:
      "We look at how clearly and consistently you communicate what you do, why it matters and who it is for – across words, visuals and everyday conversations.",
    introClient:
      "We look at how clearly and consistently they communicate what they do, why it matters and who it is for – across words, visuals and everyday conversations.",
    questions: [
      { id: "N1", you: "When you explain your work, do people understand why it matters?", client: "When they explain their work, do you understand why it matters?" },
      { id: "N2", you: "Do you communicate the same core story everywhere?", client: "Do they communicate the same core story across channels?" },
      { id: "N3", you: "Do people describe your business in a way that matches how you see it?", client: "Do you describe their business in a way that matches how they see it?" },
      { id: "N4", you: "Can people explain your business after hearing it once?", client: "Could you explain their business after hearing it once?" },
      { id: "N5", you: "Do people get the experience they expected from your story?", client: "Did the experience you had match the story they communicated?" }
    ]
  },
  signature: {
    key: "signature",
    name: "Quiet Signature",
    tag: "G",
    tagline: "What people remember and come back for.",
    introOwner:
      "We look at the distinct details, habits and touches that people quietly associate with your brand – the things they'd miss if they disappeared.",
    introClient:
      "We look at the distinct details, habits and touches you quietly associate with this brand – the things you'd miss if they disappeared.",
    questions: [
      { id: "G1", you: "Do people remember one clear thing that stands out as 'you'?", client: "Do you remember one clear thing that stands out as 'them'?" },
      { id: "G2", you: "Do you deliver something so consistently that people would notice if it disappeared?", client: "Do they deliver something so consistently that you would notice if it disappeared?" },
      { id: "G3", you: "Is there something people look forward to because it is uniquely yours?", client: "Is there something you look forward to because it is uniquely theirs?" },
      { id: "G4", you: "Do others try to copy you but can't fully recreate the feeling?", client: "Do others seem to copy them but can't fully recreate the feeling?" },
      { id: "G5", you: "Do people return or recommend you because of a distinct detail or feeling?", client: "Did you return or recommend them because of a distinct detail or feeling?" }
    ]
  }
};

export const orderedPillars = ["presence", "digital", "space", "narrative", "signature"];

export const PILLAR_WEIGHTS = {
  presence: 1,
  digital: 1,
  space: 1,
  narrative: 1,
  signature: 1
};

export const ANSWER_SCORES = {
  yes: 4,
  maybe: 2,
  no: 0
};

export const GHI_INDICATORS = [
  "Retention",
  "Pricing Power",
  "Penetration",
  "Share of Search",
  "Lifetime Value vs. Cost to Acquire",
  "Referrals & Advocacy",
  "Conversion Efficiency",
  "Experience Consistency",
  "Frictionless Access",
  "Desire to Stay"
];

export const GI_DESC = {
  "Retention": "Do people come back again and again, or do you constantly need new ones?",
  "Pricing Power": "Can you charge fair value without heavy discounting or pushback?",
  "Penetration": "How many people choose you among the options they have?",
  "Share of Search": "Are people actively looking for you by name or searching for you?",
  "Lifetime Value vs. Cost to Acquire": "Is each customer worth more over time than it costs to win them?",
  "Referrals & Advocacy": "Do people recommend you and talk positively about you to others?",
  "Conversion Efficiency": "Once people find you, do they actually take action – book, buy or contact?",
  "Experience Consistency": "Is the quality of your experience similar wherever people meet you?",
  "Frictionless Access": "Is it easy and fast for people to get what they want from you?",
  "Desire to Stay": "Do people want to linger, browse more and stay connected – not just transact?"
};

export const GI_MAP = [
  { name: "Retention", map: ["P2","S5","G5"] },
  { name: "Pricing Power", map: ["D3","N5","G4"] },
  { name: "Penetration", map: ["D1","N1","S1"] },
  { name: "Share of Search", map: ["D1","D5","N1"] },
  { name: "Lifetime Value vs. Cost to Acquire", map: ["D4","N3","N5"] },
  { name: "Referrals & Advocacy", map: ["P5","G2","N2"] },
  { name: "Conversion Efficiency", map: ["D4","N3"] },
  { name: "Experience Consistency", map: ["N2","G3","P3"] },
  { name: "Frictionless Access", map: ["D4","S2"] },
  { name: "Desire to Stay", map: ["S5","G5"] }
];

export const ROLE_LABELS = {
  owner: "You – brand / business owner",
  client1: "Client 1",
  client2: "Client 2",
  client3: "Client 3"
};

export const GHI_TOP_SOURCES = [
  {
    label: "Ehrenberg-Bass · Better Brand Health",
    url: "https://marketingscience.info/better-brand-health/"
  },
  {
    label: "McKinsey · Experience-led growth",
    url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/experience-led-growth-a-new-way-to-create-value"
  }
];

export const GHI_CARD_CONTENT = [
  {
    base: "Retention",
    title: "Retention (do people come back?)",
    description: "If people return again and again, your business is healthy. If not, you spend more to replace them.",
    consequence: "Consequence: Low retention = constant spend to replace lost customers.",
    sources: [
      {
        label: "Customer Retention – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Customer_retention"
      }
    ]
  },
  {
    base: "Pricing Power",
    title: "Pricing Power (can you charge fair value without pushback?)",
    description: "A strong brand lets you charge what you're worth instead of being forced to discount.",
    consequence: "Consequence: Weak pricing = money left on the table.",
    sources: [
      {
        label: "Pricing Power – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Pricing_power"
      }
    ]
  },
  {
    base: "Penetration",
    title: "Penetration (how many people choose you?)",
    description: "Growth comes from more people buying from you, not just loyal ones buying more.",
    consequence: "Consequence: Low penetration = stalled growth.",
    sources: [
      {
        label: "Market Penetration – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Market_penetration"
      }
    ]
  },
  {
    base: "Share of Search",
    title: "Share of Search (are people looking for you?)",
    description: "If more people search for you online, sales usually follow.",
    consequence: "Consequence: Low search = competitors win attention first.",
    sources: [
      {
        label: "Market Share – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Market_share"
      }
    ]
  },
  {
    base: "Lifetime Value vs. Cost to Acquire",
    title: "Lifetime Value vs. Cost to Acquire (is each customer worth more than it costs to win them?)",
    description: "Healthy brands get more money from each customer than they spend to attract them.",
    consequence: "Consequence: CAC > LTV = every sale costs you.",
    sources: [
      {
        label: "Customer Lifetime Value – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Customer_lifetime_value"
      }
    ]
  },
  {
    base: "Referrals & Advocacy",
    title: "Referrals & Advocacy (do people recommend you?)",
    description: "People telling others about you is free advertising.",
    consequence: "Consequence: Low referrals = higher paid media costs.",
    sources: [
      {
        label: "Net Promoter Score – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Net_Promoter"
      }
    ]
  },
  {
    base: "Conversion Efficiency",
    title: "Conversion Efficiency (do people act once they find you?)",
    description: "Healthy brands make it easy to act — contact, book, or buy.",
    consequence: "Consequence: Poor conversion = lost revenue at the finish line.",
    sources: [
      {
        label: "Conversion Marketing – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Conversion_marketing"
      }
    ]
  },
  {
    base: "Experience Consistency",
    title: "Experience Consistency (is it the same quality everywhere?)",
    description: "If the brand feels the same across every touchpoint, people trust it more.",
    consequence: "Consequence: Inconsistent delivery = eroded trust and price pressure.",
    sources: [
      {
        label: "Customer Experience – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Customer_experience"
      }
    ]
  },
  {
    base: "Frictionless Access",
    title: "Frictionless Access (is it easy and fast to get what they want?)",
    description: "Every extra step or delay makes people leave.",
    consequence: "Consequence: Friction = fewer actions taken.",
    sources: [
      {
        label: "Usability – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Usability"
      }
    ]
  },
  {
    base: "Desire to Stay",
    title: "Desire to Stay (do people want to linger, not just transact?)",
    description: "If people want to spend more time with you, they're more likely to buy more and return again.",
    consequence: "Consequence: Low dwell = fewer add-on sales and repeat visits.",
    sources: [
      {
        label: "Customer Engagement – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Customer_engagement"
      }
    ]
  }
];

