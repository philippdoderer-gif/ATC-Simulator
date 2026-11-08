# ATC Simulator

Browser-based air traffic control simulator (Munich EDDM, Frankfurt EDDF, London Heathrow EGLL) – Ground, Tower, Center, multiplayer. Simulation only, not for real navigation.

- `index.html` – the built single-file game (generated, do not edit by hand)
- `src/` – source parts; run `cd src && python3 build.py` to regenerate `index.html`
- `src/data/` – airport geometry (OpenStreetMap, ODbL)
- `manifest.webmanifest`, `sw.js`, `icon-*.png` – installable offline app (PWA)

Hosting: GitHub Pages → Settings → Pages → Deploy from branch `main`, `/ (root)`.
