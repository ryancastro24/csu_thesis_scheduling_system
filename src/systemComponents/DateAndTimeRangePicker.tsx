import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock } from "lucide-react";
import { DateRange } from "react-day-picker";

// Function to format 24-hour time to 12-hour format without space in AM/PM
const formatTimeTo12Hour = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM case
  return `${formattedHours}:${minutes.toString().padStart(2, "0")}${period}`; // Removed extra space
};

// Function to convert 12-hour format back to 24-hour format
const convertTo24HourFormat = (time: string) => {
  if (!time) return "";
  const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) return time; // Return original if format is incorrect

  let [_, hours, minutes, period] = match;
  let formattedHours =
    period === "PM" && hours !== "12" ? Number(hours) + 12 : Number(hours);
  if (period === "AM" && hours === "12") formattedHours = 0; // Handle 12 AM case

  return `${formattedHours.toString().padStart(2, "0")}:${minutes}`;
};

export function DateTimeRangePicker({
  dateRange,
  setDateRange,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}: any) {
  // Handler to store time in 12-hour format
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value; // 24-hour format from input
    setStartTime(formatTimeTo12Hour(time)); // Store in 12-hour format without space
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value; // 24-hour format from input
    setEndTime(formatTimeTo12Hour(time)); // Store in 12-hour format without space
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {dateRange.from && dateRange.to && startTime && endTime
            ? `${format(dateRange.from, "MMM dd")} - ${format(
                dateRange.to,
                "MMM dd"
              )}, ${startTime} - ${endTime}`
            : "Select date & time range"}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4">
        {/* Date Range Picker */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> Select Date Range
          </label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => setDateRange(range as DateRange)}
            initialFocus
          />
        </div>

        {/* Time Range Picker */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Start Time
            </label>
            <Input
              type="time"
              value={convertTo24HourFormat(startTime)} // Convert stored 12hr time back to 24hr for input
              onChange={handleStartTimeChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> End Time
            </label>
            <Input
              type="time"
              value={convertTo24HourFormat(endTime)} // Convert stored 12hr time back to 24hr for input
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
