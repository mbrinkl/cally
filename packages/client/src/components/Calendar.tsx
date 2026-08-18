import FullCalendar, { type EventSourceInput } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/forma";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import iCalendarPlugin from "@fullcalendar/icalendar";
import rrulePlugin from "@fullcalendar/rrule";
import { SERVER_URL } from "../conf";
import { EventContent } from "./EventContent";
import { useQuery } from "@tanstack/react-query";

type ContactBirthday = {
  name: string;
  birthday: string;
};

const getBirthdays = async (): Promise<EventSourceInput> => {
  const res = await fetch(`${SERVER_URL}/birthdays`);
  const contacts = (await res.json()) as ContactBirthday[];
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
    color: "magenta",
  }));
};

export const Calendar = () => {
  const query = useQuery({ queryKey: ["birthdays"], queryFn: getBirthdays });

  if (!query.data) {
    return null;
  }

  return (
    <FullCalendar
      height="100vh"
      plugins={[
        rrulePlugin,
        themePlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        iCalendarPlugin as any,
      ]}
      colorScheme="dark"
      nowIndicator
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "listWeek,dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView="listWeek"
      titleFormat={{
        month: "long",
        year: "numeric",
      }}
      showNonCurrentDates={false}
      eventSources={[
        {
          url: `${SERVER_URL}/calendar`,
          format: "ics",
        },
        query.data,
      ]}
      eventContent={(info) => <EventContent info={info} />}
    />
  );
};
