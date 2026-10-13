// Editorial content: solutions, FAQs and guides.
// Written to be accurate in general terms; nothing here commits the business to a
// price, warranty period or service it has not confirmed.

export interface Solution {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  image: string;
  intro: string[];
  needs: { title: string; text: string }[];
  typical: { label: string; value: string }[];
  categories: string[];
}

export const solutions: Solution[] = [
  {
    slug: "residential",
    name: "Home Solar & Backup",
    eyebrow: "Residential",
    summary: "Quiet, clean power for lights, fans, TVs, fridges and more, day and night.",
    image: "/images/site/hero-home-night.webp",
    intro: [
      "Most homes in Aba depend on a mix of grid supply and petrol generators. A solar system with lithium storage replaces generator noise, fumes and fuel runs with silent, automatic power.",
      "We size every home system around the appliances you actually use, so you are not paying for capacity you do not need.",
    ],
    needs: [
      { title: "Uninterrupted evenings", text: "Battery storage keeps lights, fans and entertainment running through outages and overnight." },
      { title: "Lower running costs", text: "Solar charging during the day cuts generator fuel and electricity bills." },
      { title: "Room to grow", text: "Add batteries or panels later as your household's needs grow." },
    ],
    typical: [
      { label: "Typical inverter", value: "5kVA hybrid" },
      { label: "Typical storage", value: "5–10kWh LiFePO4" },
      { label: "Typical array", value: "6–10 panels" },
    ],
    categories: ["inverters", "lithium-batteries", "solar-panels"],
  },
  {
    slug: "business",
    name: "Shops, Offices & SMEs",
    eyebrow: "Small business",
    summary: "Keep tills, lighting, cold rooms and machines running through every outage.",
    image: "/images/site/product-family.webp",
    intro: [
      "For traders, offices and workshops, every hour without power is lost sales. Solar with lithium storage gives you predictable power and frees you from daily fuel costs.",
      "We help you work out the load that matters most to your business and build a system around it.",
    ],
    needs: [
      { title: "Business continuity", text: "Automatic switchover keeps POS terminals, computers and lighting on." },
      { title: "Predictable costs", text: "Replace variable diesel and petrol spending with energy you generate yourself." },
      { title: "Scalable systems", text: "7.5kVA and 10kVA inverters, plus parallel-capable batteries, for heavier loads." },
    ],
    typical: [
      { label: "Typical inverter", value: "5–10kVA" },
      { label: "Typical storage", value: "10–15kWh+" },
      { label: "Typical array", value: "10–20 panels" },
    ],
    categories: ["inverters", "lithium-batteries", "solar-panels"],
  },
  {
    slug: "commercial",
    name: "Commercial & Institutional",
    eyebrow: "Commercial",
    summary: "Larger systems for schools, clinics, churches, hotels and commercial buildings.",
    image: "/images/site/commercial-rooftop.webp",
    intro: [
      "Institutions need power they can rely on, often for critical equipment. Larger solar arrays with parallel inverters and battery banks deliver resilient, low-running-cost energy.",
      "Talk to us early in your planning. We will help you scope the load and plan a system that can be expanded in stages.",
    ],
    needs: [
      { title: "Resilience for critical loads", text: "Keep medical equipment, servers and security systems powered." },
      { title: "Parallel expansion", text: "Combine inverters and up to 16 battery packs in parallel as demand grows." },
      { title: "High-output panels", text: "550–650W modules maximise generation on large rooftops." },
    ],
    typical: [
      { label: "Typical inverter", value: "10kVA+ in parallel" },
      { label: "Typical storage", value: "30kWh+" },
      { label: "Typical array", value: "Sized to site" },
    ],
    categories: ["inverters", "lithium-batteries", "solar-panels"],
  },
];

export const faqs: { q: string; a: string; group: string }[] = [
  {
    group: "Buying",
    q: "Do you sell genuine Africell products?",
    a: "Yes. We are an independent Aba business and source our Africell products directly from Africell Energy Solar. Every product we sell comes from that supply chain.",
  },
  {
    group: "Buying",
    q: "Why don't you show prices online?",
    a: "Solar equipment prices move with exchange rates and shipping costs, so we quote current prices on request. Send us a quote request or message us on WhatsApp and we will respond with up-to-date pricing.",
  },
  {
    group: "Buying",
    q: "Can I visit the showroom?",
    a: "Yes, you are welcome to visit us in Aba to see the products and talk to our team. Our address and opening hours are on the Contact page.",
  },
  {
    group: "Choosing a system",
    q: "What size inverter do I need?",
    a: "It depends on the total power of the appliances you want to run at the same time. Most homes are well served by a 5kVA inverter; larger homes and businesses may need 7.5kVA or 10kVA. Try our sizing guide for an estimate, then talk to us to confirm.",
  },
  {
    group: "Choosing a system",
    q: "How long will a lithium battery power my home?",
    a: "Divide the battery's usable energy by your load. For example, a 5.12kWh battery running a 500W load (lights, fans, TV and a fridge) lasts roughly 9–10 hours. Real results vary with your appliances and how much the battery is charged.",
  },
  {
    group: "Choosing a system",
    q: "Why LiFePO4 instead of lead-acid (tubular) batteries?",
    a: "LiFePO4 batteries last far more cycles, can be discharged more deeply, charge faster and need no maintenance. They cost more upfront but usually work out cheaper over the life of the system.",
  },
  {
    group: "Choosing a system",
    q: "Can I add more batteries or panels later?",
    a: "Yes. HY Series batteries support up to 16 packs in parallel, and arrays can be extended within the limits of your inverter. We will help you plan for future expansion.",
  },
  {
    group: "After-sales",
    q: "What warranty comes with your products?",
    a: "Warranty terms depend on the product and are confirmed in writing on your invoice at the time of purchase. Ask our team for the warranty details of any product before you buy.",
  },
  {
    group: "After-sales",
    q: "Do you help with installation?",
    a: "Talk to us about your installation needs. Correct installation, especially battery settings and cabling, is essential for safety and for your warranty.",
  },
];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  image: string;
  body: { heading?: string; text: string }[];
}

export const articles: Article[] = [
  {
    slug: "how-to-choose-inverter-size",
    title: "How to choose the right inverter size for your home",
    excerpt: "kVA, watts and surge loads explained, with a simple method you can use before you speak to an installer.",
    date: "2026-10-01",
    readMinutes: 5,
    image: "/images/site/product-family.webp",
    body: [
      { text: "Your inverter decides how much you can run at the same time. Too small and it trips when the fridge and pumping machine start together. Too large and you have paid for capacity you will never use." },
      { heading: "Step 1: list what must run together", text: "Write down the appliances you want powered during an outage and their wattage. It is usually on a label on the back or underside. A typical list might be LED lights (10W each), ceiling fans (70W each), a TV (100W), a fridge (150W) and a laptop (65W)." },
      { heading: "Step 2: add the running load", text: "Add the wattage of everything that could be on at the same time. This is your running load. A comfortable home setup often lands between 800W and 2,500W." },
      { heading: "Step 3: allow for surges and headroom", text: "Motors in fridges, freezers, pumps and air conditioners draw several times their rated power for a moment when they start. Add headroom of around 25%, and remember that kVA is not the same as kW. Many inverters deliver about 0.8kW per kVA, so a 5kVA inverter is roughly a 4kW inverter." },
      { heading: "A rule of thumb", text: "For most homes without air conditioning, a 5kVA hybrid inverter is a good fit. Homes with several air conditioners, or businesses with motors and machines, should look at 7.5kVA or 10kVA, or parallel units." },
      { heading: "Get it confirmed", text: "Use our sizing guide for an estimate, then let our team review your list. Getting the size right first time saves money and protects your equipment." },
    ],
  },
  {
    slug: "lifepo4-vs-lead-acid",
    title: "LiFePO4 vs lead-acid batteries: what Nigerian homeowners should know",
    excerpt: "Why lithium iron phosphate has become the preferred choice for solar storage, and when it is worth the higher upfront cost.",
    date: "2026-09-18",
    readMinutes: 4,
    image: "/images/products/hy-300-main.webp",
    body: [
      { text: "For years, tubular lead-acid batteries were the default for inverter systems in Nigeria. Lithium iron phosphate (LiFePO4) batteries now offer a better long-term deal for most solar users." },
      { heading: "Usable capacity", text: "Lead-acid batteries should not be routinely discharged below about 50% if you want them to last. LiFePO4 batteries like the HY Series are rated for 95% or more depth of discharge, so you can use nearly all the energy you paid for." },
      { heading: "Lifespan", text: "A good lead-acid battery may give several hundred cycles in daily use. The HY Series is rated for at least 6,000 cycles at 80% depth of discharge, which is many years of daily cycling." },
      { heading: "Maintenance and safety", text: "LiFePO4 batteries are sealed, need no topping-up and are among the most thermally stable lithium chemistries. A built-in BMS protects against over-charge, over-discharge and temperature extremes." },
      { heading: "The cost question", text: "Lithium costs more upfront. Measured per kWh delivered over the battery's life, it is usually far cheaper, because you replace it much less often and get more usable energy from every cycle." },
    ],
  },
  {
    slug: "how-many-solar-panels",
    title: "How many solar panels do you need?",
    excerpt: "A practical way to estimate your array size from your daily energy use and Aba's sunshine.",
    date: "2026-09-05",
    readMinutes: 4,
    image: "/images/site/rooftop-panels.webp",
    body: [
      { text: "The number of panels you need depends on how much energy you use in a day, not on the size of your inverter alone." },
      { heading: "Step 1: estimate daily energy", text: "Multiply each appliance's wattage by the hours it runs per day, then add them up. For example, a 150W fridge running for an effective 10 hours uses 1,500Wh, or 1.5kWh." },
      { heading: "Step 2: account for sunshine", text: "South-East Nigeria typically receives around 4 to 5 peak sun hours a day, averaged over the year, with less in the rainy season. Real systems also lose energy to heat, dust, cabling and conversion, so allow roughly 25% for losses." },
      { heading: "Step 3: do the sum", text: "Required array (W) ≈ daily energy (Wh) ÷ (peak sun hours × 0.75). A home using 6kWh a day needs about 6,000 ÷ (4.5 × 0.75) ≈ 1,800W of panels: four 450W panels, or three or four 550W panels." },
      { heading: "Check your roof", text: "Higher-wattage panels need fewer mounting points but are physically larger. We will help you choose the combination that fits your roof and your inverter's input limits." },
    ],
  },
];

/** Product shots sit on white and must be contained; lifestyle photos can fill the frame. */
export const articleImageClass = (src: string) =>
  src.includes("/products/") ? "object-contain mix-blend-multiply p-6" : "object-cover";
