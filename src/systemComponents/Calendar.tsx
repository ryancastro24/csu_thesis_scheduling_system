import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Calendar() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Sangka 2025",
      date: "2025-02-22",
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null); // Store event ID for deletion

  // Handle date click to open modal
  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setEventTitle("");
    setOpenModal(true);
  };

  // Add event to state
  const handleAddEvent = () => {
    if (!eventTitle.trim() || !selectedDate) return;

    const newEvent = {
      id: String(events.length + 1),
      title: eventTitle,
      date: selectedDate,
    };

    setEvents([...events, newEvent]);
    setOpenModal(false);
  };

  // Open delete modal and store event ID
  const handleEventClick = (info: any) => {
    setEventToDelete(info.event.id);
    setDeleteModal(true);
  };

  // Confirm deletion and remove event
  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter((event) => event.id !== eventToDelete));
    }
    setDeleteModal(false);
  };

  return (
    <div className="w-full h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick} // Click event to open delete modal
        height="100%"
      />

      {/* Add Event Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Enter the event title for {selectedDate}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant={"destructive"}
              onClick={handleConfirmDelete}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
