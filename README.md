# Destiny's Cards — Web Version

A browser version of the Tarot mobile app. Browse all 78 cards by suit, save favorites to your Reading Aid, and draw a six-card fortune spread.

## Local development

```bash
cd TarotWebVersion
npm install
npm run dev
```

Open `http://localhost:5173/Tarot/` (Vite uses the `/Tarot/` base path to match GitHub Pages).

## Deploy

Pushes to `master` run `.github/workflows/deploy-web.yml`, which builds this folder and publishes to GitHub Pages.

Live site: **https://qayim.github.io/Tarot/**

## Features

- Browse Cups, Wands, Swords, Pentacles, and Major Arcana
- Reading Aid — starred cards saved in your browser
- Fortune Telling — draw 6 unique cards (upright or reversed)
- Tap a card to toggle between keywords and full descriptions
