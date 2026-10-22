import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Badge } from "../index";

const meta = { title: "Actions/Button", component: Button, args: { children: "Save changes", variant: "primary" } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Danger: Story = { args: { variant: "danger", children: "Delete project" } };
export const Disabled: Story = { args: { disabled: true, children: "Saving…" } };
export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge>Draft</Badge><Badge tone="info">In review</Badge><Badge tone="ok">Approved</Badge>
      <Badge tone="warn">Needs info</Badge><Badge tone="err">Rejected</Badge>
    </div>
  ),
};
