import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { getCalendarData } from "./calendar";
import { getContactBirthdays } from "./contacts";
import { PORT } from "../shr/conf";

if (!process.env.APPLE_USERNAME || !process.env.APPLE_APP_PASSWORD) {
  throw new Error(
    "Missing required environment variables: APPLE_USERNAME and APPLE_APP_PASSWORD",
  );
}

const app: Express = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
} else {
  app.use(cors());
}

app.get("/calendar", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.send(getCalendarData());
});

app.get("/birthdays", (req: Request, res: Response) => {
  res.json(getContactBirthdays());
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
