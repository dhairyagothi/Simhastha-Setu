# Simhastha-Setu
SimhasthaSetu ✦ सिम्हस्था सेतु - A hackathon demo project for Ujjain Simhastha 2028 (ExpertHire x VIT Bhopal)

This scaffold provides a minimal React + Vite + Tailwind TypeScript starter tailored to the KumbhShield MVP.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Set your Claude API key (optional for demo/mocks):

- Create a `.env` file with `VITE_CLAUDE_API_KEY=your_key_here`

3. Run the dev server:

```bash
npm run dev
```

Notes

- Claude API calls are stubbed and will fallback to mock responses if no key is provided. See `src/utils/claude.ts`.
- Seed data is loaded on app start into `localStorage` so the dashboard shows pre-populated incidents, units, alerts, and missing cases.

Design system and branding guidelines are in the project root as `BRANDING.md`.
