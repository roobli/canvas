/**
 * Noto paper tokens, copied from src/renderer/styles/_roob-tokens.scss
 * (copied 2026-08-28 in that tree). A canvas is chrome sitting next to a
 * document, so it uses the same palette rather than a second one.
 */

export const uiFace =
  '"PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif';

export const monoFace = 'Menlo, Monaco, "SF Mono", Consolas, monospace';

export type ThemeKind = "light" | "dark";

export type CanvasPalette = {
  paper: string;
  panel: string;
  raised: string;
  overlay: string;
  ink: string;
  inkStrong: string;
  hairline: string;
  accent: string;
  muted: string;
  success: string;
  warning: string;
  danger: string;
  focus: string;
  surfaceActive: string;
  lineStrong: string;
  quoteInk: string;
  codeText: string;
  codeFill: string;
  codeInk: string;
  alertNote: string;
  alertTip: string;
  alertWarning: string;
  alertCaution: string;
  markFill: string;
  diffInserted: string;
  diffRemoved: string;
};

export const paletteLight: CanvasPalette = {
  paper: "#FAF9F6",
  panel: "#F3F1EC",
  raised: "#F2F1EE",
  overlay: "#FAF9F6",
  ink: "#34312E",
  inkStrong: "#201E1C",
  hairline: "#DDD9D2",
  accent: "#A85D3B",
  muted: "#6F6B66",
  success: "#496B52",
  warning: "#8A642D",
  danger: "#93443F",
  focus: "#A85D3B",
  surfaceActive: "#EBE8E2",
  lineStrong: "#C9C3BB",
  quoteInk: "#575754",
  codeText: "#2B2926",
  codeFill: "#EEECE8",
  codeInk: "#8E4F37",
  alertNote: "#2F6F9F",
  alertTip: "#3F7652",
  alertWarning: "#85620F",
  alertCaution: "#A4473F",
  markFill: "#F6DF7A",
  diffInserted: "#E4EDE6",
  diffRemoved: "#F3E6E4",
};

export const paletteDark: CanvasPalette = {
  paper: "#1F1E1C",
  panel: "#181715",
  raised: "#292826",
  overlay: "#2B2A27",
  ink: "#D7D4CF",
  inkStrong: "#F1EEE8",
  hairline: "#3B3935",
  accent: "#E0A07A",
  muted: "#8B8781",
  success: "#8BB697",
  warning: "#D0A45F",
  danger: "#D88780",
  focus: "#E0A07A",
  surfaceActive: "#34322F",
  lineStrong: "#5C584F",
  quoteInk: "#A6A199",
  codeText: "#D7D4CF",
  codeFill: "#2A2926",
  codeInk: "#D9A98C",
  alertNote: "#7FB3D5",
  alertTip: "#8BB697",
  alertWarning: "#D0A45F",
  alertCaution: "#D88780",
  markFill: "#7A6A2A",
  diffInserted: "#24332A",
  diffRemoved: "#3A2826",
};

export type CanvasTokens = {
  bg: {
    editor: string;
    chrome: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    link: string;
    onAccent: string;
  };
  stroke: {
    primary: string;
    secondary: string;
    tertiary: string;
    focused: string;
  };
  fill: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  accent: {
    primary: string;
    control: string;
    controlHover: string;
  };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  diff: {
    insertedLine: string;
    removedLine: string;
  };
};

export function tokensFromPalette(palette: CanvasPalette): CanvasTokens {
  return {
    bg: {
      editor: palette.paper,
      chrome: palette.panel,
      elevated: palette.raised,
    },
    text: {
      primary: palette.ink,
      secondary: palette.muted,
      tertiary: palette.quoteInk,
      quaternary: palette.muted,
      link: palette.accent,
      onAccent: palette.paper,
    },
    stroke: {
      primary: palette.lineStrong,
      secondary: palette.hairline,
      tertiary: palette.hairline,
      focused: palette.focus,
    },
    fill: {
      primary: palette.surfaceActive,
      secondary: palette.panel,
      tertiary: palette.codeFill,
      quaternary: palette.raised,
    },
    accent: {
      primary: palette.accent,
      control: palette.paper,
      controlHover: palette.surfaceActive,
    },
    status: {
      success: palette.success,
      warning: palette.warning,
      danger: palette.danger,
      info: palette.alertNote,
    },
    diff: {
      insertedLine: palette.diffInserted,
      removedLine: palette.diffRemoved,
    },
  };
}

export const canvasSpacing = {
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
} as const;

export const canvasRadius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
} as const;

export const canvasTypography = {
  h1: { fontSize: 22, lineHeight: "28px", fontWeight: 500 },
  h2: { fontSize: 16, lineHeight: "22px", fontWeight: 500 },
  h3: { fontSize: 14, lineHeight: "20px", fontWeight: 500 },
  body: { fontSize: 14, lineHeight: "22px", fontWeight: 400 },
  small: { fontSize: 12, lineHeight: "18px", fontWeight: 400 },
} as const;

export function paletteFromCssVars(
  read: (name: string) => string,
  fallback: CanvasPalette,
): CanvasPalette {
  const v = (css: string, key: keyof CanvasPalette): string =>
    read(css) || fallback[key];
  return {
    paper: v("--paper", "paper"),
    panel: v("--panel", "panel"),
    raised: v("--raised", "raised"),
    overlay: v("--overlay", "overlay"),
    ink: v("--ink", "ink"),
    inkStrong: v("--ink-strong", "inkStrong"),
    hairline: v("--hairline", "hairline"),
    accent: v("--accent", "accent"),
    muted: v("--muted", "muted"),
    success: v("--success", "success"),
    warning: v("--warning", "warning"),
    danger: v("--danger", "danger"),
    focus: v("--focus", "focus"),
    surfaceActive: v("--surface-active", "surfaceActive"),
    lineStrong: v("--line-strong", "lineStrong"),
    quoteInk: v("--quote-ink", "quoteInk"),
    codeText: v("--code-text", "codeText"),
    codeFill: v("--code-fill", "codeFill"),
    codeInk: v("--code-ink", "codeInk"),
    alertNote: v("--alert-note", "alertNote"),
    alertTip: v("--alert-tip", "alertTip"),
    alertWarning: v("--alert-warning", "alertWarning"),
    alertCaution: v("--alert-caution", "alertCaution"),
    markFill: v("--mark-fill", "markFill"),
    diffInserted: fallback.diffInserted,
    diffRemoved: fallback.diffRemoved,
  };
}

export function cssVarsFromPalette(palette: CanvasPalette): Record<string, string> {
  return {
    "--paper": palette.paper,
    "--panel": palette.panel,
    "--raised": palette.raised,
    "--overlay": palette.overlay,
    "--ink": palette.ink,
    "--ink-strong": palette.inkStrong,
    "--hairline": palette.hairline,
    "--accent": palette.accent,
    "--muted": palette.muted,
    "--success": palette.success,
    "--warning": palette.warning,
    "--danger": palette.danger,
    "--focus": palette.focus,
    "--surface-active": palette.surfaceActive,
    "--line-strong": palette.lineStrong,
    "--quote-ink": palette.quoteInk,
    "--code-text": palette.codeText,
    "--code-fill": palette.codeFill,
    "--code-ink": palette.codeInk,
    "--alert-note": palette.alertNote,
    "--alert-tip": palette.alertTip,
    "--alert-warning": palette.alertWarning,
    "--alert-caution": palette.alertCaution,
    "--mark-fill": palette.markFill,
  };
}

export function readDocumentCssVar(name: string): string {
  if (typeof document === "undefined") {
    return "";
  }
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function documentHasNotoVars(): boolean {
  return readDocumentCssVar("--paper") !== "";
}
