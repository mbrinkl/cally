import { CalendarClient } from "./calendar";
import { ContactsClient } from "./contacts";

export const initialize = async () => {
  const calendarClient = new CalendarClient();
  const contactsClient = new ContactsClient();

  await Promise.all([calendarClient.setup(), contactsClient.setup()]);

  return { calendarClient, contactsClient };
};
