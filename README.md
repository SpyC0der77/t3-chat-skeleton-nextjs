# T3 Chat UI Skeleton

A Next.js recreation of the T3 Chat interface for experimenting with its layout and styling.

## What it does

- Resizable and collapsible sidebar.
- Chat composer and model-selection interface.
- Theme switching and responsive sidebar behavior.

## Run locally

Use Node.js 20.9+ and npm.

```bash
git clone https://github.com/SpyC0der77/t3-chat-skeleton-nextjs.git
cd t3-chat-skeleton-nextjs
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production app |
| `npm run start` | Serve a production build |
| `npm run lint` | Run ESLint |

Run `build` before `start`.

## Dependencies and limitations

This is a frontend skeleton. It does not connect to an AI model, stream responses, authenticate users, or store conversations in a backend. Some controls are placeholders.

## Source layout

- [`src/app/page.tsx`](src/app/page.tsx): Interface and sidebar resize behavior.
- [`src/app/globals.css`](src/app/globals.css): Theme and interface styles.
- [`src/components/ui/sidebar.tsx`](src/components/ui/sidebar.tsx): Sidebar primitives.
