import type { Preview } from "@storybook/react-vite";
import "../src/chibi.css";
import { ChibiRoot, ToastProvider } from "../src";

const preview: Preview = {
  globalTypes: {
    theme: { description: "Theme", toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true } },
    density: { description: "Density", toolbar: { title: "Density", icon: "component", items: ["comfortable", "compact"], dynamicTitle: true } },
  },
  initialGlobals: { theme: "light", density: "comfortable" },
  decorators: [
    (Story, ctx) => (
      <ChibiRoot theme={ctx.globals.theme} density={ctx.globals.density}>
        <ToastProvider>
          <div style={{ padding: 24, minHeight: 160 }}><Story /></div>
        </ToastProvider>
      </ChibiRoot>
    ),
  ],
  parameters: { layout: "fullscreen" },
};
export default preview;
