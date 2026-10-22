import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Alert, Button, Dialog, useToast } from "../index";

const meta = { title: "Feedback/Messages", component: Alert, args: { title: "Budget closes Friday", children: "Submit requests by 5 pm to include them this quarter." } } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Warning: Story = { args: { tone: "warn", title: "2 requests are missing a cost center" } };
export const ErrorAlert: Story = { args: { tone: "err", title: "Couldn’t reach the payments service", children: "Your changes are saved. Try again in a few minutes." } };
export const Toast: Story = {
  render: () => { const { toast } = useToast(); return <Button onClick={() => toast("Report published")}>Publish report</Button>; },
};
export const ConfirmDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (<>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete “Q4 forecast”?"
        actions={<><Button onClick={() => setOpen(false)}>Keep project</Button><Button variant="danger" onClick={() => setOpen(false)}>Delete project</Button></>}>
        This removes the project and its 12 reports for everyone. You can’t undo this.
      </Dialog>
    </>);
  },
};
