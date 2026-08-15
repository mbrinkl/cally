import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { PORT } from "../shr/conf";
import { initialize } from "./initialize";

const { calendarClient, contactsClient } = await initialize();

const app: Express = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
