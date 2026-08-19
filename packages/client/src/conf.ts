import { DEFAULT_PORT } from "@cally/shared";

const { origin, protocol, hostname } = window.location;

export const SERVER_URL: string = import.meta.env.DEV
  ? `${protocol}//${hostname}:${DEFAULT_PORT}`
  : origin;

export const DEFAULT_CALENDAR_COLORS: string[] = [
  "blue",
  "yellow",
  "red",
  "green",
];

export const DEFAULT_BIRTHDAYS_COLOR: string = "magenta";
