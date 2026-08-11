import { PORT } from "../shr/conf";

const { origin, protocol, hostname } = window.location;
export const SERVER_URL =
  import.meta.env.NODE_ENV === "production"
    ? origin
    : `${protocol}//${hostname}:${PORT}`;
