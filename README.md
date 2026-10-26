# Mukund Garg Notebook Portfolio

A notebook-inspired Next.js portfolio for Mukund Garg's applied AI, backend systems, computer vision, and automation work. Projects, skills, experience, and education are presented in a reactive editor layout with a filterable variables inspector.

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
- `components/notebook-portfolio.tsx` — notebook interface, interactive cells, chart, and portfolio sections
- `lib/portfolio-data.ts` — single source of truth for portfolio content and links
- `app/globals.css` — visual system and responsive notebook layout

The page uses normal document scrolling. Its chart is generated from the portfolio's skill data, and the add-cell control provides a local editable Markdown preview; it does not require a Python server or embed a separate application.

## Resume

The resume link points to `public/Mukund_Garg_Resume.pdf` when that file is present.
