# @roobli/canvas

> **Experimental.** Frozen until Noto decides to host canvas documents; the API
> may change, or the package may be retired. See decision D6 in
> [Noto's direction](https://roobli.github.io/Noto.docs/direction/decisions).

React primitives for a Noto canvas: a live document of tables, stats and
short findings, not a Markdown note. The shapes match what a Cursor
`.canvas.tsx` file already uses (`Stack`, `Table`, `Callout`, `useHostTheme`),
so a landscape file can move with a changed import. The colour is Noto's, not
Cursor's.

Noto itself is AGPL-3.0. This package is MIT, so a host that is not Noto can
depend on it without inheriting that copyleft. Noto does not yet compile a
vault file as a canvas; that is a later host, and it is a sandbox problem,
not a plugin problem. Until then, import the kit in any React 18+ tree.

```ts
import {
  Callout,
  CanvasHost,
  H1,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "@roobli/canvas";

export default function Landscape() {
  const theme = useHostTheme();
  return (
    <CanvasHost theme="light">
      <Stack gap={16}>
        <H1>MicroVM landscape</H1>
        <Callout tone="info" title="A microVM is a small virtual machine">
          Docker's default isolation is namespaces plus cgroups.
        </Callout>
        <Stat value="5" label="VMMs in scope" />
        <Table
          headers={["Project", "License"]}
          rows={[["Firecracker", "Apache-2.0"]]}
        />
        <Text tone="tertiary" style={{ color: theme.text.tertiary }}>
          Checked 9 Sep 2026.
        </Text>
      </Stack>
    </CanvasHost>
  );
}
```

Install from git until the package is on npm:

```
pnpm add github:roobli/canvas
```

## Palette, type, layout

Copied from Noto's chrome, not invented here.

Paper `#FAF9F6`, panel `#F3F1EC`, ink `#34312E`, muted `#6F6B66`, hairline
`#DDD9D2`, accent `#A85D3B`. Dark counterparts are the same names on
`#1F1E1C`. Accent is a two-pixel spine on a `Callout` (info and neutral)
and the colour of a link and an `info` stat. It is not a filled button.
Success, warning and danger still use Noto's status greens and reds.

UI face is the PingFang stack Noto already uses for chrome. Identifiers use
Menlo. Headings stay on the UI face: a canvas is an analytical surface, not
the Songti document column.

```
[ H1                                         ]
[ Callout, 2px spine                         ]
[ Stat     Stat     Stat                     ]
[ H2                                         ]
[ Table                                      ]
[ text column                 | named Card   ]
```

Do not wrap every section in `Card`. Do not use gradients, box-shadows, or
emoji as decoration. `useHostTheme()` is the token object; `theme.text.primary`
and `theme.ink` are the same colour. The terracotta value is
`theme.accent.primary` (an object), not a string named `accent`.

`CanvasHost` sets the Noto CSS variables (`--paper`, `--ink`, `--accent`, …)
on its root. Inside Noto, components that sit under `:root[data-theme]` can
skip the host and read those variables. Elsewhere, pass `theme="light"` or
`"dark"`, or `"system"` for `prefers-color-scheme`.

`Button variant="primary"` is an ink outline on paper. Terracotta fill would
spend the spine colour on a control, which is the mistake Noto's chrome
already walked back.

## What is not in v0

Charts, DAG layout, diff view, todo lists and usage bars. Add them when a
canvas needs them. `useCanvasState` is React state, plus an optional `store`
on `CanvasHost` if the host wants a sidecar. `useCanvasAction` is `openFile`
and `openUrl`; a host supplies `onAction`. There is no IDE agent dispatch.

A `.canvas.tsx` file that default-exports a component and imports only this
package is the authoring contract. Compiling that file from a vault is code
execution. Noto's experimental plugin origin is the place that belongs,
when it opens, not `eval` in the editor renderer.

## Scripts

`pnpm verify` typechecks, tests and emits `dist/`. Node 22, pnpm 11.
