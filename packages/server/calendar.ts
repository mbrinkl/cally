import { createDAVClient, DAVCalendar } from "tsdav";
import { env } from "./env";

export class CalendarClient {
  private client!: Awaited<ReturnType<typeof createDAVClient>>;
  private calendars!: DAVCalendar[];

  async setup() {
    this.client = await createDAVClient({
      serverUrl: "https://caldav.icloud.com",
      credentials: {
        username: env.APPLE_USERNAME,
        password: env.APPLE_APP_PASSWORD,
      },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });

    const calendarData = await this.client.fetchCalendars();
    const vEventCalendarData = calendarData.filter((calendar) =>
      calendar.components?.includes("VEVENT"),
    );
    const calendars = vEventCalendarData.filter(
      (calendar) =>
        typeof calendar.displayName === "string" &&
        env.CALENDAR_IDS.includes(calendar.displayName),
    );

    if (calendars.length !== env.CALENDAR_IDS.length) {
      console.error("Unable to find all specified calendars.");
      console.error("Expected calendar IDs:", env.CALENDAR_IDS);
      console.error(
        "Found calendar display names:",
        vEventCalendarData.map((c) => c.displayName),
      );
      throw new Error("Did not find all specified calendars.");
    }

    this.calendars = calendars;
  }

  async getCalendarData(): Promise<string> {
    // TODO support multi calendar response
    const calendarObjects = await this.client.fetchCalendarObjects({
      calendar: this.calendars[0],
    });

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
  }
}
