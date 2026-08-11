import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/forma";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import iCalendarPlugin from "@fullcalendar/icalendar";
import rrulePlugin from "@fullcalendar/rrule";
import birthdayCakeImg from "./assets/birthday-cake.png";
import { SERVER_URL } from "./conf";

export const Calendar = () => {
  return (
    <FullCalendar
      nowIndicator
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthYear",
      }}
      titleFormat={{
        month: "long",
        year: "numeric",
      }}
      plugins={[
        rrulePlugin,
        themePlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        multiMonthPlugin,
        iCalendarPlugin as any,
      ]}
      initialView="timeGridWeek"
      eventSources={[
        {
          url: `${SERVER_URL}/calendar`,
          format: "ics",
          color: "blue",
        },
        {
          url: `${SERVER_URL}/birthdays`,
          color: "purple",
          eventDataTransform: (eventData) => {
            return {
              title: eventData.name,
              allDay: true,
              rrule: {
                freq: "yearly",
                dtstart: eventData.birthday,
              },
              extendedProps: {
                birthday: eventData.birthday,
              },
            };
          },
        },
      ]}
      eventContent={(arg) => {
        if (!arg.event.extendedProps.birthday) {
          return (
            <>
              <b>{arg.event.title}</b>
              <i>{arg.timeText}</i>
            </>
          );
        }

        const birthday = new Date(arg.event.extendedProps.birthday);
        const occurrenceDate = arg.event.start;

        if (!occurrenceDate) {
          return arg.event.title;
        }

        const age = occurrenceDate.getFullYear() - birthday.getFullYear();

        return (
          <div
            style={{
              paddingLeft: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img src={birthdayCakeImg} alt="Birthday Cake" width={32} />
            <b>
              {arg.event.title} ({age})
            </b>
          </div>
        );
      }}
    />
  );
};
