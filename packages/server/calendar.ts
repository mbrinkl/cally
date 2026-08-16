import { createDAVClient, DAVCalendar } from "tsdav";

export class CalendarClient {
  private client!: Awaited<ReturnType<typeof createDAVClient>>;
  private calendar!: DAVCalendar;

  async setup() {
    this.client = await createDAVClient({
      serverUrl: "https://caldav.icloud.com",
      credentials: {
        username: process.env.APPLE_USERNAME,
        password: process.env.APPLE_APP_PASSWORD,
      },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });

    const calendars = await this.client.fetchCalendars();
    const calendar = calendars.find((x) => x.displayName === "Family");

    if (!calendar) {
      throw new Error("Calendar not found");
    }

    this.calendar = calendar;
  }

  async getCalendarData(): Promise<string> {
    const calendarObjects = await this.client.fetchCalendarObjects({
      calendar: this.calendar,
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
