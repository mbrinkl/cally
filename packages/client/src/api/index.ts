import type { EventInput } from "@fullcalendar/react";
import { SERVER_URL } from "../conf";
import { useQuery } from "@tanstack/react-query";
import type { ContactBirthday, UiConfig } from "@cally/shared";

const getConfig = async (): Promise<UiConfig> => {
  const res = await fetch(`${SERVER_URL}/config`);
  return await res.json();
};

const getBirthdays = async (): Promise<ContactBirthday[]> => {
  const res = await fetch(`${SERVER_URL}/birthdays`);
  return await res.json();
};

const getContactsEventSource = (contacts: ContactBirthday[]): EventInput[] => {
  return contacts.map((contact) => ({
    title: contact.name,
    allDay: true,
    rrule: {
      freq: "yearly",
      dtstart: contact.birthday,
    },
    extendedProps: {
      birthday: contact.birthday,
    },
  }));
};

export const useConfigQuery = () =>
  useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
  });

export const useBirthdaysQuery = () =>
  useQuery({
    queryKey: ["birthdays"],
    queryFn: getBirthdays,
    select: getContactsEventSource,
  });
