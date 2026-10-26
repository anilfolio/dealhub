# Agent Guidelines & Development Rules

All AI coding assistants, agents, and contributors working on **DealHub** must strictly adhere to the established project governance:

1. **Engineering & Layout Rules**: Consult [RULES.md](RULES.md) for mandatory layout architectural patterns (70/30 Cockpit, 4-Column KPI, Dual-Engine Landed Split, 5-Stage Logistics Timeline), forbidden anti-patterns, and trade compliance requirements.
2. **System Architecture**: Consult [ARCHITECTURE.md](ARCHITECTURE.md) for technical domain models, mathematical landed cost equations, and sequence diagrams.
3. **UI Styleguide & Design System**: Consult [STYLEGUIDE.md](STYLEGUIDE.md) for color tokens, typography scales, and component guidelines.
4. **Information Architecture (IA)**: Ensure all new routes use standard layout containers ([`AppLayout.tsx`](src/components/layout/AppLayout.tsx) for dealer views, [`AdminLayout.tsx`](src/components/layout/AdminLayout.tsx) for operations).
