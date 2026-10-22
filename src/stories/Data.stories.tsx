import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DataTable, Badge, Pagination, Tabs } from "../index";

type Row = { id: string; item: string; amount: number; status: string };
const rows: Row[] = [
  { id: "PR-2041", item: "Network switches", amount: 8880, status: "Needs info" },
  { id: "PR-2043", item: "Design licenses", amount: 1204.5, status: "In review" },
  { id: "PR-2049", item: "Laptop refresh", amount: 22150, status: "Approved" },
];
const tone = (s: string) => (s === "Approved" ? "ok" : s === "Needs info" ? "warn" : "info") as "ok" | "warn" | "info";

const meta: Meta = { title: "Data/Table", component: DataTable };
export default meta;
type Story = StoryObj;

export const Sortable: Story = {
  args: {
    caption: "Purchase requests", rows,
    columns: [
      { key: "id", header: "Request" }, { key: "item", header: "Item" },
      { key: "amount", header: "Amount", numeric: true, render: (r: Row) => r.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
      { key: "status", header: "Status", render: (r: Row) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
    ],
  },
};
export const Paged: Story = {
  render: () => { const [p, setP] = useState(1); return <Pagination page={p} pageCount={8} onPageChange={setP} />; },
};
export const TabbedViews: Story = {
  render: () => <Tabs tabs={[{ id: "o", label: "Open", panel: "4 requests need review." }, { id: "c", label: "Closed", panel: "12 requests this quarter." }]} />,
};
