import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_PORT } from "@cally/shared/conf";
import { initialize } from "./initialize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistDir = path.resolve(__dirname, "../../client/dist");

const port = Number(process.env.PORT) || DEFAULT_PORT;

const { calendarClient, contactsClient } = await initialize();

const app: Express = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistDir));
} else {
  app.use(cors());
}

app.get("/calendar", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.send(await calendarClient.getCalendarData());
});

app.get("/birthdays", async (req: Request, res: Response) => {
  res.json(await contactsClient.getContactBirthday());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
