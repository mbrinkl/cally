import type { EventDisplayInfo } from "@fullcalendar/react";
import "./EventContent.css";

interface EventContentProps {
  info: EventDisplayInfo;
}

export const EventContent = ({ info }: EventContentProps) => {
  if (info.event.extendedProps.birthday) {
    return <BirthdayContent info={info} />;
  }
  return <RegularEventContent info={info} />;
};

const RegularEventContent = ({ info }: EventContentProps) => {
  const { event } = info;

  return (
    <div className="calendar-event">
      <div className="calendar-event__main">
        {info.timeText && (
          <span className="calendar-event__time">{info.timeText}</span>
        )}
        <span className="calendar-event__title">{event.title}</span>
      </div>
    </div>
  );
};

const BirthdayContent = ({ info }: EventContentProps) => {
  const birthday = new Date(info.event.extendedProps.birthday);
  const occurrenceDate = info.event.start;

  let title: string = info.event.title;
  if (occurrenceDate) {
    const age = occurrenceDate.getFullYear() - birthday.getFullYear();
    title += ` (${age})`;
  }

  return (
    <div className="calendar-event calendar-event--birthday">
      <span className="calendar-event__birthday-icon">🎂</span>
      <span className="calendar-event__title">{title}</span>
    </div>
  );
};
