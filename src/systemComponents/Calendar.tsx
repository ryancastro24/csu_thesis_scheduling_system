import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Form,
  useLoaderData,
  ActionFunction,
  useNavigation,
} from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { getUserSchedules, updateUserSchedule } from "@/backend_api/schedules";

import { addNewSchedule } from "@/backend_api/calendar";
export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: any = JSON.parse(user as any);

  const schedules = await getUserSchedules(userData.id);

  return { userData, schedules }; // Proceed if authenticated
};
// Function to format 24-hour time to 12-hour format without space in AM/PM
const formatTimeTo12Hour = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")}${period}`;
};

// Function to convert 12-hour format back to 24-hour format
const convertTo24HourFormat = (time: string) => {
  if (!time) return "";
  const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) return time; // Return original if format is incorrect

  let [_, hours, minutes, period] = match;
  let formattedHours =
    period === "PM" && hours !== "12" ? Number(hours) + 12 : Number(hours);
  if (period === "AM" && hours === "12") formattedHours = 0;

  return `${formattedHours.toString().padStart(2, "0")}:${minutes}`;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  if (request.method === "POST") {
    const newSchedule = await addNewSchedule(data);
    return newSchedule;
  }

  if (request.method === "PUT") {
    console.log("updated data", data);
    const updatedSchedule = await updateUserSchedule(data.id, data);
    return updatedSchedule;
  }
};
export default function Calendar() {
  const { userData, schedules } = useLoaderData();

  console.log(schedules);
  const navigation = useNavigation();

  const [openModal, setOpenModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false); // New state for update modal
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventType, setEventType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToUpdate, setEventToUpdate] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState({
    eventType: "",
    date: "",
  });

  // Handle date click to open modal
  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setEventType("");
    setStartTime("");
    setEndTime("");
    setOpenModal(true);
  };

  // Open update modal and set values
  const handleUpdateClick = () => {
    setUpdateModal(true);
  };

  // Open delete modal and store event ID
  const handleEventClick = (info: any) => {
    setEventToDelete(info.event.id);
    setEventToUpdate(info.event.id);
    console.log(info);
    setSelectedEvent({
      eventType: info.event.title,
      date: info.event.startStr,
    });
    setDeleteModal(true);
  };

  return (
    <div className="w-full h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={schedules.map((schedule: any) => ({
          id: schedule._id,
          title: `${schedule.eventType} (${schedule.time})`,
          date: schedule.date,
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="100%"
      />

      {/* Add Event Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Enter details for the event on {selectedDate}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="eventType">Event Type</Label>
              <input
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="Enter event type (e.g., Class, Meeting)"
                className="border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time Picker */}
              <div className="flex flex-col gap-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {startTime ? startTime : "Select start time"}
                      <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 space-y-4">
                    <Input
                      type="time"
                      value={convertTo24HourFormat(startTime)}
                      onChange={(e) =>
                        setStartTime(formatTimeTo12Hour(e.target.value))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Time Picker */}
              <div className="flex flex-col gap-2">
                <Label>End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {endTime ? endTime : "Select end time"}
                      <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 space-y-4">
                    <Input
                      type="time"
                      value={convertTo24HourFormat(endTime)}
                      onChange={(e) =>
                        setEndTime(formatTimeTo12Hour(e.target.value))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Form method="POST">
              <Input name="date" value={selectedDate || ""} type="hidden" />
              <Input name="eventType" value={eventType} type="hidden" />
              <Input
                name="time"
                value={`${startTime} - ${endTime}`}
                type="hidden"
              />
              <Input name="userId" value={userData.id} type="hidden" />
              <Button
                disabled={navigation.state === "submitting"}
                className="cursor-pointer"
                type="submit"
              >
                {navigation.state === "submitting" ? (
                  <>
                    {" "}
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Add schedule"
                )}
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Event Modal */}
      <Dialog open={updateModal} onOpenChange={setUpdateModal}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
            <DialogDescription>
              Update details for the event on {selectedEvent.date}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="updateEventType">Event Type</Label>
              <input
                id="updateEventType"
                defaultValue={selectedEvent.eventType}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    eventType: e.target.value,
                  })
                }
                placeholder="Enter event type (e.g., Class, Meeting)"
                className="border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time Picker */}
              <div className="flex flex-col gap-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {startTime ? startTime : "Select start time"}
                      <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 space-y-4">
                    <Input
                      type="time"
                      value={convertTo24HourFormat(startTime)}
                      onChange={(e) =>
                        setStartTime(formatTimeTo12Hour(e.target.value))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Time Picker */}
              <div className="flex flex-col gap-2">
                <Label>End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {endTime ? endTime : "Select end time"}
                      <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 space-y-4">
                    <Input
                      type="time"
                      value={convertTo24HourFormat(endTime)}
                      onChange={(e) =>
                        setEndTime(formatTimeTo12Hour(e.target.value))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpdateModal(false)}>
              Cancel
            </Button>

            <Form method="PUT">
              <Input name="date" value={selectedEvent.date} type="hidden" />
              <Input
                name="eventType"
                value={selectedEvent.eventType}
                type="hidden"
              />
              <Input
                name="time"
                value={`${startTime} - ${endTime}`}
                type="hidden"
              />
              <Input name="id" value={eventToUpdate || ""} type="hidden" />
              <Button
                disabled={navigation.state === "submitting"}
                className="cursor-pointer"
                type="submit"
              >
                {navigation.state === "submitting" ? (
                  <>
                    {" "}
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Update schedule"
                )}
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent.eventType}</DialogTitle>
            <DialogDescription>
              What do you want to do with this event?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>

            <Form
              method="POST"
              action={`/dashboard/calendar/${eventToDelete}/destroy`}
            >
              <Button
                className="cursor-pointer"
                disabled={navigation.state === "submitting"}
                type="submit"
                variant="destructive"
              >
                {navigation.state === "submitting" ? (
                  <>
                    {" "}
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </Form>

            <Button className="cursor-pointer" onClick={handleUpdateClick}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
