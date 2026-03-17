## MECC_EID_CARD – Eid Mubarak Celestial Celebration

An interactive, single-page **Eid Mubarak** celebration site built with **Next.js (App Router)**, **React**, and **Tailwind CSS**. It’s designed to feel premium and cinematic: glassmorphism UI, animated elements, theme switching, a personalized greeting, and a card-first “Eid Card Studio” experience.

## Project Overview

This project is a modern frontend landing page / greeting card generator:

- A **reload intro popup** (“Eid Mubarak”) with a glassy blur overlay and smooth transitions.
- A **card-focused** layout where the digital Eid card is the centerpiece.
- A **personalized greeting**: type a name and see “Eid Mubarak, [Name]!” with celebratory animations.
- **Dark & light mode** with a distinct look and typography feel.
- **Ambient audio toggle** (recommended to use a local MP3 for best reliability).
- **Sticker system** for adding festive decals to the card preview (SVG defaults; you can replace with PNG).

### Tech Stack

- **Next.js 14 (App Router)**
- **React 18**
- **Tailwind CSS 3**
- TypeScript

## Prerequisites

- **Node.js**: 18+ recommended (LTS)
- **npm**: comes with Node

You can check versions:

```bash
node -v
npm -v
```

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Open the URL shown in your terminal (usually `http://localhost:3000`).

## Scripts

- **dev**: `npm run dev` – start development server
- **build**: `npm run build` – production build
- **start**: `npm run start` – run production server
- **lint**: `npm run lint` – lint project

## Customization

### Add your own ambient music

Place your audio file here:

- `public/assets/music/ambient.mp3`

Then use the **Play ambience** button in the header. (Browsers may block playback until there is a user interaction — the button click counts as interaction.)

### Add / replace stickers

Default stickers live here:

- `public/assets/stickers/sticker-moon.svg`
- `public/assets/stickers/sticker-lantern.svg`
- `public/assets/stickers/sticker-star.svg`

You can replace these with your own **PNG** stickers by keeping the same filenames (or add more and wire them into the `stickerSources` list in `app/page.tsx`).

### Replace the logo

The title logo used in the header is:

- `public/assets/logo/logo.png`

### Notes

- **Dark mode**: starry canvas background + night palette.
- **Light mode**: brighter palette with improved text contrast.
- **Personalization**: Enter a name to trigger the greeting animation.
- **Card variants**: The preview can shuffle its sticker/message.

## Project Structure (high level)

- `app/layout.tsx`: fonts + root layout
- `app/page.tsx`: the main single-page experience (popup, greeting, card studio, theme + audio)
- `app/globals.css`: global styles + theme font/background switching
- `public/assets/logo/`: logo image(s)
- `public/assets/music/`: local audio (optional)
- `public/assets/stickers/`: sticker assets used by the card preview

