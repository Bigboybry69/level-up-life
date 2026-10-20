# Level Up Life

A responsive, fantasy-inspired daily movement RPG. Create a character, log steps, track an optional GPS walk, and check in at your own daily spot to earn XP.

## Run locally

Requires Node.js 24 for tests/build and Python 3 for the development server. No package installation or API keys are needed.

```sh
npm test
npm run build
npm run dev
```

The development server listens on port 5173. Location access requires HTTPS on a deployed site (or a browser's localhost secure-context exception).

## Publish through GitHub

Push this project to the repository's `main` branch. In GitHub **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow tests, builds, and publishes the static site. GitHub supplies the public URL after a successful deployment. Deployment must be enabled and the changes pushed before the app has a public URL.

## First version

- Choose a name, fantasy class, ancestry, and optional gender. Choices are cosmetic, inspired by 5e tabletop character creation, without a full 5e rules implementation.
- Log today's total steps from your phone/watch. Updating a total replaces it instead of double-counting. Every 100 steps earns 5 XP; every 500 XP grants a level. The walking quest shows XP already earned, without a second bonus.
- Optional GPS walks estimate steps using 0.75 meters per step. GPS noise is filtered by accuracy and plausible walking speed, but estimates can still be inaccurate. Keep the page open; browser background tracking is unreliable. No route history is retained. Avoid logging the same walk again from your phone total.
- Your first check-in saves a daily spot with explicit confirmation. Subsequent check-ins require GPS accuracy within 100 m and a position within 200 m of that spot. One check-in earns 50 XP per local calendar day. Activity keeps a consecutive-day streak.
- All character, daily totals, and daily spot data live in this browser's localStorage. There is no backend, account, location upload, or cross-device sync. Visitors get their own local character; shared browser profiles share data. Clearing browser data loses progress. Reset local data removes the saved spot too.
- Apple Health and Android Health Connect do **not** connect directly to this website. A native companion and appropriate permissions are needed for automatic imports. The interface clearly marks this integration as coming later.

This is an editable prototype: manual totals are trusted and local state can be edited. It is not an anti-cheat system or an official Dungeons & Dragons product. Next steps could include authentication, a database with private per-user records, native health integration, and more character artwork.

The Google Fonts stylesheet is optional; the app falls back to system fonts if unavailable.
