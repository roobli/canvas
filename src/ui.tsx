import {
  createContext,
  useContext,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { mergeStyle } from "./merge-style.js";
import { canvasRadius, canvasTypography, monoFace, uiFace } from "./tokens.js";
import { useHostTheme } from "./theme.js";

export type StackProps = {
  children?: ReactNode;
  gap?: number;
  style?: CSSProperties;
};

export function Stack({ children, gap = 16, style }: StackProps): JSX.Element {
  return (
    <div
      style={mergeStyle(
        {
          display: "flex",
          flexDirection: "column",
          gap,
          minWidth: 0,
          maxWidth: "100%",
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export type RowProps = {
  children?: ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  wrap?: boolean;
  style?: CSSProperties;
};

export function Row({
  children,
  gap = 8,
  align = "center",
  justify = "start",
  wrap = false,
  style,
}: RowProps): JSX.Element {
  return (
    <div
      style={mergeStyle(
        {
          display: "flex",
          flexDirection: "row",
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : "nowrap",
          gap,
          minWidth: 0,
          maxWidth: "100%",
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export type GridProps = {
  children?: ReactNode;
  columns: number | string;
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  style?: CSSProperties;
};

export function Grid({
  children,
  columns,
  gap = 16,
  align = "stretch",
  style,
}: GridProps): JSX.Element {
  const template =
    typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  return (
    <div
      data-roobli-grid=""
      style={mergeStyle(
        {
          display: "grid",
          gridTemplateColumns: template,
          gap,
          alignItems: align,
          minWidth: 0,
          maxWidth: "100%",
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export type DividerProps = {
  style?: CSSProperties;
};

export function Divider({ style }: DividerProps): JSX.Element {
  const theme = useHostTheme();
  return (
    <hr
      style={mergeStyle(
        {
          border: "none",
          height: 1,
          margin: 0,
          width: "100%",
          background: theme.stroke.tertiary,
        },
        style,
      )}
    />
  );
}

export function Spacer(): JSX.Element {
  return <div style={{ flex: 1, minWidth: 0 }} />;
}

export type TableColumnAlign = "left" | "center" | "right";
export type TableRowTone = "success" | "danger" | "warning" | "info" | "neutral";
export type StatTone = "success" | "danger" | "warning" | "info";

export type TableProps = {
  headers: ReactNode[];
  rows: ReactNode[][];
  columnAlign?: Array<TableColumnAlign | undefined>;
  rowTone?: Array<TableRowTone | undefined>;
  framed?: boolean;
  striped?: boolean;
  stickyHeader?: boolean;
  style?: CSSProperties;
  emptyMessage?: ReactNode;
};

function toneColor(
  tone: TableRowTone | StatTone,
  theme: ReturnType<typeof useHostTheme>,
): string {
  if (tone === "success") return theme.status.success;
  if (tone === "danger") return theme.status.danger;
  if (tone === "warning") return theme.status.warning;
  if (tone === "info") return theme.accent.primary;
  return theme.text.secondary;
}

export function Table({
  headers,
  rows,
  columnAlign,
  rowTone,
  framed = true,
  striped = false,
  stickyHeader = false,
  style,
  emptyMessage,
}: TableProps): JSX.Element {
  const theme = useHostTheme();
  const columns = headers.length;
  const body =
    rows.length === 0 ? (
      <tr>
        <td
          colSpan={Math.max(columns, 1)}
          style={{
            padding: "12px 10px",
            color: theme.text.secondary,
            fontSize: 13,
          }}
        >
          {emptyMessage ?? "No rows."}
        </td>
      </tr>
    ) : (
      rows.map((row, rowIndex) => {
        const cells = headers.map((_, i) => row[i] ?? null);
        const tone = rowTone?.[rowIndex];
        return (
          <tr
            key={rowIndex}
            style={{
              background:
                striped && rowIndex % 2 === 1 ? theme.fill.tertiary : "transparent",
            }}
          >
            {cells.map((cell, i) => (
              <td
                key={i}
                style={{
                  padding: "8px 10px",
                  textAlign: columnAlign?.[i] ?? "left",
                  verticalAlign: "top",
                  borderTop: `1px solid ${theme.stroke.tertiary}`,
                  color: theme.text.primary,
                  fontSize: 13,
                  lineHeight: "20px",
                  wordBreak: "break-word",
                }}
              >
                {i === 0 && tone ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 99,
                        background: toneColor(tone, theme),
                        flex: "0 0 auto",
                      }}
                    />
                    <span>{cell}</span>
                  </span>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        );
      })
    );

  const table = (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: uiFace,
      }}
    >
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th
              key={i}
              style={{
                textAlign: columnAlign?.[i] ?? "left",
                padding: "8px 10px",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: theme.text.secondary,
                background: stickyHeader ? theme.bg.editor : "transparent",
                position: stickyHeader ? "sticky" : "static",
                top: 0,
                borderBottom: `1px solid ${theme.stroke.primary}`,
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );

  if (!framed) {
    return <div style={style}>{table}</div>;
  }

  return (
    <div
      style={mergeStyle(
          {
            border: `1px solid ${theme.stroke.tertiary}`,
            borderRadius: canvasRadius.sm,
            overflow: "auto",
            background: theme.bg.editor,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
          },
        style,
      )}
    >
      {table}
    </div>
  );
}

const TextNest = createContext(false);

export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextProps = {
  children?: ReactNode;
  tone?: "primary" | "secondary" | "tertiary" | "quaternary";
  size?: "body" | "small";
  as?: "p" | "span";
  weight?: TextWeight;
  italic?: boolean;
  truncate?: boolean | "start" | "end";
  style?: CSSProperties;
};

const WEIGHT: Record<TextWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 650,
};

export function Text({
  children,
  tone = "primary",
  size = "body",
  as,
  weight = "normal",
  italic = false,
  truncate,
  style,
}: TextProps): JSX.Element {
  const theme = useHostTheme();
  const nested = useContext(TextNest);
  const tag = as ?? (nested ? "span" : "p");
  const color =
    tone === "primary"
      ? theme.text.primary
      : tone === "secondary"
        ? theme.text.secondary
        : tone === "tertiary"
          ? theme.text.tertiary
          : theme.text.quaternary;
  const type = size === "small" ? canvasTypography.small : canvasTypography.body;
  const truncateStyle: CSSProperties =
    truncate === true || truncate === "end"
      ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
      : truncate === "start"
        ? {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            direction: "rtl",
            textAlign: "left",
          }
        : {};
  const Tag = tag;
  return (
    <TextNest.Provider value={true}>
      <Tag
        style={mergeStyle(
          {
            margin: 0,
            color,
            fontFamily: uiFace,
            fontSize: type.fontSize,
            lineHeight: type.lineHeight,
            fontWeight: WEIGHT[weight],
            fontStyle: italic ? "italic" : "normal",
            overflowWrap: "break-word",
            minWidth: 0,
            maxWidth: "100%",
            ...truncateStyle,
          },
          style,
        )}
      >
        {children}
      </Tag>
    </TextNest.Provider>
  );
}

export type H1Props = { children?: ReactNode; style?: CSSProperties };
export type H2Props = { children?: ReactNode; style?: CSSProperties };
export type H3Props = { children?: ReactNode; style?: CSSProperties };

export function H1({ children, style }: H1Props): JSX.Element {
  const theme = useHostTheme();
  return (
    <h1
      style={mergeStyle(
        {
          margin: 0,
          color: theme.text.primary,
          fontFamily: uiFace,
          fontSize: canvasTypography.h1.fontSize,
          lineHeight: canvasTypography.h1.lineHeight,
          fontWeight: canvasTypography.h1.fontWeight,
        },
        style,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, style }: H2Props): JSX.Element {
  const theme = useHostTheme();
  return (
    <h2
      style={mergeStyle(
        {
          margin: "8px 0 0",
          color: theme.text.primary,
          fontFamily: uiFace,
          fontSize: canvasTypography.h2.fontSize,
          lineHeight: canvasTypography.h2.lineHeight,
          fontWeight: canvasTypography.h2.fontWeight,
        },
        style,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, style }: H3Props): JSX.Element {
  const theme = useHostTheme();
  return (
    <h3
      style={mergeStyle(
        {
          margin: 0,
          color: theme.text.primary,
          fontFamily: uiFace,
          fontSize: canvasTypography.h3.fontSize,
          lineHeight: canvasTypography.h3.lineHeight,
          fontWeight: canvasTypography.h3.fontWeight,
        },
        style,
      )}
    >
      {children}
    </h3>
  );
}

export type CodeProps = { children?: ReactNode; style?: CSSProperties };

export function Code({ children, style }: CodeProps): JSX.Element {
  const theme = useHostTheme();
  return (
    <code
      style={mergeStyle(
        {
          fontFamily: monoFace,
          fontSize: "0.92em",
          color: theme.palette.codeInk,
          background: theme.palette.codeFill,
          padding: "1px 5px",
          borderRadius: 2,
        },
        style,
      )}
    >
      {children}
    </code>
  );
}

export type LinkProps = {
  children?: ReactNode;
  href: string;
  style?: CSSProperties;
};

export function Link({ children, href, style }: LinkProps): JSX.Element {
  const theme = useHostTheme();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={mergeStyle(
        {
          color: theme.text.link,
          textDecoration: "underline",
          textUnderlineOffset: 2,
          textDecorationColor: theme.stroke.primary,
        },
        style,
      )}
    >
      {children}
    </a>
  );
}

export type CardVariant = "default" | "borderless";
export type CardSize = "base" | "lg";
export type CardProps = {
  children?: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  style?: CSSProperties;
};

export function Card({
  children,
  variant = "default",
  size: _size = "base",
  style,
}: CardProps): JSX.Element {
  const theme = useHostTheme();
  void _size;
  return (
    <section
      style={mergeStyle(
        {
          background: theme.bg.elevated,
          border:
            variant === "borderless" ? "none" : `1px solid ${theme.stroke.tertiary}`,
          borderRadius: variant === "borderless" ? 0 : canvasRadius.sm,
          overflow: "hidden",
          minWidth: 0,
          maxWidth: "100%",
        },
        style,
      )}
    >
      {children}
    </section>
  );
}

export type CardHeaderProps = {
  children?: ReactNode;
  trailing?: ReactNode;
  style?: CSSProperties;
};

export function CardHeader({
  children,
  trailing,
  style,
}: CardHeaderProps): JSX.Element {
  const theme = useHostTheme();
  return (
    <header
      style={mergeStyle(
        {
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 28,
          padding: "6px 10px",
          borderBottom: `1px solid ${theme.stroke.tertiary}`,
          fontSize: 12,
          fontWeight: 500,
          color: theme.text.secondary,
          fontFamily: uiFace,
        },
        style,
      )}
    >
      <span style={{ flex: 1, minWidth: 0, color: theme.text.primary }}>
        {children}
      </span>
      {trailing ? <span style={{ flex: "0 0 auto" }}>{trailing}</span> : null}
    </header>
  );
}

export type CardBodyProps = {
  children?: ReactNode;
  style?: CSSProperties;
};

export function CardBody({ children, style }: CardBodyProps): JSX.Element {
  return (
    <div style={mergeStyle({ padding: 12 }, style)}>{children}</div>
  );
}

export type ButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  onClick?: () => void;
};

export function Button({
  children,
  variant = "secondary",
  disabled = false,
  type = "button",
  style,
  onClick,
}: ButtonProps): JSX.Element {
  const theme = useHostTheme();
  const chrome: CSSProperties =
    variant === "ghost"
      ? {
          background: "transparent",
          border: "1px solid transparent",
          color: theme.text.primary,
        }
      : variant === "primary"
        ? {
            background: theme.bg.editor,
            border: `1px solid ${theme.text.primary}`,
            color: theme.text.primary,
          }
        : {
            background: theme.bg.editor,
            border: `1px solid ${theme.stroke.tertiary}`,
            color: theme.text.primary,
          };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={mergeStyle(
        {
          ...chrome,
          height: 24,
          padding: "0 10px",
          borderRadius: canvasRadius.sm,
          fontFamily: uiFace,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "22px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.45 : 1,
          width: "fit-content",
        },
        style,
      )}
    >
      {children}
    </button>
  );
}

export type PillTone =
  | "neutral"
  | "added"
  | "deleted"
  | "renamed"
  | "success"
  | "warning"
  | "info";
export type PillSize = "sm" | "md";
export type PillProps = {
  children?: ReactNode;
  active?: boolean;
  tone?: PillTone;
  size?: PillSize;
  leadingContent?: ReactNode;
  keyboardHint?: string;
  disabled?: boolean;
  title?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function Pill({
  children,
  active = false,
  tone: _tone,
  size = "md",
  leadingContent,
  keyboardHint,
  disabled = false,
  title,
  style,
  onClick,
}: PillProps): JSX.Element {
  const theme = useHostTheme();
  void _tone;
  const compact = size === "sm";
  const pillStyle = mergeStyle(
    {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: compact ? 20 : 24,
      padding: compact ? "0 7px" : "0 10px",
      borderRadius: 99,
      border: compact ? "none" : `1px solid ${theme.stroke.tertiary}`,
      background: active
        ? theme.fill.primary
        : compact
          ? theme.fill.tertiary
          : theme.bg.editor,
      color: theme.text.primary,
      fontFamily: uiFace,
      fontSize: compact ? 11 : 12,
      lineHeight: compact ? "20px" : "22px",
      cursor: onClick && !disabled ? "pointer" : "default",
      opacity: disabled ? 0.45 : 1,
    },
    style,
  );
  const inner = (
    <>
      {leadingContent}
      {children}
      {keyboardHint ? (
        <span style={{ color: theme.text.secondary, fontSize: 10 }}>
          {keyboardHint}
        </span>
      ) : null}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        title={title}
        disabled={disabled}
        onClick={onClick}
        style={pillStyle}
      >
        {inner}
      </button>
    );
  }
  return (
    <span title={title} style={pillStyle}>
      {inner}
    </span>
  );
}

export type StatProps = {
  value: ReactNode;
  label: string;
  tone?: StatTone;
  style?: CSSProperties;
};

export function Stat({ value, label, tone, style }: StatProps): JSX.Element {
  const theme = useHostTheme();
  const color = tone ? toneColor(tone, theme) : theme.text.primary;
  return (
    <div style={mergeStyle({ minWidth: 0 }, style)}>
      <div
        style={{
          fontFamily: uiFace,
          fontSize: 22,
          lineHeight: "28px",
          fontWeight: 500,
          color,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: uiFace,
          fontSize: 12,
          lineHeight: "18px",
          color: theme.text.secondary,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export type CalloutTone = "info" | "success" | "warning" | "danger" | "neutral";
export type CalloutProps = {
  children?: ReactNode;
  tone?: CalloutTone;
  title?: ReactNode;
  icon?: ReactNode;
  style?: CSSProperties;
};

export function Callout({
  children,
  tone = "neutral",
  title,
  icon,
  style,
}: CalloutProps): JSX.Element {
  const theme = useHostTheme();
  const spine =
    tone === "info" || tone === "neutral"
      ? theme.accent.primary
      : tone === "success"
        ? theme.status.success
        : tone === "warning"
          ? theme.status.warning
          : theme.status.danger;
  return (
    <aside
      style={mergeStyle(
        {
          display: "flex",
          gap: 10,
          padding: "10px 12px",
          background: theme.fill.tertiary,
          borderRadius: canvasRadius.sm,
          borderLeft: `2px solid ${spine}`,
          minWidth: 0,
          maxWidth: "100%",
          boxSizing: "border-box",
        },
        style,
      )}
    >
      {icon ? <div style={{ flex: "0 0 auto" }}>{icon}</div> : null}
      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          typeof title === "string" ? (
            <Text weight="medium" size="small">
              {title}
            </Text>
          ) : (
            title
          )
        ) : null}
        {children ? (
          typeof children === "string" ? (
            <Text size="small">{children}</Text>
          ) : (
            children
          )
        ) : null}
      </Stack>
    </aside>
  );
}
