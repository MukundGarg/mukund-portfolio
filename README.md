# Mukund Garg Portfolio

A native Next.js portfolio for Mukund Garg's applied AI, backend systems, computer vision, and automation work.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Structure

- `app/page.tsx` — route entry
- `components/native-portfolio.tsx` — semantic page composition and project diagrams
- `components/hero-neural-canvas.tsx` — isolated deterministic hero ANN canvas
- `lib/portfolio-data.ts` — single source of truth for portfolio content and links
- `app/globals.css` — visual system and responsive layout

The portfolio uses normal document scrolling and does not depend on an iframe or a separate public HTML application.

## Resume

The resume link points to `public/Mukund_Garg_Resume.pdf` when that file is present.
