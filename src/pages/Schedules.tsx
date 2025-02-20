import { useState } from "react";
import { invoices } from "@/lib/sampleData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react"; // Magnifying glass icon
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Schedules = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
  });

  // Filter schedules based on search query
  const filteredSchedules = invoices.filter((val: any) =>
    val.invoice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    // For now, just log the new schedule to the console
    console.log(newSchedule);
    // Reset form values if needed
    setNewSchedule({
      title: "",
      description: "",
      location: "",
      date: "",
      category: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full h-full p-4">
      {/* Header with Search Input and Add Schedule Button */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Input with Magnifying Glass Icon */}
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Add Schedule</Button>
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-4 gap-3">
        {filteredSchedules.map((val: any) => (
          <Card key={val.invoice} className="dark:bg-[#303030] bg-slate-100">
            <CardHeader>
              <CardTitle>{val.invoice}</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Three Text Inputs */}
            <Input
              placeholder="Title"
              value={newSchedule.title}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, title: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={newSchedule.description}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, description: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={newSchedule.location}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, location: e.target.value })
              }
            />
            {/* DatePicker using native input type date */}
            <Input
              type="date"
              value={newSchedule.date}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, date: e.target.value })
              }
            />
            {/* Select Component from shadcn UI */}
            <Select
              value={newSchedule.category}
              onValueChange={(value: any) =>
                setNewSchedule({ ...newSchedule, category: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Deadline">Deadline</SelectItem>
                <SelectItem value="Event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit}>Add Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedules;
