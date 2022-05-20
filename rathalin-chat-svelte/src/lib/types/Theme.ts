export type Theme = "light" | "dark";

export function isTheme(str: string): str is Theme {
    return ["light", "dark"].includes(str);
}
