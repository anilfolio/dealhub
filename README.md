# DealHub · Dealer Intelligence Platform

<p align="center">
  <img src="public/dealhub-logo-full.svg" alt="DealHub Dealer Intelligence Platform HD Logo" width="480" />
</p>

<p align="center">
  <strong>Next-Generation Automotive Sourcing, Landed Cost Intelligence & Auction Management Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Lucide_Icons-0.378-F43F5E?style=for-the-badge&logo=lucide" alt="Lucide React" />
  <img src="https://img.shields.io/badge/License-Proprietary-gray?style=for-the-badge" alt="License" />
</p>

---

## 📌 Overview

**DealHub** is an enterprise-grade dealer intelligence and automotive sourcing platform built for motor vehicle dealers importing Japanese auction vehicles into New Zealand and international markets.

It eliminates guesswork from vehicle procurement by offering:
- **Instant Landed Cost Calculations** converting FOB JPY into all-inclusive NZD landed costs (freight, compliance, biosecurity/MAF, GST, and margins).
- **Market Intelligence & Arbitrage Detection** comparing auction lots against active New Zealand retail comparables to pinpoint gross margin opportunities.
- **Smart Wishlist & Auto-Matching Engine** that scans incoming auction feeds and alerts dealers when vehicles match their exact buy-box criteria.
- **End-to-End Procurement Lifecycle** covering proxy bidding, auction countdowns, logistics tracking from Japanese ports to NZ yards, and an Admin Command Center.

---

## ✨ Key Features

### 🚗 Dealer Portal
- **Vehicle Catalog & Live Auction Explorer (`/browse-vehicles`)**:
  - Filter by Make, Model, Year range, Odometer, Auction Grade, Fuel Type, and Price.
  - Live search with instant query results and dynamic sort (Highest Score, Potential Margin, Ending Soonest, Lowest Price).
  - High-resolution multi-angle photo galleries and auction sheet specs.
- **Landed Cost Calculator & Economics Engine (`/vehicles/[id]`)**:
  - Full transparency on landed costs: FOB Converted NZD + RoRo Maritime Freight + Compliance + MAF/Biosecurity + GST (15%).
  - Maximum Proxy Bid calculator based on custom target dealer margin.
  - NZ retail comparables with Trade Me market benchmarking, days on market, and gross margin spread.
- **Active Bids Tracker (`/my-bids`)**:
  - Track live proxy bids with real-time statuses (`Leading`, `Outbid`, `Under Reserve`, `Won`).
  - Auction countdown timers and one-click proxy bid adjustments.
- **Saved Watchlist (`/watchlist`)**:
  - Pin target lots and monitor auction closing schedules with instant removal or direct bid escalation.
- **Purchases & Logistics Timeline (`/purchases`)**:
  - Full visibility into purchased stock across five logistical milestones: *Japan Auction Won & Yard Dispatch* ➔ *Vessel Booking & RoRo Maritime Shipping* ➔ *NZ Port Customs & MAF Inspection* ➔ *Compliance Center* ➔ *Dealer Yard Delivery*.
- **Market Demand Intelligence (`/market`)**:
  - Market turnover analytics, top-selling hybrid and electric models, average days to sell, and wholesale volume trends.
- **Automated Wishlist Matches (`/matches`)**:
  - Dedicated feed of auction lots automatically paired with saved dealer buy-boxes.

### 🛠️ Admin Command Center (`/admin`)
- **Executive KPI Dashboard**: Real-time overview of active dealers, open wishlists, live inventory, matched lots, placed bids, and completed purchases.
- **Dealer Management (`/admin/dealers`)**: View and manage dealer accounts, credit facilities, assigned sales reps, and activity metrics.
- **Inventory Sync & Controls (`/admin/vehicles`)**: Centralized vehicle feed management, batch stock controls, and auction feed synchronization.
- **Wishlist Aggregator (`/admin/wishlists`)**: Overview of all dealer sourcing requirements, active match triggers, and notification broadcasting.
- **Dealer Requests Hub (`/admin/requests`)**: Sourcing requests, inspection sheet translation requests, and logistics inquiries.

### 🤖 DealHub AI Chat Assistant
- Integrated conversational assistant capable of:
  - Answering landed cost inquiries and FX rate conversions.
  - Recommending matching auction lots based on natural language criteria.
  - Simulating profit margins and retail spreads.
  - Subtle interactive audio cues using the Web Audio API.

### ⚡ User Experience & Navigation
- **Collapsible Responsive Navigation**: Modern high-contrast navy sidebar with mini-sidebar mode on laptops and full drawer on mobile.
- **Global Search Modal (`Ctrl+K` / `Cmd+K` / `/`)**: Rapid search dialog to find vehicles, dealers, and features from any screen.
- **Cross-Tab Synchronized State**: In-browser store with custom event broadcasting ensuring bid, watchlist, and criteria changes propagate across open tabs in real time.

---

## 🔑 Demo Access & Credentials

The application includes pre-configured demo profiles accessible directly via the Quick Login panel on the login screen (`/login`):

| Role | Email | Password | Landing Route | Description |
|---|---|---|---|---|
| **Licensed Dealer** | `dealer@dealhub.co.nz` | *(Any / prefilled)* | `/browse-vehicles` | Access vehicle search, bid placement, wishlist, and landed cost analytics |
| **System Admin** | `admin@dealhub.co.nz` | *(Any / prefilled)* | `/admin` | Access executive KPI dashboard, dealer management, inventory feeds, and requests |

> **Tip:** You can also click the **"Quick Login as Dealer"** or **"Quick Login as Admin"** buttons on the login page for one-click access.

---

## 🧮 Landed Cost Economics

DealHub calculates vehicle landed cost using New Zealand automotive import formulas:

$$\text{FOB}_{\text{NZD}} = \frac{\text{FOB}_{\text{JPY}}}{\text{FX Rate (JPY/NZD)}}$$

$$\text{Landed Cost}_{\text{NZD}} = \text{FOB}_{\text{NZD}} + \text{Ocean Freight} + \text{Compliance Fee} + \text{MAF/Port Fees} + \text{GST (15\%)}$$

$$\text{Max Bid}_{\text{NZD}} = \text{Est. NZ Retail Price} - \text{Target Dealer Margin} - \text{Import Fees \& Taxes}$$

Dealers can adjust their required profit margin directly on any vehicle page to see the maximum allowable auction bid in real time.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: Google Roboto via `next/font`
- **State Management**: Reactive Local Storage Store with browser `CustomEvent` synchronization (`dealerStore.ts`, `syncStore.ts`)
- **Deployment Ready**: Optimized for [Vercel](https://vercel.com/) with configured `vercel.json` security headers

---

## 📁 Project Structure

```text
dealhub/
├── public/                       # High-definition static brand assets
│   ├── dealhub-logo-full.svg     # Full horizontal HD vector logo & wordmark
│   ├── dealhub-emblem.svg        # Precision vector HD emblem (Squircle D+H)
│   ├── dealhub-emblem-hd.jpg     # 3D Glossy HD app icon emblem (4K master)
│   ├── dealhub-logo-hd.jpg       # High-definition brand emblem raster master
│   ├── favicon.svg               # Scalable vector favicon
│   ├── apple-touch-icon.png      # High-res iOS & web app touch icon
│   └── vehicles/                 # High-resolution vehicle photography library
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── admin/                # Admin Portal
│   │   │   ├── dealers/          # Dealer management
│   │   │   ├── requests/         # Dealer sourcing requests
│   │   │   ├── vehicles/         # Vehicle inventory management
│   │   │   ├── wishlists/        # Centralized wishlist matching
│   │   │   └── page.tsx          # Admin KPI dashboard
│   │   ├── browse-vehicles/      # Vehicle catalog & search explorer
│   │   ├── login/                # Authentication & quick role selector
│   │   ├── market/               # NZ market demand intelligence
│   │   ├── matches/              # Automated wishlist matches
│   │   ├── my-bids/              # Proxy bidding tracker
│   │   ├── profile/              # Dealer account & preferences
│   │   ├── purchases/            # Post-auction logistics pipeline
│   │   ├── vehicles/[id]/        # Vehicle detail & landed cost calculator
│   │   ├── watchlist/            # Saved vehicles tracker
│   │   ├── globals.css           # Global Tailwind styles & design tokens
│   │   ├── layout.tsx            # Root HTML layout & font configuration
│   │   └── page.tsx              # Root route redirect
│   ├── components/               # Reusable UI component library
│   │   ├── admin/                # Admin-specific components & tables
│   │   ├── chat/                 # DealHub AI conversational copilot
│   │   ├── layout/               # AppLayout, AdminLayout, Header, GlobalSearchModal
│   │   └── vehicle/              # VehicleCard, BidModal, CostBreakdownModal
│   └── lib/                      # Core business logic, data, and state
│       ├── data.ts               # Core vehicle records & NZ comparables
│       ├── dealerStore.ts        # Client storage for bids, wishlists & purchases
│       ├── demandIntelligenceData.ts # Market demand & price trends
│       ├── formatters.ts         # Currency (NZD/JPY) & date formatters
│       ├── heiwaData.ts          # Japanese auction inventory dataset
│       └── syncStore.ts          # Cross-tab synchronization store
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and build scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript compiler options
└── vercel.json                   # Vercel deployment configuration & headers
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### 1. Clone & Navigate
```bash
git clone <repository-url> dealhub
cd dealhub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```

To run the production build locally:
```bash
npm run start
```

### 5. Linting
Run static code analysis:
```bash
npm run lint
```

---

## 🏗️ Architecture, Design & Layout Governance

DealHub is engineered with an enterprise cloud architecture, high-density operational layout blueprints, and design tokens:
- 🏗️ **Platform System Architecture**: [`ARCHITECTURE.md`](ARCHITECTURE.md) — Complete technical blueprint, Mermaid system architecture diagrams, mathematical landed cost formulas, proxy bidding finite state machine, and the **6 Better Layout Architectural Blueprints** (70/30 Auction Cockpit, 4-Column KPI strip, Dual-Engine Landed Cost split, 5-Stage Maritime Logistics Stepper, and Master-Detail drawer).
- 🎨 **UI Styleguide Documentation**: [`STYLEGUIDE.md`](STYLEGUIDE.md) — Comprehensive design system tokens, typography scales, component library specifications, and visual hierarchy standards.
- 🔒 **Engineering & Compliance Rules**: [`RULES.md`](RULES.md) — Development rules, mandatory layout standards, anti-patterns, biosecurity/MAF compliance, and cross-window event bus protocols.
- ⚡ **Interactive Styleguide & Layout Explorer**: Available live at [`/styleguide`](http://localhost:3000/styleguide) featuring real-time calculators, layout pattern switchers, and component playgrounds.
- 💎 **Brand Identity & HD Logo System**: Available live at [`/brand`](http://localhost:3000/brand) featuring one-click vector SVG downloads and React JSX generator.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` or `Cmd + K` | Open Global Search Dialog |
| `/` (forward slash) | Quick trigger Global Search (when not in input) |
| `Esc` | Close active modal / dialog / search |

---

## 🚢 Deployment

DealHub is pre-configured for automated deployment on **Vercel**:
1. Connect your repository to Vercel.
2. The framework will automatically detect Next.js.
3. The build command `npm run build` and output directory `.next` are recognized out-of-the-box.
4. Security headers configured in `vercel.json` (`nosniff`, `DENY`, `strict-origin-when-cross-origin`) are applied automatically.

---

## 📄 License

Proprietary © DealHub. All rights reserved.
