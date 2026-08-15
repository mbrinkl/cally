import { CalendarClient } from "./calendar";
import { ContactsClient } from "./contacts";

export const initialize = async () => {
  if (!process.env.APPLE_USERNAME || !process.env.APPLE_APP_PASSWORD) {
    throw new Error(
      "Missing required environment variables: APPLE_USERNAME and APPLE_APP_PASSWORD",
    );
  }

  const calendarClient = new CalendarClient();
  const contactsClient = new ContactsClient();

  await Promise.all([calendarClient.setup(), contactsClient.setup()]);

  return { calendarClient, contactsClient };
};
