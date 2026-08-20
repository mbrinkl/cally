import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initialize } from "./initialize";
import { env } from "./env";
import { UiConfig } from "@cally/shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistDir = path.resolve(__dirname, "./client");

const { calendarClient, contactsClient } = await initialize();

const app: Express = express();

if (env.NODE_ENV === "development") {
  app.use(cors());
} else {
  app.use(express.static(clientDistDir));
}

app.get(
  "/calendar/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.send(await calendarClient.getCalendarData(req.params.id));
  },
);

app.get("/external-calendar", async (req: Request, res: Response) => {
  const url = req.query.url;

  if (typeof url !== "string" || !url) {
    return res.status(400).json({
      error: "Missing url query parameter",
    });
  }

  let externalUrl: URL;

  try {
    externalUrl = new URL(url);
  } catch {
    return res.status(400).json({
      error: "Invalid url",
    });
  }

  try {
    const response = await fetch(externalUrl);

    if (!response.ok) {
      return res.status(502).json({
        error: `External calendar returned ${response.status}`,
      });
    }

    const ics = await response.text();

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");

    return res.send(ics);
  } catch (error) {
    console.error("Failed to fetch external calendar:", error);

    return res.status(502).json({
      error: "Failed to fetch external calendar",
    });
  }
});

app.get("/birthdays", async (req: Request, res: Response) => {
  res.json(await contactsClient.getContactBirthday());
});

app.get("/config", async (req: Request, res: Response) => {
  const config: UiConfig = {
    colorScheme: env.COLOR_SCHEME,
    calendarIds: env.CALENDAR_IDS,
    externalICalUrls: env.EXTERNAL_ICAL_URLS,
    calendarColors: env.CALENDAR_COLORS,
    birthdaysColor: env.BIRTHDAYS_COLOR,
    externalICalColors: env.EXTERNAL_ICAL_COLORS,
  };
  res.json(config);
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
