import type { Category } from "../../src/data/types.ts";

// Source: product data published on africellsolar.com (Africell Energy Solar, Lagos),
// cleaned up and restructured. Values the supplier has not published, or that were
// internally inconsistent on the source site, are left as null ("to be confirmed")
// rather than guessed. Availability defaults to "enquire" until the inventory system
// feeds real stock status.

const P = "/images/products";

export const categories: Category[] = [
  {
    slug: "inverters",
    name: "Inverters",
    singular: "Inverter",
    short: "Hybrid and commercial inverters from 5kVA to 10kVA.",
    description:
      "The heart of every solar system. Africell hybrid inverters combine solar charging, battery management and grid/generator input in one wall-mounted unit, for homes, shops and commercial premises.",
    image: `${P}/inverter-hybrid.webp`,
    pairsWith: ["lithium-batteries", "solar-panels"],
    series: [
      {
        slug: "premium-hybrid-inverters",
        name: "Premium Hybrid Inverter Range",
        tagline: "Residential and commercial power from 5kVA to 10kVA",
        overview: [
          "The Africell Premium range covers the most common power needs in Nigerian homes and businesses: 5kVA for households and small offices, and 7.5kVA and 10kVA for larger homes, shops and commercial premises.",
          "Hybrid operation means one unit manages your solar panels, your battery bank and grid or generator input, switching automatically so your power stays on.",
        ],
        features: [
          { title: "Built-in MPPT solar charging", text: "An integrated MPPT charge controller harvests the maximum available energy from your solar panels." },
          { title: "Parallel expansion", text: "The 5kVA model supports up to 12 units in parallel, so capacity can grow with your needs." },
          { title: "Hybrid operation", text: "Works with solar, battery and grid or generator input, prioritising solar to cut fuel and electricity costs." },
          { title: "Wall-mounted design", text: "A clean, compact cabinet with an LCD display for at-a-glance status." },
        ],
        applications: ["Homes and apartments", "Shops and offices", "Schools, clinics and churches", "Commercial premises"],
        gallery: [`${P}/inverter-hybrid.webp`],
        specStatus: "pending",
        specNote:
          "Full electrical datasheets for this range are being confirmed with the manufacturer. Ask our team for the complete specification before you buy.",
        specs: [
          {
            title: "Overview",
            rows: [
              { label: "Rated power", value: ["5 kVA", "7.5 kVA", "10 kVA"] },
              { label: "Type", value: ["Hybrid", "Hybrid", "Hybrid"] },
              { label: "Intended use", value: ["Residential & commercial", "Commercial", "Commercial"] },
              { label: "Solar charge controller", value: ["Built-in MPPT", null, null] },
              { label: "Parallel operation", value: ["Up to 12 units", null, null] },
            ],
          },
          {
            title: "Electrical",
            rows: [
              { label: "Battery voltage", value: null },
              { label: "Max. PV input voltage", value: null },
              { label: "Max. solar charging current", value: null },
              { label: "Output waveform", value: null },
            ],
          },
        ],
        downloads: [],
        products: [
          {
            slug: "5kva-hybrid-inverter",
            name: "5kVA Hybrid Inverter",
            chips: ["5 kVA", "Hybrid", "Built-in MPPT", "Up to 12× parallel"],
            facets: { powerKva: 5 },
            image: `${P}/inverter-hybrid.webp`,
            availability: "enquire",
            summary: "A hybrid inverter for homes and small businesses, with built-in MPPT solar charging and support for up to 12 units in parallel.",
          },
          {
            slug: "7-5kva-commercial-inverter",
            name: "7.5kVA Commercial Inverter",
            chips: ["7.5 kVA", "Hybrid", "Commercial"],
            facets: { powerKva: 7.5 },
            image: `${P}/inverter-hybrid.webp`,
            availability: "enquire",
            summary: "A 7.5kVA inverter sized for larger homes, shops and offices with heavier daytime loads.",
          },
          {
            slug: "10kva-commercial-inverter",
            name: "10kVA Commercial Inverter",
            chips: ["10 kVA", "Hybrid", "Commercial"],
            facets: { powerKva: 10 },
            image: `${P}/inverter-hybrid.webp`,
            availability: "enquire",
            summary: "A 10kVA inverter for commercial premises, large residences and multi-appliance loads.",
          },
        ],
      },
    ],
  },

  {
    slug: "lithium-batteries",
    name: "Lithium Batteries",
    singular: "Lithium Battery",
    short: "51.2V LiFePO4 storage from 5.12kWh to 15.36kWh.",
    description:
      "Long-life lithium iron phosphate (LiFePO4) energy storage with built-in battery management. Store daytime solar for night-time use, and expand capacity by connecting packs in parallel.",
    image: `${P}/hy-300-main.webp`,
    pairsWith: ["inverters", "solar-panels"],
    series: [
      {
        slug: "hy-series",
        name: "HY Series LiFePO4 Battery",
        tagline: "51.2V household energy storage, 5.12kWh to 15.36kWh",
        overview: [
          "The HY Series is a 51.2V lithium iron phosphate battery system designed for household solar installations. Four capacities let you match storage to your evening and overnight load.",
          "A built-in battery management system (BMS) monitors every pack and keeps it within safe operating limits. Packs communicate with compatible inverters over CAN and RS485, and up to 16 can be connected in parallel as your needs grow.",
        ],
        features: [
          { title: "LiFePO4 chemistry", text: "Lithium iron phosphate cells offer high thermal stability and a rated cycle life of at least 6,000 cycles at 80% depth of discharge." },
          { title: "Built-in BMS", text: "The battery management system monitors operation and prevents the pack from working outside its design limits." },
          { title: "Expandable to 16 packs", text: "Add capacity later by connecting additional packs in parallel through a matching junction box." },
          { title: "Inverter communication", text: "CAN and RS485 ports let the battery report its status directly to compatible inverters." },
          { title: "Deep usable capacity", text: "Depth of discharge of 95% or more means more of the rated energy is available to you." },
          { title: "Made for home solar", text: "Compact, high-energy-density design intended for residential PV systems." },
        ],
        applications: ["Overnight home backup", "Solar self-consumption", "Shops and small offices", "Reducing generator run time"],
        gallery: [`${P}/hy-300-main.webp`, `${P}/hy-200-main.webp`, `${P}/hy-wall-main.webp`, `${P}/hy-wall-ports.webp`, `${P}/hy-300-overview.webp`],
        specStatus: "verified",
        specNote: "Specifications as published by the manufacturer. Confirm the exact model with our team before purchase.",
        specs: [
          {
            title: "Electrical",
            rows: [
              { label: "Usable capacity", value: ["5.12 kWh", "7.68 kWh", "10.24 kWh", "15.36 kWh"] },
              { label: "Nominal voltage", value: "51.2 V" },
              { label: "Voltage range", value: "40 – 58.4 V" },
              { label: "Recommended charge cut-off voltage", value: "58.4 V" },
              { label: "Recommended discharge cut-off voltage", value: "40.0 V" },
              { label: "Max. charge current", value: ["100 A", "150 A", "200 A", "200 A"] },
              { label: "Max. discharge current", value: ["100 A", "150 A", "200 A", "200 A"] },
              { label: "Recommended charge / discharge current", value: ["≤ 50 A", "100 A", "100 A", "100 A"] },
              { label: "Depth of discharge (DOD)", value: "≥ 95%" },
              { label: "Cycle life", value: "≥ 6,000 cycles @ 25°C, 80% DOD" },
            ],
          },
          {
            title: "System",
            rows: [
              { label: "Parallel connection", value: "1 – 16 packs" },
              { label: "Communication", value: "CAN & RS485" },
              { label: "Ingress protection", value: "IP21" },
            ],
          },
          {
            title: "Environmental",
            rows: [
              { label: "Operating temperature (discharge)", value: "−20°C to +60°C" },
              { label: "Operating temperature (charge)", value: "0°C to +55°C" },
            ],
          },
          {
            title: "Mechanical",
            rows: [
              { label: "Dimensions (mm)", value: ["630 × 420 × 195", "630 × 420 × 245", "573 × 500 × 300", "942 × 500 × 300"] },
              { label: "Package dimensions (mm)", value: ["730 × 465 × 360", "710 × 510 × 420", "630 × 540 × 450", "990 × 560 × 470"] },
              { label: "Net weight", value: ["55 kg", "75 kg", "80 kg", "115 kg"] },
              { label: "Gross weight", value: ["70 kg", "95 kg", "100 kg", "140 kg"] },
            ],
          },
        ],
        settings: {
          title: "Recommended inverter / charger settings",
          rows: [
            { label: "Max. charging voltage", value: "58.4 V" },
            { label: "Float charging voltage", value: "57.6 V" },
            { label: "Max. charging current", value: "50 A × N (N = number of packs in parallel)" },
            { label: "Cut-off voltage", value: "40.0 V" },
          ],
        },
        inTheBox: ["Battery pack", "Parallel connection cables", "Communication cable", "Mounting screws", "User manual", "Guarantee card"],
        guide: [
          {
            title: "Before installation",
            paragraphs: [
              "Inspect the unit on delivery and make sure nothing in the package is damaged. Lithium batteries are not the same as lead-acid batteries, so any inverter, MPPT charge controller or UPS connected to the pack must be configured with the recommended settings above before it is switched on.",
            ],
          },
          {
            title: "Connecting to the inverter",
            steps: [
              "Fix the mounting bracket to the battery, mark its position on the wall and install the expansion screws.",
              "Connect the battery's positive and negative terminals to the inverter's positive and negative battery terminals.",
              "Connect the communication cable according to your inverter's instructions (CAN or RS485).",
              "For multiple packs in parallel, use a matching junction box.",
            ],
            image: `${P}/hy-wiring.webp`,
          },
          {
            title: "Switching on and the reset button",
            paragraphs: [
              "Turn the battery on with its low-voltage switch. The reset button has several functions: a 3–6 second press wakes the BMS from sleep or puts it to sleep; a 6–10 second press resets the protection board; three presses within 5 seconds re-codes the BMS address.",
            ],
          },
          {
            title: "Sleep and wake-up",
            paragraphs: [
              "The BMS enters sleep mode if under-voltage protection is not cleared within 30 seconds, if the button is pressed for 3–6 seconds, or after a period with no communication, current or protection activity. It wakes when a charger above 48V is connected, when the button is pressed, or when activated over RS485/CAN. After under-voltage protection it wakes every 4 hours to attempt charging.",
            ],
          },
        ],
        downloads: [],
        products: [
          {
            slug: "hy-lfp-512100-5kwh",
            name: "HY 5.12kWh LiFePO4 Battery",
            model: "LFP-512100",
            chips: ["5.12 kWh", "51.2 V · 100 Ah", "LiFePO4", "Wall-mounted"],
            facets: { capacityKwh: 5.12 },
            image: `${P}/hy-wall-main.webp`,
            gallery: [`${P}/hy-wall-main.webp`, `${P}/hy-wall-front.webp`, `${P}/hy-wall-ports.webp`, `${P}/hy-wall-terminals.webp`, `${P}/hy-wall-overview.webp`],
            availability: "enquire",
            summary: "A compact 5.12kWh wall-mounted lithium battery, ideal as a first storage pack for a 5kVA home system.",
          },
          {
            slug: "hy-lfp-512150-7kwh",
            name: "HY 7.68kWh LiFePO4 Battery",
            model: "LFP-512150",
            chips: ["7.68 kWh", "51.2 V · 150 Ah", "LiFePO4", "Wall-mounted"],
            facets: { capacityKwh: 7.68 },
            image: `${P}/hy-wall-main.webp`,
            gallery: [`${P}/hy-wall-main.webp`, `${P}/hy-wall-front.webp`, `${P}/hy-wall-ports.webp`, `${P}/hy-wall-terminals.webp`, `${P}/hy-wall-overview.webp`],
            availability: "enquire",
            summary: "7.68kWh of wall-mounted LiFePO4 storage with 150A charge and discharge capability.",
          },
          {
            slug: "hy-lfp-512200-10kwh",
            name: "HY 10.24kWh LiFePO4 Battery",
            model: "LFP-512200",
            chips: ["10.24 kWh", "51.2 V · 200 Ah", "LiFePO4", "200 A max."],
            facets: { capacityKwh: 10.24 },
            image: `${P}/hy-200-main.webp`,
            gallery: [`${P}/hy-200-main.webp`, `${P}/hy-200-side.webp`, `${P}/hy-200-ports.webp`, `${P}/hy-200-overview.webp`],
            availability: "enquire",
            summary: "A 10.24kWh pack with 200A maximum current, suited to larger homes and evening-heavy loads.",
          },
          {
            slug: "hy-lfp-512300-15kwh",
            name: "HY 15.36kWh LiFePO4 Battery",
            model: "LFP-512300",
            chips: ["15.36 kWh", "51.2 V · 300 Ah", "LiFePO4", "Floor-standing"],
            facets: { capacityKwh: 15.36 },
            image: `${P}/hy-300-main.webp`,
            gallery: [`${P}/hy-300-main.webp`, `${P}/hy-300-front.webp`, `${P}/hy-300-ports.webp`, `${P}/hy-300-overview.webp`],
            availability: "enquire",
            summary: "15.36kWh of storage in a floor-standing cabinet on castors, for whole-home backup and small commercial use.",
          },
        ],
      },
      {
        slug: "af-wm-series",
        name: "AF-WM Series Wall-Mounted Battery",
        tagline: "Premium wall-mounted LiFePO4 storage",
        overview: [
          "The AF-WM Series is Africell's premium wall-mounted lithium iron phosphate battery. It can be installed on the wall or stood upright, and its smart BMS communicates with multiple mainstream inverter brands.",
        ],
        features: [
          { title: "Easy installation", text: "Can be placed upright or mounted on the wall." },
          { title: "Smart BMS", text: "Communicates with multiple mainstream inverter brands." },
          { title: "Certified", text: "Manufacturer-stated certifications include UN38.3, MSDS and CE." },
          { title: "High-quality cells", text: "Built with LFP cells from tier-one suppliers such as CATL, EVE and Gotion, according to the manufacturer." },
        ],
        applications: ["Home solar storage", "Backup power", "Small commercial systems"],
        gallery: [`${P}/af-wm-main.webp`],
        specStatus: "partial",
        specNote: "The detailed datasheet for this model is being confirmed with the manufacturer. Ask our team for the complete specification.",
        specs: [
          {
            title: "Overview",
            rows: [
              { label: "Model", value: "AF-WM-512300-A010" },
              { label: "Chemistry", value: "Lithium iron phosphate (LiFePO4)" },
              { label: "Nominal voltage", value: "51.2 V" },
              { label: "Nominal capacity", value: null },
              { label: "Max. charge / discharge current", value: null },
              { label: "Dimensions & weight", value: null },
            ],
          },
        ],
        downloads: [],
        products: [
          {
            slug: "af-wm-512300-a010",
            name: "AF-WM Wall-Mounted LiFePO4 Battery",
            model: "AF-WM-512300-A010",
            chips: ["51.2 V", "LiFePO4", "Wall-mounted", "Smart BMS"],
            facets: {},
            image: `${P}/af-wm-main.webp`,
            availability: "enquire",
            summary: "A premium wall-mounted LiFePO4 battery with a smart BMS that works with multiple mainstream inverter brands.",
          },
        ],
      },
    ],
  },

  {
    slug: "solar-panels",
    name: "Solar Panels",
    singular: "Solar Panel",
    short: "Monocrystalline modules from 180W to 650W.",
    description:
      "Monocrystalline solar modules with an anodised aluminium frame and tempered glass, from compact 180W panels for small systems to high-output 650W modules for rooftops and solar farms.",
    image: `${P}/panel-front.webp`,
    pairsWith: ["inverters", "lithium-batteries"],
    series: [
      {
        slug: "gl-mono-series",
        name: "GL-MONO Monocrystalline Solar Panels",
        tagline: "From 180W to 650W, for homes, businesses and solar plants",
        overview: [
          "GL-MONO modules use monocrystalline silicon cells for strong conversion efficiency in a durable aluminium-framed panel. Ten power ratings let you size an array precisely for your roof space and energy needs.",
        ],
        features: [
          { title: "Monocrystalline cells", text: "High conversion efficiency for more energy per square metre of roof." },
          { title: "Low light-induced degradation", text: "Designed for stable output over a long service life." },
          { title: "Built for tough conditions", text: "Rated by the manufacturer to withstand high wind pressure and extreme temperatures." },
          { title: "Weather-sealed junction box", text: "Sealed junction box and pre-fitted output cables for straightforward installation." },
        ],
        applications: ["Residential rooftops", "Commercial and industrial rooftops", "Off-grid systems", "Solar power plants"],
        gallery: [`${P}/panel-front.webp`, `${P}/panel-pair.webp`, `${P}/panel-detail.webp`, `${P}/panel-connectors.webp`],
        specStatus: "partial",
        specNote:
          "The source datasheet listed identical electrical and mechanical values for every wattage, which cannot be correct. We are confirming per-model figures with the manufacturer and only show verified values here.",
        specs: [
          {
            title: "Electrical (STC)",
            rows: [
              { label: "Peak power (Pmax)", value: ["180 W", "300 W", "330 W", "350 W", "400 W", "430 W", "480 W", "550 W", "600 W", "650 W"] },
              { label: "Cell type", value: "Monocrystalline" },
              { label: "Max. power voltage (Vmp)", value: null },
              { label: "Max. power current (Imp)", value: null },
              { label: "Open-circuit voltage (Voc)", value: null },
              { label: "Module efficiency", value: null },
            ],
          },
          {
            title: "Mechanical",
            rows: [
              { label: "Frame", value: "Anodised aluminium alloy" },
              { label: "Front glass", value: "High-transmission, low-iron tempered glass" },
              { label: "Dimensions", value: null },
              { label: "Weight", value: null },
            ],
          },
        ],
        downloads: [],
        products: [180, 300, 330, 350, 400, 430, 480, 550, 600, 650].map((w) => ({
          slug: `gl-mono-${w}w`,
          name: `${w}W Monocrystalline Solar Panel`,
          model: `GL-MONO-${w}W`,
          chips: [`${w} W`, "Monocrystalline"],
          facets: { wattage: w },
          image: w >= 400 ? `${P}/panel-front.webp` : `${P}/panel-classic.webp`,
          gallery: w >= 400 ? [`${P}/panel-front.webp`, `${P}/panel-pair.webp`, `${P}/panel-detail.webp`, `${P}/panel-connectors.webp`] : [`${P}/panel-classic.webp`, `${P}/panel-detail.webp`, `${P}/panel-connectors.webp`],
          availability: "enquire" as const,
          summary:
            w >= 500
              ? `A high-output ${w}W monocrystalline module for large rooftops, commercial arrays and solar plants.`
              : w >= 400
                ? `A ${w}W monocrystalline module that balances output and roof space for home and business systems.`
                : `A ${w}W monocrystalline module for smaller systems, limited roof space and off-grid applications.`,
        })),
      },
    ],
  },
];
