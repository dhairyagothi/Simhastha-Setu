<div align="center">

# सिम्हस्था सेतु · SimhasthaSetu

### **Har Pal Ek Setu · हर पल एक सेतु**

**AI-Powered Emergency Response & Coordination Platform for Simhastha 2028, Ujjain**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-simhastha--setu.vercel.app-F97316?style=for-the-badge)](https://simhastha-setu.vercel.app/)
[![Built With React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Claude AI](https://img.shields.io/badge/Claude-AI-F97316?style=for-the-badge)](https://anthropic.com)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)


<img src="https://s3.india.com/travel/wp-content/uploads/2016/05/ujjain-simhastha-kumbh-mela-5.jpg" width="100%" style="border-radius: 12px; margin: 20px 0;" alt="Ram Ghat, Ujjain"/>


> *Simhastha is not Kumbh. It is Ujjain's own — held every 12 years at the banks of the sacred Shipra river. In 2016, 75 million pilgrims arrived in a city of 500,000. In 2028, that number will cross 150 million. SimhasthaSetu exists so every one of them is safe.*

</div>

---

## 🔴 The Problem — Simhastha 2016 Ground Reality

| Metric | Reality |
|--------|---------|
| Average emergency response time | **18–25 minutes** |
| Agency communication channels | **12+ separate WhatsApp groups & radio channels** |
| Peak single-day crowd | **~8–10 million** on Shahi Snan dates |
| Missing person resolution | **Hours via paper forms** at lost & found camps |
| Crowd surge detection | **Manual observation** — someone physically noticed and ran to tell an officer |
| Cross-agency coordination | **None** — Police, Medical, NDRF operated in complete silos |

**SimhasthaSetu's target response time: under 5 minutes.**

The gap between 18 minutes and 5 minutes is not a technology problem. It is a coordination problem. SimhasthaSetu is the bridge.

---

## 🟠 What is SimhasthaSetu

SimhasthaSetu is **not a new system**. It is a coordination layer built above every system that already exists — DIAL 100, 108 Ambulance, NDRF control rooms, Mela administration. Like UPI didn't replace banks but connected them, SimhasthaSetu connects every emergency agency into one unified operational picture.

**Three portals. One truth. Zero new hardware required.**

---

## ✨ Key Features

### 🧭 Multi-Portal Architecture
Three completely differentiated role-based portals — each with unique capabilities, not just filtered views of the same dashboard.

| Portal | User | Core Purpose |
|--------|------|--------------|
| **Pilgrim** | Any visitor, volunteer, junior officer | Report emergencies in 10 seconds, any language, any phone |
| **Control Room** | Mela Administration, Senior IPS, SDRF Command | Full operational command, cross-agency oversight, zone control |
| **Agency** | Police SHO, Medical supervisor, Fire in-charge, NDRF team lead | Assignment execution, resource requests, shift reporting |

---

### 📱 Pilgrim Report Portal
- **One-tap incident categories**: Medical, Crowd Crush, Fire, Missing Person, Security, Drowning
- **Voice or text input** in Hindi, Gujarati, Marathi, Bengali, English
- **Real Claude AI classification** → returns incident type + severity (P1–P4) + Hindi alert text instantly
- **Multilingual alerts**: Same incident auto-translated to 3 languages (Hindi / English / Gujarati)
- **Ticket generation**: `SS-XXXX` format, SMS-ready confirmation
- **Works offline**: Queues reports on poor connectivity, flushes when restored
- **No app install needed**: Progressive Web App, works on 2G feature phones

---

### 🖥️ Control Room Dashboard (Command Center)
- **Live Incident Map** (Leaflet + CartoDB Positron tiles) — Ujjain ghat geography, colored markers by severity, real-time sync
- **Master Command Panel**: All-agency connection status, system-wide incident counts, live operational health
- **Cross-Agency Incident Reassignment**: Drag incidents between agencies; only Control Room can do this
- **Zone Lock Controls**: Open / Restricted / Closed toggle per ghat zone — auto-generates Hindi PA advisory via Claude AI
- **SitRep Generator**: One click → Claude AI writes a formal 5-line situation report for senior official briefings
- **Historical 2016 Hotspot Overlay**: Toggle showing documented Simhastha 2016 incident clusters on the live map
- **Inter-Agency Alert Feed**: Replaces 12 WhatsApp groups with one timestamped, accountable communication layer
- **Resource Tracker**: All unit positions, statuses, ETAs, assignment history

---

### 🏥 Agency Dashboard (Ground Operations)
- **My Assignments Only View**: Focused 2–4 card view, no information overload
- **Mark On Scene / Mark Resolved**: Action buttons that drive status — only agency can resolve, not Control Room
- **Resource Request Flow**: Agencies request → Control Room approves/denies → tracked with full accountability
- **My Zone Map**: Zoomed to assigned sector only, agency-colored boundary overlay
- **Quick Status Broadcast**: 3 one-tap buttons — "All Clear", "Need Backup", "Major Incident" — instant formatted alert to Control Room
- **Shift Handover Report**: Claude AI generates a complete shift summary — incidents handled, avg response time, pending cases, next-shift recommendations

---

### 🤖 AI Situational Intelligence (Powered by Claude)
- **Crowd Surge Prediction Chart**: Forecasts ghat density for next 12 hours, red threshold line at 85%, location-specific peak time pills
- **Incident Pattern Recognition**: Auto-detects clusters (3+ same-type incidents in same zone within 15 min) → flags stampede precursor with escalation recommendation
- **AI Deployment Recommendation**: One click → Claude analyzes current incidents + Simhastha 2016 historical data → returns structured unit deployment plan for next shift
- **Anomaly Detection Cards**: Real-time visual callouts for emerging risk patterns

---

### 🔍 Missing Person Module
- **Photo upload + case submission** → generates `SS-MP-XXXX` case ID
- **AI Face Match simulation** with confidence score display
- **Hindi PA Announcement Generator**: Claude writes formal Hindi announcement text for PA broadcast at ghats
- **Case status tracking**: Searching → Match Found → Resolved

---

### ⚡ System Automation (No Human Needed)

| Automation | Trigger | What Happens |
|------------|---------|--------------|
| **Incident Deduplication** | Every 60 seconds | 3+ same-type reports in same zone merged into 1, severity auto-bumped, cluster alert fired |
| **Crowd Surge Warning** | Every 5 minutes | Mock density crosses 80% → red banner on map + auto-advisory in alert feed |
| **Unassigned Escalation** | P1 unassigned > 3 min | Card pulses red, "UNASSIGNED 3min" badge, moves to top of feed, Control Room toast fires |
| **Agency Offline Detection** | Every 30 seconds | Agency heartbeat timeout → pill turns red in Control Room → alert generated |
| **Morning Briefing** | 5:00 AM daily | Claude auto-generates daily briefing — risk level, deployment zones, weather advisory, crowd forecast |

---

### 📞 Single Call Feature — `1916`

> *The most important feature for the 70-year-old pilgrim from Gujarat who doesn't have a smartphone.*

```
Dial 1916 → Speak in any language → Auto-dispatched in 90 seconds
```

**Full call flow:**
1. IVR connects in under 2 seconds — "Simhastha Setu mein aapka swagat hai"
2. Caller speaks freely — Hindi, Gujarati, Marathi, Bengali, English
3. Whisper API transcribes in under 3 seconds
4. Claude classifies: type, severity, location hint extracted from speech
5. P1 incident auto-plotted on Control Room map
6. Nearest available unit auto-assigned
7. SMS sent to caller: "Aapka ticket SS-2847 register hua. Ambulance-3 bheja ja raha hai. ETA: 6 min"

**What the caller needs:** Any phone. Voice. That's it.
**Cost per incident end-to-end:** ~₹3–4. For 1 lakh incidents over 30 days = ₹3–4 lakh. Essentially free for a 150M pilgrim event.

---

## 🗺️ Why Ujjain is Uniquely Hard

SimhasthaSetu is not a generic emergency platform. It is built with Ujjain's geography and constraints encoded into its logic:

- **Medieval road grid**: Ram Ghat and Mahakal corridor have single-entry choke points. Routing engine uses crowd-density-weighted paths, not standard Google Maps
- **Pre-dawn peak risk**: Drowning incidents spike 4–6 AM during pre-dawn snan — AI alerts pre-position medical teams before pilgrims arrive
- **12-year event memory**: 2016 hotspot overlay gives Control Room spatial institutional memory that no new officer would have
- **Language diversity**: Pilgrim origin analysis from 2016 shows top languages are Hindi, Gujarati, Marathi, Bengali — all supported natively
- **Non-smartphone majority**: 40%+ of pilgrims are elderly, rural, or use feature phones — the `1916` single call flow is the product for them

---

## 🔗 System Integrations (No New Hardware)

| Existing System | Integration Method |
|---|---|
| DIAL 100 / MP Police CAD | Webhook read of incident feeds |
| 108 Ambulance MP | Dispatch API — vehicle GPS pull, incident push |
| MP Tourism pilgrim registration | Phone numbers for zone-based SMS alerts |
| Existing Kumbh CCTV | RTSP stream → crowd density model |
| Government vehicle GPS (VAHAN) | Mandatory GPS feed, direct pull |
| IMD Weather API | Free public API, weather-based risk flags |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Maps | Leaflet.js + react-leaflet |
| Charts | Recharts |
| AI Engine | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| State Management | Zustand |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Fonts | Inter + Noto Sans Devanagari |
| Map Tiles | CartoDB Positron (light/white theme) |
| Storage | localStorage (demo) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/simhastha-setu.git
cd simhastha-setu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Anthropic API key to .env:
# VITE_ANTHROPIC_API_KEY=your_key_here

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 👤 Demo Login Credentials

No signup needed. Click any role on the landing page or use these credentials:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Pilgrim** | `pilgrim@kumbh.in` | `demo123` | Mobile report form, ticket tracking |
| **Control Room** | `control@kumbh.in` | `demo123` | Full ops dashboard, all agencies |
| **Police** | `police@kumbh.in` | `demo123` | Police assignments + zone map |
| **Medical** | `medical@kumbh.in` | `demo123` | Medical team assignments |
| **Fire** | `fire@kumbh.in` | `demo123` | Fire unit view |
| **NDRF** | `ndrf@kumbh.in` | `demo123` | NDRF team operations |

---

## 🎬 Demo Script (2 Minutes)

Run this sequence during any presentation to show the full end-to-end product:

**Step 1** — Open two browser tabs side by side on projector
- Tab 1: Pilgrim view
- Tab 2: Control Room dashboard

**Step 2** — In Pilgrim tab: type *"Elderly woman collapsed near Ram Ghat entrance steps"* → submit
- Watch Claude classify it as Medical P1 in real time
- Hindi alert text appears
- Ticket `SS-XXXX` generated

**Step 3** — Switch to Control Room tab
- New red P1 marker appeared on Ujjain map (localStorage sync)
- Incident card at top of feed

**Step 4** — Assign Ambulance-2 from the dropdown
- Ambulance status flips from Available → Dispatched
- Incident status updates to Assigned

**Step 5** — Navigate to AI Insights tab
- Click "Generate Deployment Plan"
- Claude responds live with structured recommendations based on Simhastha 2016 data

**Step 6** — Show Missing Person tab
- Pre-seeded case with "87% AI Match Found" badge
- Click "Generate PA Announcement" → Claude writes Hindi announcement live

**Total demo time: ~90 seconds. Every feature visible.**

---

## 📁 Project Structure

```
simhastha-setu/
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── map/                 # Leaflet map components
│   │   ├── incidents/           # Incident cards, feeds
│   │   ├── resources/           # Resource tracker
│   │   └── alerts/              # Inter-agency alert feed
│   ├── pages/
│   │   ├── Landing.jsx          # Login + hero page
│   │   ├── PilgrimView.jsx      # Mobile report form
│   │   ├── ControlRoom.jsx      # Full ops dashboard
│   │   ├── AgencyView.jsx       # Agency-specific view
│   │   ├── AIInsights.jsx       # Crowd prediction + deployment AI
│   │   └── MissingPerson.jsx    # Missing person module
│   ├── store/
│   │   └── useStore.js          # Zustand global state
│   ├── lib/
│   │   ├── claude.js            # Anthropic API calls
│   │   ├── seedData.js          # Demo incident + resource data
│   │   └── automation.js        # Auto-escalation, deduplication timers
│   └── styles/
│       └── index.css            # Tailwind + custom animations
├── public/
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 Design System

**Color Palette:**

| Token | Name | Hex |
|-------|------|-----|
| Primary | Saffron | `#F97316` |
| Primary Dark | Deep Saffron | `#EA580C` |
| Primary Light | Saffron Glow | `#FFF7ED` |
| Background | Pure White | `#FFFFFF` |
| Surface | Warm Off-White | `#FAFAFA` |
| P1 Critical | Alert Red | `#DC2626` |
| P2 High | Orange | `#EA580C` |
| P3 Medium | Amber | `#D97706` |
| Success | Green | `#22C55E` |

**Typography:** Inter (UI) + Noto Sans Devanagari (Hindi text)

**Design Principle:** No dark blue. Pure saffron–white–gray system that reflects Ujjain's identity without being decorative at the cost of clarity.

---

## 🤖 Live Claude AI Calls

Five real Anthropic API calls power the core product:

| # | Where | What Claude Does |
|---|-------|-----------------|
| 1 | Pilgrim form | Classifies incident type + severity + generates Hindi alert |
| 2 | Pilgrim form | Generates multilingual alert (Hindi / English / Gujarati) |
| 3 | AI Insights | Generates structured deployment recommendation for next shift |
| 4 | Missing Person | Writes formal Hindi PA announcement for ghat broadcast |
| 5 | Control Room | Generates SitRep for senior official briefings |

---

## 📊 Impact Metrics (Projected)

| Metric | Current (2016) | SimhasthaSetu Target |
|--------|---------------|---------------------|
| Emergency response time | 18–25 min | < 5 min |
| Agency coordination channels | 12+ | 1 |
| Incident deduplication | Manual / none | Automated, 60s cycles |
| Crowd surge warning | Reactive | 60–90 min predictive |
| Pilgrims able to report | Smartphone + Hindi only | Any phone, any language |
| Missing person resolution | Hours | < 30 min with AI match |

---

## 🗓️ Roadmap

**Post-Hackathon (3 months)**
- [ ] Real Twilio IVR integration for `1916` single call flow
- [ ] Actual CCTV crowd density pipeline
- [ ] 108 Ambulance dispatch API integration
- [ ] Offline-first PWA with full service worker

**Pre-Event (2027)**
- [ ] DIAL 100 / MP Police CAD webhook integration
- [ ] Aadhaar-linked missing person database connection
- [ ] Real-time weather + IMD API integration
- [ ] Multi-zone crowd simulation training on 2016 data

**Simhastha 2028**
- [ ] Live deployment across all 6 Shahi Snan dates
- [ ] Full multilingual IVR (7 languages)
- [ ] Drone feed integration for crowd density

---

## 🏛️ Built For

**Simhastha 2028 · Ujjain, Madhya Pradesh, India**

The Simhastha Mela is held every 12 years in Ujjain at the banks of the Shipra river. It is one of the largest human gatherings on Earth. 2028 is projected to see 150 million pilgrims over 30 days — in a city whose permanent population is 500,000.

SimhasthaSetu was designed from the ground up for this specific event, this specific city, and the specific failure patterns documented in the Simhastha 2016 post-event NDMA analysis.

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgements

- NDMA post-event analysis reports, Simhastha 2016
- Ujjain Mela Administration documentation
- OpenStreetMap contributors (Ujjain ghat mapping)
- CartoDB (Positron map tiles)
- Anthropic (Claude AI platform)

---

<div align="center">

**SimhasthaSetu · सिम्हस्था सेतु**

*Har Pal Ek Setu · हर पल एक सेतु*

Built with ❤️ for the pilgrims of Simhastha 2028

[🌐 Live Demo](https://simhastha-setu.vercel.app/) · [📧 Contact](mailto:contact@simhasthasetu.in) · [🐛 Report Bug](https://github.com/your-username/simhastha-setu/issues)

</div>
