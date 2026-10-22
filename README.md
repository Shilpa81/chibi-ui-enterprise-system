# Chibi UI - Enterprise UI System

Enterprise React + TypeScript UI system. Theme (light/dark) and density (comfortable/compact) are driven by CSS tokens.

## Install

```bash
npm install chibi-ui
```

Peer dependencies: `react` and `react-dom` 18 or newer.

## Use

```tsx
import "chibi-ui/styles.css";
import { ChibiRoot, ToastProvider, Button, Badge, useToast } from "chibi-ui";

function SaveButton() {
  const { toast } = useToast();
  return <Button variant="primary" onClick={() => toast("Changes saved")}>Save changes</Button>;
}

export default function App() {
  return (
    <ChibiRoot theme="light" density="compact">
      <ToastProvider>
        <SaveButton />
        <Badge tone="ok">Approved</Badge>
      </ToastProvider>
    </ChibiRoot>
  );
}
```

Add the font once (optional, falls back to system fonts):
`https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap`

Works in Next.js: components ship with `"use client"`.

## Components

| Group | Components |
| --- | --- |
| Setup | `ChibiRoot`, `ToastProvider` |
| Actions | `Button`, `Badge` |
| Forms | `Field`, `Select`, `Checkbox`, `Switch` |
| Feedback | `Alert`, `Dialog`, `useToast` |
| Data & navigation | `DataTable`, `Tabs`, `Pagination` |

## Tokens

All tokens are CSS variables prefixed `--cb-` (for example `--cb-brand`, `--cb-surface`, `--cb-h`). Override them in your own CSS to re-brand.

## Accessibility

Visible focus ring, `aria-sort` on table headers, arrow-key navigation in tabs, `role="switch"` for switches, focus-trapping native `<dialog>`, `role="alert"` on errors, a live region for toasts and page changes, reduced motion respected.

## Develop

```bash
npm install
npm run storybook        # component docs with theme + density switches
npm test                 # unit tests (Vitest + Testing Library)
npm run typecheck
npm run build
```

## License

MIT
