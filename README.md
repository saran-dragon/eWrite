# e write

A static React application for electrical and plumbing material notes and shop purchase tracking.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```
The production-ready static site is generated in `dist/`.

## Data storage
Predefined catalogues are JavaScript arrays in `src/data/catalogue.js`.
User-added notes, custom catalogue materials and purchase lists are saved in browser LocalStorage. Data is local to the browser/device and does not sync automatically. Export a JSON backup from Settings regularly.

## Deploy
Upload the contents of `dist/` to any static host such as Netlify, Vercel static hosting or GitHub Pages. For GitHub Pages, configure Vite's `base` option to match the repository path.

## Important
The starter catalogue contains practical suggested options. Verify sizes and compatibility against the specific pipe standard and manufacturer before using them for purchasing.
