// @ts-nocheck
import { useState } from "react";
import { invoices } from "@/lib/sampleData";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type Options = {
  id: number;
  value: string;
};
const studentOptions: Options[] = [
  { id: 1, value: "Student A" },
  { id: 2, value: "Student B" },
  { id: 3, value: "Student C" },
];

const panelOptions: Options[] = [
  { id: 1, value: "Panelist A" },
  { id: 2, value: "Panelist B" },
  { id: 3, value: "Panelist C" },
  { id: 4, value: "Chairperson" },
];

const venueOptions: Options[] = [
  { id: 1, value: "Room 101" },
  { id: 2, value: "Room 202" },
  { id: 3, value: "Main Hall" },
  { id: 4, value: "Online (Zoom)" },
];

const ITEMS_PER_PAGE = 6;
const Schedules = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
  });

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    console.log(newSchedule);
    setNewSchedule({
      title: "",
      description: "",
      location: "",
      date: "",
      category: "",
    });
    setIsDialogOpen(false);
  };

  // Filter schedules based on search query
  const filteredSchedules = invoices.filter((val) =>
    val.invoice.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Pagination logic
  const totalPages = Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedSchedules = filteredSchedules.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  return (
    <div className="w-full h-full p-4">
      {/* Header with Search Input and Add Schedule Button */}
      <div className="flex justify-between items-center mb-4">
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
      <div className="grid grid-cols-3 gap-3">
        {paginatedSchedules.map((val) => (
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

      <div className="flex justify-center items-center mt-4 gap-4">
        <Button
          size={"icon"}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="cursor-pointer"
          variant={"outline"}
        >
          <IoIosArrowBack />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size={"icon"}
          onClick={handleNextPage}
          variant={"outline"}
          className="cursor-pointer"
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </Button>
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="panels">Panels</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                  <CardDescription>
                    Select student members of the thesis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Student 1", "Student 2", "Student 3", "Adviser"].map(
                    (value, index) => (
                      <SearchableDropdown
                        key={index}
                        value={value}
                        options={studentOptions}
                      />
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Panels Tab */}
            <TabsContent value="panels">
              <Card>
                <CardHeader>
                  <CardTitle>Panel Members</CardTitle>
                  <CardDescription>
                    Enter details of panel members for thesis evaluation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {panelOptions.map((option) => (
                    <SearchableDropdown
                      key={option.id}
                      value={option.value}
                      options={panelOptions}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Thesis Defense Schedule</CardTitle>
                  <CardDescription>
                    Select venue and generate date for the thesis defense.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label>Thesis Title</Label>
                    <Input type="text" placeholder="Enter thesis title" />
                  </div>
                  <div className="space-y-1">
                    <SearchableDropdown value="Venue" options={venueOptions} />
                  </div>
                  <div className="space-y-1">
                    <Label>Schedule Date</Label>
                    <Button className="w-full cursor-pointer">
                      Generate Date
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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

interface SearchableDropdownProps {
  value: string;
  options: { id: number; value: string }[];
}

function SearchableDropdown({ value, options }: SearchableDropdownProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Label>{value}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selected || `Select ${value}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${value}`} />
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      setSelected(option.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {option.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
