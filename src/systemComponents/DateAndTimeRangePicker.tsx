import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export function DateTimeRangePicker({ dateRange, setDateRange }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {dateRange.from && dateRange.to
            ? `${format(dateRange.from, "MMM dd")} - ${format(
                dateRange.to,
                "MMM dd"
              )}`
            : "Select date range"}
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
      </PopoverContent>
    </Popover>
  );
}
