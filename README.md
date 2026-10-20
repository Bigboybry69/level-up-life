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

- Choose a name, fantasy class, ancestry, gender (male or female), and age (teen, adult, or elderly). Nine ancestry-specific illustration atlases provide 54 appearance combinations with a live preview. Choices are cosmetic, inspired by 5e tabletop character creation, without a full 5e rules implementation.
- Log today's total steps from your phone/watch. Updating a total replaces it instead of double-counting. Every 100 steps earns 5 XP; every 500 XP grants a level. The walking quest shows XP already earned, without a second bonus.
- Optional GPS walks estimate steps using 0.75 meters per step. GPS noise is filtered by accuracy and plausible walking speed, but estimates can still be inaccurate. Keep the page open; browser background tracking is unreliable. No route history is retained. Avoid logging the same walk again from your phone total.
- Your first check-in saves a daily spot with explicit confirmation. Subsequent check-ins require GPS accuracy within 100 m and a position within 200 m of that spot. One check-in earns 50 XP per local calendar day. Activity keeps a consecutive-day streak.
- All character, daily totals, and daily spot data live in this browser's localStorage. There is no backend, account, location upload, or cross-device sync. Visitors get their own local character; shared browser profiles share data. Clearing browser data loses progress. Reset local data removes the saved spot too.
- Apple Health and Android Health Connect do **not** connect directly to this website. A native companion and appropriate permissions are needed for automatic imports. The interface clearly marks this integration as coming later.

This is an editable prototype: manual totals are trusted and local state can be edited. It is not an anti-cheat system or an official Dungeons & Dragons product. Next steps could include authentication, a database with private per-user records, native health integration, and more character artwork.

The Google Fonts stylesheet is optional; the app falls back to system fonts if unavailable.

## Visual design

The home page uses a parchment character-sheet layout with original ink-and-cel-shaded fantasy artwork. `assets/characters/` holds nine transparent ancestry atlases. Each has male/female columns and teen/adult/elderly rows. `character-art.js` maps each of the 54 choices to its atlas cell; both the editor preview and saved character use the same mapping. Artwork is pre-generated, so no external image API or keys are needed at runtime. Class outfits are shared for now. The build copies the assets directory into the GitHub Pages artifact.

Previously saved characters retain their name, class, ancestry, and XP. Missing ages default to Adult. Gender values outside the two current options default to Female and can be changed in Edit character. Editing appearance never resets activity history.

## Pages and navigation

Character (`index.html`), Daily quests (`quests.html`), and Connections (`connections.html`) are separate generated HTML pages. Each includes its own visible content before JavaScript runs, so ordinary links and refresh work even if the navigation script cannot load. When JavaScript is available, navigation updates the screen without interrupting a GPS walk. All pages share the same saved character and activity history. Old hash links redirect to the matching page. The build versions CSS, JavaScript, and module imports together to avoid mixed cached releases. Run `npm run dev` to build and serve the pages from `dist`.

Achievements (`achievements.html`) contains the character details, achievements record, XP, movement, and streak panels. The character home screen is a viewport-sized portrait with character editing, designed to fit an iPhone 16 viewport (393 × 852 CSS pixels) and shorter browser viewports without page scrolling.

## Ability scores

Six ability scores flank the portrait: Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma, with their 5e modifiers. All 13 listed classes, including Artificer, use the base standard array **15, 14, 13, 12, 10, 8**. A single primary gets 15 and the selected secondary gets 14. Monk (DEX/WIS), Paladin (STR/CHA), and Ranger (DEX/WIS) have two primary abilities receiving 15 and 14; their secondary gets 13. Class alternatives follow the reference priorities (for example, Fighter randomly chooses STR or DEX). Remaining scores are shuffled among the remaining abilities.

Allocation is generated once and saved with the character; reloading, editing appearance, or earning XP does not reroll it. Changing class generates a matching allocation with a preview before saving. Cancel leaves saved scores unchanged. Existing characters gain saved scores automatically without changing activity history. These are base scores, without ancestry bonuses or level-based ability increases.

## Theme

The sun/moon button in the header switches between light parchment and dark parchment on every page. Without a saved preference, the app follows the device color scheme and reacts to system changes. A manual choice is saved separately from character data and syncs across tabs. Theme initialization runs before the stylesheet to avoid a light flash on dark-mode startup. The toggle also works for the current session if browser storage is blocked.

## Install on iPhone

Open the deployed site in Safari, then choose **Share → Add to Home Screen** (enable **Open as Web App** if offered). Launch the Home Screen icon for standalone mode without Safari's address bar or tabs. An older shortcut may need to be added again after this update; check the new installation before removing the old one. Regular browser tabs retain browser controls.

The web manifest uses relative scope and start URLs for GitHub Pages subpaths, with 192px/512px install icons. All pages also include Apple's standalone metadata and the 180px touch icon. The layout accounts for the status area and Home indicator. This remains a free hosted web app; standalone mode does not add native HealthKit access, offline support, or reliable background GPS tracking.
