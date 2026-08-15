import { DEFAULT_PORT } from "@cally/shared/conf";

const { origin, protocol, hostname } = window.location;
export const SERVER_URL =
  import.meta.env.NODE_ENV === "production"
    ? origin
    : `${protocol}//${hostname}:${DEFAULT_PORT}`;
