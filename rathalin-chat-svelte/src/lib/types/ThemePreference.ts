import type { Theme } from "./Theme";

export type ThemePreference = "system" | Theme;

export function isThemePreference(str: string): str is ThemePreference {
  return ["system", "light", "dark"].includes(str);
}
