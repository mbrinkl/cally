import FullCalendar, { type EventSourceInput } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/forma";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import iCalendarPlugin from "@fullcalendar/icalendar";
import rrulePlugin from "@fullcalendar/rrule";
import {
  DEFAULT_BIRTHDAYS_COLOR,
  DEFAULT_CALENDAR_COLORS,
  SERVER_URL,
} from "../conf";
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
          events: birthdays,
          color: config.birthdaysColor || DEFAULT_BIRTHDAYS_COLOR,
        },
        ...config.calendarIds.map(
          (id, index): EventSourceInput => ({
            url: `${SERVER_URL}/calendar/${id}`,
            format: "ics",
            color:
              config.calendarColors?.[index] || DEFAULT_CALENDAR_COLORS[index],
          }),
        ),
      ]}
      eventContent={(info) => <EventContent info={info} />}
    />
  );
};
