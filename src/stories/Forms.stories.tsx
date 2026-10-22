import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Field, Select, Checkbox, Switch } from "../index";

const meta: Meta = { title: "Forms/Inputs", component: Field };
export default meta;
type Story = StoryObj;

export const TextField: Story = { args: { id: "cc", label: "Cost center", defaultValue: "CC-4410", hint: "Find it on your team’s budget sheet." } };
export const WithError: Story = { args: { id: "amt", label: "Amount (USD)", error: "Enter an amount as a number, like 1250.50." } };
export const SelectField: Story = {
  render: () => <Select id="region" label="Region" options={[{ value: "us", label: "United States" }, { value: "eu", label: "Europe" }]} />,
};
export const CheckboxField: Story = { render: () => <Checkbox id="copy" label="Send me a copy" /> };
export const SwitchField: Story = {
  render: () => { const [on, setOn] = useState(true); return <Switch id="alerts" label="Email alerts" checked={on} onChange={setOn} />; },
};
