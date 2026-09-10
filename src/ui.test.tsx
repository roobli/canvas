import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { LandscapeDemo } from "./demo.js";
import { mergeStyle } from "./merge-style.js";
import { paletteLight, tokensFromPalette } from "./tokens.js";
import { CanvasHost, useCanvasState, useHostTheme } from "./theme.js";
import { Button, Callout, H1, Stack, Table, Text } from "./ui.js";

afterEach(() => {
  cleanup();
});

describe("mergeStyle", () => {
  it("lets the override win", () => {
    expect(mergeStyle({ padding: 8, color: "red" }, { color: "blue" })).toEqual({
      padding: 8,
      color: "blue",
    });
  });
});

describe("tokens", () => {
  it("maps Noto paper onto Cursor-shaped groups", () => {
    const tokens = tokensFromPalette(paletteLight);
    expect(tokens.bg.editor).toBe("#FAF9F6");
    expect(tokens.accent.primary).toBe("#A85D3B");
    expect(tokens.text.primary).toBe("#34312E");
  });
});

describe("primitives", () => {
  it("nests Text as a span inside a paragraph", () => {
    render(
      <CanvasHost theme="light">
        <Text>
          Use <Text weight="semibold">this</Text>
        </Text>
      </CanvasHost>,
    );
    const strong = screen.getByText("this");
    expect(strong.tagName).toBe("SPAN");
    expect(strong.parentElement?.tagName).toBe("P");
  });

  it("renders a table row and keeps primary buttons unfilled", () => {
    render(
      <CanvasHost theme="light">
        <Table headers={["Name"]} rows={[["Firecracker"]]} />
        <Button variant="primary">Save</Button>
      </CanvasHost>,
    );
    expect(screen.getByText("Firecracker")).toBeTruthy();
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.style.backgroundColor).toBe("rgb(250, 249, 246)");
    expect(button.style.borderColor).toBe("rgb(52, 49, 46)");
    expect(button.style.backgroundColor).not.toBe("rgb(168, 93, 59)");
  });

  it("hosts light and dark palettes", () => {
    function Kind() {
      const theme = useHostTheme();
      return createElement("span", null, theme.kind + ":" + theme.paper);
    }
    const { rerender } = render(
      <CanvasHost theme="dark">
        <Kind />
      </CanvasHost>,
    );
    expect(screen.getByText("dark:#1F1E1C")).toBeTruthy();
    rerender(
      <CanvasHost theme="light">
        <Kind />
      </CanvasHost>,
    );
    expect(screen.getByText("light:#FAF9F6")).toBeTruthy();
  });

  it("renders the landscape fixture", () => {
    render(
      <CanvasHost theme="light">
        <LandscapeDemo />
      </CanvasHost>,
    );
    expect(screen.getByRole("heading", { name: "MicroVM landscape" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Firecracker" })).toBeTruthy();
    expect(screen.getByText(/用户态内核/)).toBeTruthy();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.style.fontFamily).toContain("PingFang");
  });

  it("uses terracotta for info, not a second accent", () => {
    render(
      <CanvasHost theme="light">
        <Callout tone="info" title="Note">
          Body
        </Callout>
      </CanvasHost>,
    );
    const aside = screen.getByText("Note").closest("aside");
    expect(aside?.style.borderLeftColor).toBe("rgb(168, 93, 59)");
  });

  it("stacks with a gap", () => {
    render(
      <CanvasHost>
        <Stack gap={20}>
          <H1>Title</H1>
        </Stack>
      </CanvasHost>,
    );
    expect(screen.getByRole("heading", { name: "Title" }).parentElement?.style.gap).toBe(
      "20px",
    );
  });

  it("persists canvas state through the host store", () => {
    const memory = new Map<string, unknown>();
    const store = {
      get: (key: string) => memory.get(key),
      set: (key: string, value: unknown) => {
        memory.set(key, value);
      },
    };
    function Counter() {
      const [n, setN] = useCanvasState("n", 0);
      return (
        <button type="button" onClick={() => setN((v) => v + 1)}>
          {n}
        </button>
      );
    }
    const { unmount } = render(
      <CanvasHost store={store}>
        <Counter />
      </CanvasHost>,
    );
    screen.getByRole("button", { name: "0" }).click();
    expect(memory.get("n")).toBe(1);
    unmount();
    render(
      <CanvasHost store={store}>
        <Counter />
      </CanvasHost>,
    );
    expect(screen.getByRole("button").textContent).toBe("1");
  });
});

describe("preview html", () => {
  it("writes light and dark static pages", () => {
    const out = join(dirname(fileURLToPath(import.meta.url)), "..", "examples");
    mkdirSync(out, { recursive: true });
    for (const kind of ["light", "dark"] as const) {
      const paper = kind === "dark" ? "#1F1E1C" : "#FAF9F6";
      const body = renderToStaticMarkup(
        <CanvasHost theme={kind}>
          <LandscapeDemo />
        </CanvasHost>,
      );
      writeFileSync(
        join(out, `preview-${kind}.html`),
        `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>canvas ${kind}</title><style>html,body{margin:0;background:${paper};width:100%;max-width:100%;overflow-x:hidden;}</style></head><body>${body}</body></html>`,
      );
      expect(body.includes("MicroVM landscape")).toBe(true);
    }
    expect(existsSync(join(out, "preview-light.html"))).toBe(true);
    expect(existsSync(join(out, "preview-dark.html"))).toBe(true);
  });
});
