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

app.get("/birthdays", async (req: Request, res: Response) => {
  res.json(await contactsClient.getContactBirthday());
});

app.get("/config", async (req: Request, res: Response) => {
  const config: UiConfig = {
    colorScheme: env.COLOR_SCHEME,
    calendarIds: env.CALENDAR_IDS,
    calendarColors: env.CALENDAR_COLORS,
    birthdaysColor: env.BIRTHDAYS_COLOR,
  };
  res.json(config);
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
