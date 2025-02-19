import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Needed for interaction

export default function Calendar() {
  return (
    <div className="w-full h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Sangka 2025", date: "2025-02-20" },
          { title: "Event 2", date: "2025-04-02" },
        ]}
        dateClick={(info) => {
          const eventTitle = prompt("Enter event title:");
          if (eventTitle) {
            alert(`New event: ${eventTitle} on ${info.dateStr}`);
          }
        }}
        height="100%" // Make calendar take full height
      />
    </div>
  );
}
