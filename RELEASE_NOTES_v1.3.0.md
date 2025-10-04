## Highlights
- 🔒 **Starting planet is now hard‑enforced** — the first leg always begins at your selected start (adds a deadhead leg if needed).
- 🔁 **Auto‑selects repeating loop** when it yields higher **q/hr** than running all missions.
- 🧭 **Preview 3 full cycles** for repeat loops when no time budget is set.
- 📝 Status line shows when a repeat cycle was chosen.

## What’s changed
- **app.js**
  - Added `ensureStartPlanet(res, start)` enforcement **after all planning stages**.
  - Added `expandRepeatCycles(res, n)` for better visualization (defaults to 3 cycles).
  - Fixed repeat logic so it no longer mutates the original start.
  - Displays note when repeating cycle is more profitable.

## How to upgrade
1. Replace your local `app.js` in the repo root.
2. Commit and push:
   ```bash
   git add app.js
   git commit -m "fix: hard-enforce Start + prefer repeat cycles for higher q/hr"
   git push
   ```

If hosted on **GitHub Pages**, the update is live after push.

## Verification checklist
- ✅ Starting planet (Alioth) always respected.
- ✅ Repeat loop preview begins with Alioth→Jago deadhead.
- ✅ 3-cycle preview if no time budget, time fill if limited.

Developed by **R55BNN @ TerraVerse Industries**.
