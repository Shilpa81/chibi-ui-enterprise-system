import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ChibiRoot, Button, Badge, Field, Select, Checkbox, Switch, Tabs, DataTable, Pagination, ToastProvider, useToast,
} from "./index";

describe("ChibiRoot", () => {
  it("sets theme and density tokens", () => {
    const { container } = render(<ChibiRoot theme="dark" density="compact">x</ChibiRoot>);
    expect(container.firstChild).toHaveAttribute("data-theme", "dark");
    expect(container.firstChild).toHaveAttribute("data-density", "compact");
  });
});

describe("Button and Badge", () => {
  it("applies the variant class and respects disabled", async () => {
    const onClick = vi.fn();
    render(<Button variant="primary" disabled onClick={onClick}>Save changes</Button>);
    const btn = screen.getByRole("button", { name: "Save changes" });
    expect(btn).toHaveClass("cb-btn--primary");
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
  it("renders a tone class", () => {
    render(<Badge tone="ok">Approved</Badge>);
    expect(screen.getByText("Approved")).toHaveClass("cb-badge--ok");
  });
});

describe("Field and Select", () => {
  it("links the error message to the input", () => {
    render(<Field id="amt" label="Amount" error="Enter a number" />);
    const input = screen.getByLabelText("Amount");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a number");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a number");
  });
  it("shows the hint when there is no error", () => {
    render(<Field id="cc" label="Cost center" hint="Find it on your budget sheet." />);
    expect(screen.getByLabelText("Cost center")).toHaveAccessibleDescription("Find it on your budget sheet.");
  });
  it("select reports changes", async () => {
    const onChange = vi.fn();
    render(<Select id="s" label="Region" onChange={onChange} options={[{ value: "us", label: "US" }, { value: "eu", label: "EU" }]} />);
    await userEvent.selectOptions(screen.getByLabelText("Region"), "eu");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Region")).toHaveValue("eu");
  });
});

describe("Checkbox and Switch", () => {
  it("checkbox toggles", async () => {
    render(<Checkbox id="c" label="Send me a copy" />);
    const box = screen.getByLabelText("Send me a copy");
    await userEvent.click(box);
    expect(box).toBeChecked();
  });
  it("switch flips aria-checked", async () => {
    function Demo() { const [on, setOn] = useState(false); return <Switch id="sw" label="Email alerts" checked={on} onChange={setOn} />; }
    render(<Demo />);
    const sw = screen.getByRole("switch", { name: "Email alerts" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });
});

describe("Tabs", () => {
  it("moves selection with arrow keys", async () => {
    render(<Tabs tabs={[{ id: "a", label: "Open", panel: "Open panel" }, { id: "b", label: "Closed", panel: "Closed panel" }]} />);
    const first = screen.getByRole("tab", { name: "Open" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Closed" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Closed panel");
  });
});

describe("DataTable", () => {
  const rows = [{ name: "Charlie", amt: 3 }, { name: "Alice", amt: 1 }, { name: "Bob", amt: 2 }];
  const cols = [{ key: "name" as const, header: "Name" }, { key: "amt" as const, header: "Amount", numeric: true }];
  it("sorts ascending then descending and announces it", async () => {
    render(<DataTable caption="People" columns={cols} rows={rows} />);
    const header = screen.getByRole("columnheader", { name: /Name/ });
    expect(header).toHaveAttribute("aria-sort", "none");
    await userEvent.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Alice");
    await userEvent.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Charlie");
  });
});

describe("Pagination", () => {
  it("disables Previous on the first page and goes to the next page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });
});

describe("Toast", () => {
  function Demo() { const { toast } = useToast(); return <Button onClick={() => toast("Report published")}>Publish</Button>; }
  it("shows a message then removes it", async () => {
    render(<ToastProvider duration={50}><Demo /></ToastProvider>);
    await userEvent.click(screen.getByRole("button", { name: "Publish" }));
    expect(screen.getByRole("status")).toHaveTextContent("Report published");
    await waitFor(() => expect(screen.getByRole("status")).not.toHaveTextContent("Report published"));
  });
  it("falls back gracefully outside the provider", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => render(<Demo />)).not.toThrow();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
    spy.mockRestore();
  });
});
