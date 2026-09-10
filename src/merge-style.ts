import type { CSSProperties } from "react";

/** Shallow-merge style objects. `override` wins. Do not use this to invent chrome. */
export function mergeStyle(
  base: CSSProperties,
  override?: CSSProperties,
): CSSProperties {
  if (override === undefined) {
    return base;
  }
  return { ...base, ...override };
}
