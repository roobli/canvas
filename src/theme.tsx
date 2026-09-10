import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { mergeStyle } from "./merge-style.js";
import {
  cssVarsFromPalette,
  documentHasNotoVars,
  paletteDark,
  paletteFromCssVars,
  paletteLight,
  readDocumentCssVar,
  tokensFromPalette,
  uiFace,
  type CanvasPalette,
  type CanvasTokens,
  type ThemeKind,
} from "./tokens.js";

export type CanvasAction =
  | { type: "openFile"; path: string }
  | { type: "openUrl"; href: string };

export type CanvasStore = {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
};

export type CanvasHostTheme = CanvasTokens & {
  kind: ThemeKind;
  tokens: CanvasTokens;
  palette: CanvasPalette;
  paper: string;
  panel: string;
  ink: string;
  hairline: string;
  muted: string;
};

export type SetCanvasState<T> = (action: T | ((prev: T) => T)) => void;

const ThemeContext = createContext<CanvasHostTheme | null>(null);
const ActionContext = createContext<((action: CanvasAction) => void) | null>(
  null,
);
const StoreContext = createContext<CanvasStore | null>(null);

function subscribeScheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => undefined;
  }
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function schemeSnapshot(): ThemeKind {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function buildHostTheme(
  kind: ThemeKind,
  palette: CanvasPalette = kind === "dark" ? paletteDark : paletteLight,
): CanvasHostTheme {
  const tokens = tokensFromPalette(palette);
  return {
    ...tokens,
    kind,
    tokens,
    palette,
    paper: palette.paper,
    panel: palette.panel,
    ink: palette.ink,
    hairline: palette.hairline,
    muted: palette.muted,
  };
}

export function themeFromDocument(): CanvasHostTheme | null {
  if (!documentHasNotoVars()) {
    return null;
  }
  const dark =
    document.documentElement.getAttribute("data-theme") === "dark" ||
    document.documentElement.dataset.theme === "dark";
  const kind: ThemeKind = dark ? "dark" : "light";
  const fallback = kind === "dark" ? paletteDark : paletteLight;
  const palette = paletteFromCssVars(readDocumentCssVar, fallback);
  return buildHostTheme(kind, palette);
}

export type CanvasHostProps = {
  children?: ReactNode;
  theme?: "light" | "dark" | "system";
  onAction?: (action: CanvasAction) => void;
  store?: CanvasStore;
  style?: CSSProperties;
};

export function CanvasHost({
  children,
  theme = "system",
  onAction,
  store,
  style,
}: CanvasHostProps): JSX.Element {
  const scheme = useSyncExternalStore(
    subscribeScheme,
    schemeSnapshot,
    () => "light" as const,
  );
  const kind: ThemeKind = theme === "system" ? scheme : theme;
  const hostTheme = useMemo(() => buildHostTheme(kind), [kind]);
  const vars = cssVarsFromPalette(hostTheme.palette);
  const action = onAction ?? null;
  const canvasStore = store ?? null;

  return (
    <ThemeContext.Provider value={hostTheme}>
      <ActionContext.Provider value={action}>
        <StoreContext.Provider value={canvasStore}>
          <div
            data-roobli-canvas=""
            data-theme={kind}
            style={mergeStyle(
              {
                background: hostTheme.bg.editor,
                color: hostTheme.text.primary,
                fontFamily: uiFace,
                fontSize: 14,
                lineHeight: "22px",
                minHeight: "100%",
                width: "100%",
                maxWidth: "100vw",
                minWidth: 0,
                boxSizing: "border-box",
                ...vars,
              } as CSSProperties,
              style,
            )}
          >
            <style>{`
              [data-roobli-canvas] button:focus-visible,
              [data-roobli-canvas] a:focus-visible {
                outline: 2px solid var(--focus);
                outline-offset: 2px;
              }
              @media (max-width: 640px) {
                [data-roobli-canvas] [data-roobli-grid] {
                  grid-template-columns: minmax(0, 1fr) !important;
                }
              }
            `}</style>
            {children}
          </div>
        </StoreContext.Provider>
      </ActionContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useHostTheme(): CanvasHostTheme {
  const hosted = useContext(ThemeContext);
  const scheme = useSyncExternalStore(
    subscribeScheme,
    schemeSnapshot,
    () => "light" as const,
  );
  if (hosted) {
    return hosted;
  }
  const fromDocument = themeFromDocument();
  if (fromDocument) {
    return fromDocument;
  }
  return buildHostTheme(scheme);
}

export function useCanvasAction(): (action: CanvasAction) => void {
  const hosted = useContext(ActionContext);
  return (
    hosted ??
    ((action: CanvasAction) => {
      if (action.type === "openUrl" && typeof window !== "undefined") {
        window.open(action.href, "_blank", "noopener,noreferrer");
      }
    })
  );
}

export function useCanvasState<T>(
  key: string,
  defaultValue: T,
): [T, SetCanvasState<T>] {
  const store = useContext(StoreContext);
  const [value, setValue] = useState<T>(() => {
    if (store) {
      const stored = store.get(key);
      if (stored !== undefined) {
        return stored as T;
      }
    }
    return defaultValue;
  });

  const set = useCallback<SetCanvasState<T>>(
    (action) => {
      setValue((prev) => {
        const next =
          typeof action === "function"
            ? (action as (prev: T) => T)(prev)
            : action;
        store?.set(key, next);
        return next;
      });
    },
    [key, store],
  );

  return [value, set];
}
