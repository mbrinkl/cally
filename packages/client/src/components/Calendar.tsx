import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/forma";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import iCalendarPlugin from "@fullcalendar/icalendar";
import rrulePlugin from "@fullcalendar/rrule";
import { SERVER_URL } from "../conf";
import { EventContent } from "./EventContent";
import { useBirthdaysQuery, useConfigQuery } from "../api";

export const Calendar = () => {
  const { data: birthdays } = useBirthdaysQuery();
  const { data: config } = useConfigQuery();

  if (!birthdays || !config) {
    return <div>Loading...</div>;
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
      colorScheme={config.colorScheme}
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
        birthdays,
      ]}
      eventContent={(info) => <EventContent info={info} />}
    />
  );
};
