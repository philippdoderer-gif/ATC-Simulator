# ATC Simulator – iPad / iPhone app (Capacitor)

The game is bundled inside the app (works offline); multiplayer and live weather use the internet.

## Requirements
- A Mac with Xcode 15+ and Node.js
- Apple Developer account (99 USD/year) for installing on a real device / TestFlight / App Store

## Steps (on the Mac)
```bash
cd app
npm install
npx cap add ios        # generates the ios/ Xcode project (once)
npm run ios            # copies the game, syncs and opens Xcode
```
In Xcode: select the "App" target → Signing & Capabilities → choose your Team → pick your iPad → Run.
For TestFlight/App Store: Product → Archive → Distribute App.

## Update the game later
Rebuild `index.html` (`cd ../src && python3 build.py`), then `npm run ios`.

Before App Store submission see the legal checklist (Impressum/Datenschutz, disclaimers, local fonts instead of Google Fonts).
