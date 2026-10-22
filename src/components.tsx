import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";
type Density = "comfortable" | "compact";

/** Wrap your app once. Sets theme + density tokens for everything inside. */
export function ChibiRoot({ theme = "light", density = "comfortable", children }:
  { theme?: Theme; density?: Density; children: React.ReactNode }) {
  return <div className="cb-root" data-theme={theme} data-density={density}>{children}</div>;
}

export function Button({ variant = "secondary", className = "", ...p }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={`cb-btn cb-btn--${variant} ${className}`} {...p} />;
}

export function Badge({ tone = "neutral", children }:
  { tone?: "neutral" | "ok" | "warn" | "err" | "info"; children: React.ReactNode }) {
  return <span className={`cb-badge${tone === "neutral" ? "" : ` cb-badge--${tone}`}`}>{children}</span>;
}

export function Field({ label, hint, error, id, ...p }:
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; id: string }) {
  const desc = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  return (
    <div className="cb-field">
      <label className="cb-label" htmlFor={id}>{label}</label>
      <input id={id} className="cb-input" aria-invalid={!!error} aria-describedby={desc} {...p} />
      {error ? <span id={`${id}-e`} className="cb-error" role="alert">{error}</span>
             : hint && <span id={`${id}-h`} className="cb-hint">{hint}</span>}
    </div>
  );
}

export function Alert({ tone = "info", title, children }:
  { tone?: "info" | "ok" | "warn" | "err"; title: string; children?: React.ReactNode }) {
  return (
    <div className={`cb-alert${tone === "info" ? "" : ` cb-alert--${tone}`}`} role={tone === "err" ? "alert" : "status"}>
      <strong>{title}</strong>{children && <span>{children}</span>}
    </div>
  );
}

export function Tabs({ tabs }: { tabs: { id: string; label: string; panel: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (n === null) return;
    const t = tabs[(n + tabs.length) % tabs.length];
    setActive(t.id); document.getElementById(`tab-${t.id}`)?.focus();
  };
  return (
    <div>
      <div className="cb-tabs" role="tablist">
        {tabs.map((t, i) => (
          <button key={t.id} id={`tab-${t.id}`} role="tab" className="cb-tab" aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1} onClick={() => setActive(t.id)} onKeyDown={(e) => onKey(e, i)}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel" aria-labelledby={`tab-${active}`} style={{ paddingTop: "var(--cb-s4)" }}>
        {tabs.find((t) => t.id === active)?.panel}
      </div>
    </div>
  );
}

export type Column<T> = { key: keyof T & string; header: string; numeric?: boolean; render?: (row: T) => React.ReactNode };

export function DataTable<T extends Record<string, any>>({ columns, rows, caption }:
  { columns: Column<T>[]; rows: T[]; caption: string }) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const data = sort ? [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir) : rows;
  return (
    <div className="cb-tablewrap">
      <table className="cb-table">
        <caption style={{ position: "absolute", left: -9999 }}>{caption}</caption>
        <thead><tr>{columns.map((c) => (
          <th key={c.key} className={`cb-th${c.numeric ? " num" : ""}`}
            aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
            <button onClick={() => setSort({ key: c.key, dir: sort?.key === c.key && sort.dir === 1 ? -1 : 1 })}>
              {c.header}{sort?.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : ""}</button>
          </th>))}</tr></thead>
        <tbody>{data.map((r, i) => (
          <tr key={i}>{columns.map((c) => <td key={c.key} className={c.numeric ? "num" : ""}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

/** Uses native <dialog>: focus trap, Esc to close, and backdrop come for free. */
export function Dialog({ open, onClose, title, children, actions }:
  { open: boolean; onClose: () => void; title: string; children: React.ReactNode; actions: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current; if (!d) return; open && !d.open ? d.showModal() : !open && d.open && d.close(); }, [open]);
  return (
    <dialog ref={ref} className="cb-dialog" onClose={onClose} aria-labelledby="cb-dlg-t">
      <h3 id="cb-dlg-t">{title}</h3><p>{children}</p><footer>{actions}</footer>
    </dialog>
  );
}

export function Select({ label, hint, error, id, options, ...p }:
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string; error?: string; id: string; options: { value: string; label: string }[] }) {
  const desc = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  return (
    <div className="cb-field">
      <label className="cb-label" htmlFor={id}>{label}</label>
      <select id={id} className="cb-input cb-select" aria-invalid={!!error} aria-describedby={desc} {...p}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error ? <span id={`${id}-e`} className="cb-error" role="alert">{error}</span>
             : hint && <span id={`${id}-h`} className="cb-hint">{hint}</span>}
    </div>
  );
}

export function Checkbox({ label, id, ...p }:
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string; id: string }) {
  return (
    <label className="cb-check" htmlFor={id}>
      <input id={id} type="checkbox" {...p} /><span>{label}</span>
    </label>
  );
}

export function Switch({ id, label, checked, onChange }:
  { id: string; label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="cb-switchrow">
      <button id={id} type="button" role="switch" className="cb-switch" aria-checked={checked}
        aria-labelledby={`${id}-l`} onClick={() => onChange(!checked)}><i /></button>
      <span id={`${id}-l`}>{label}</span>
    </div>
  );
}

export function Pagination({ page, pageCount, onPageChange }:
  { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  return (
    <nav className="cb-pager" aria-label="Pagination">
      <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
      <span aria-live="polite">Page {page} of {pageCount}</span>
      <Button disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Next</Button>
    </nav>
  );
}

type ToastItem = { id: number; message: string };
const ToastContext = createContext<{ toast: (message: string) => void } | null>(null);

/** Wrap your app once, then call `useToast().toast("Report published")` anywhere inside. */
export function ToastProvider({ duration = 4000, children }: { duration?: number; children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const next = useRef(0);
  const toast = useCallback((message: string) => {
    const id = next.current++;
    setItems((l) => [...l, { id, message }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), duration);
  }, [duration]);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="cb-toasts" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className="cb-toast">{t.message}</div>)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      console.warn("useToast was called outside <ToastProvider>; using a no-op toast.");
    }
    return { toast: () => undefined };
  }
  return ctx;
}
