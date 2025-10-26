import { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";

export type ThemeMode = "light" | "dark";
export const THEMES: Record<ThemeMode, typeof lightTheme> = {
  light: lightTheme,
  dark: darkTheme,
};