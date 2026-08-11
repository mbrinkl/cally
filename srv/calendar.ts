import { createDAVClient } from "tsdav";

const client = await createDAVClient({
  serverUrl: "https://caldav.icloud.com",
  credentials: {
    username: process.env.APPLE_USERNAME,
    password: process.env.APPLE_APP_PASSWORD,
  },
  authMethod: "Basic",
  defaultAccountType: "caldav",
});

const calendars = await client.fetchCalendars();
const calendar = calendars.find((x) => x.displayName === "Family");
if (!calendar) {
  throw new Error("Calendar not found");
}
const calendarObjects = await client.fetchCalendarObjects({ calendar });

export const getCalendarData = (): string => {
  const rawIcsList: string[] = calendarObjects
    .map((obj: any) => obj.calendarData ?? obj.data ?? obj.body)
    .filter((v): v is string => typeof v === "string");

  const mergedIcs: string = rawIcsList
    .map((ics) =>
      ics
        .replace(/BEGIN:VCALENDAR\r?\n/i, "")
        .replace(/\r?\nEND:VCALENDAR\r?\n?$/i, ""),
    )
    .join("\r\n");

  return (
    "BEGIN:VCALENDAR\r\n" +
    "VERSION:2.0\r\n" +
    mergedIcs +
    "\r\nEND:VCALENDAR\r\n"
  );
};
