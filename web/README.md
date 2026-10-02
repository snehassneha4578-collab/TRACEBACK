# TRACEBACK

TRACEBACK is a single-case engineering knowledge diagnostic for a transistor-amplifier gain drop. It traces free-text reasoning against an authored dependency map, then uses a controlled bias experiment and bounded re-test loop to verify a repaired reasoning link.

## Run locally

Requirements: Node.js 20.9+ and npm.

```powershell
npm ci
npm run dev
```

Open <http://localhost:3000>. Run `npm run build` for a production build and `npm run lint` for static checks.

## MVP boundary

- One NPN common-emitter amplifier case with fixed bias presets.
- Deterministic evidence rules, no model/API calls.
- All learner state is in memory for the current page session only.
- No accounts, backend, database, or session history.
