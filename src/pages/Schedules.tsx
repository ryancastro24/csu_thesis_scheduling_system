import { useState, useEffect } from "react";
import {
  Form,
  ActionFunction,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { format } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Loader2 } from "lucide-react";
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
import { DateTimeRangePicker } from "@/systemComponents/DateAndTimeRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { FaCircleMinus, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type Venues = {
  label: string;
  value: string;
};

const venueOptions: Venues[] = [
  { label: "Room 101", value: "Room 101" },
  { label: "Room 202", value: "Room 202" },
  { label: "Main Hall", value: "Main Hall" },
  { label: "Online (Zoom)", value: "Online (Zoom)" },
];
import { getStudents, getfaculty, getChairpersons } from "@/backend_api/users";
import { useLoaderData } from "react-router-dom";
import { generateSchedule } from "@/backend_api/schedules";
import {
  createThesisSchedule,
  getThesisDocuments,
} from "@/backend_api/thesisDocument";
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  console.log(data);

  if (data?.submit === "submitSchedule") {
    const thesisSchedule = await createThesisSchedule(data);
    console.log(thesisSchedule);
    return thesisSchedule;
  }

  if (data?.submit === "generateSchedule") {
    const schedule = await generateSchedule(data);
    console.log(schedule);
    return schedule;
  }
};
export async function loader() {
  const students = await getStudents();
  const faculty = await getfaculty();
  const chairpersons = await getChairpersons();
  const thesisSchedules = await getThesisDocuments();

  return { students, faculty, chairpersons, thesisSchedules };
}

const ITEMS_PER_PAGE = 6;
const Schedules = () => {
  const { students, faculty, thesisSchedules } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [schedule, setSchedule] = useState("");
  const [, setOpenThesisModal] = useState(false);

  const [thesisType, setThesisType] = useState("");

  const [selectedFaculty, setSelectedFaculty] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty1, setSelectedFaculty1] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty2, setSelectedFaculty2] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty3, setSelectedFaculty3] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty4, setSelectedFaculty4] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedStudent1, setSelectedStudent1] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedStudent2, setSelectedStudent2] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedStudent3, setSelectedStudent3] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const [thesisTitle, setThesisTitle] = useState("");
  const [venue, setVenue] = useState("");

  const formattedDateRange =
    dateRange.from && dateRange.to
      ? `${format(dateRange.from, "yyyy-MM-dd")} - ${format(
          dateRange.to,
          "yyyy-M-d"
        )}`
      : "Select date range";
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  console.log(formattedDateRange);
  console.log(startTime);
  console.log(endTime);
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
  const filteredSchedules = thesisSchedules.filter((val: any) =>
    val.thesisTitle.toLowerCase().includes(searchQuery.toLowerCase())
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

  useEffect(() => {
    if (actionData?.message?.startsWith("Available Date")) {
      const date = actionData.message.split(": ")[1]; // Extracts the date part
      setSchedule(date);
    }
  }, [actionData]);
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
        {paginatedSchedules.map((val: any) => (
          <Card key={val?._id} className="dark:bg-[#303030] bg-slate-100">
            <CardHeader>
              <CardTitle>{val?.thesisTitle}</CardTitle>
              <CardDescription>
                Scheduled Date: {val?.schedule.date}
              </CardDescription>
              <CardDescription>
                Time: {val?.schedule.time} | {val?.venue}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpenThesisModal(true)}
                    className="cursor-pointer "
                    size={"icon"}
                    variant={"outline"}
                  >
                    <FaEye />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{val?.thesisTitle}</DialogTitle>
                    <DialogDescription>
                      {val?.type == "proposal" ? "Proposal" : "Final"} |{" "}
                      {val?.status === "pending"
                        ? "Pending"
                        : val?.status === "approved"
                        ? "Approved"
                        : "For Reschedule"}{" "}
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <div className="grid grid-cols-2">
                      {/* Researchers List */}
                      <div>
                        <div>
                          <h2>Researchers</h2>
                          <ol>
                            {val?.students.map(
                              (student: any, index: number) => {
                                // Extract the full name (handle optional middlename and suffix)
                                const fullName = `${student.firstname} ${
                                  student.middlename
                                    ? student.middlename + " "
                                    : ""
                                }${student.lastname}${
                                  student.suffix ? " " + student.suffix : ""
                                }`;

                                return (
                                  <li
                                    className="text-sm opacity-50 "
                                    key={student._id}
                                  >
                                    {index + 1}. {fullName}
                                  </li>
                                );
                              }
                            )}
                          </ol>
                        </div>

                        <div className="mt-2">
                          <h2>Adviser</h2>
                          <span className="text-sm opacity-50">
                            {val?.adviser.firstname}
                            {val?.adviser.middlename
                              ? val?.adviser.middlename + " "
                              : ""}
                            {val?.adviser.lastname}
                            {val?.adviser.suffix
                              ? " " + val?.adviser.suffix
                              : ""}
                          </span>
                        </div>
                      </div>

                      {/* Panels List */}
                      <div>
                        <h2>Panels</h2>
                        <ol>
                          {val?.panels.map((panel: any, index: number) => {
                            // Extract the full name (handle optional middlename and suffix)
                            const fullName = `${panel.firstname} ${
                              panel.middlename ? panel.middlename + " " : ""
                            }${panel.lastname}${
                              panel.suffix ? " " + panel.suffix : ""
                            }`;

                            return (
                              <li
                                className="text-sm opacity-50"
                                key={panel._id}
                              >
                                {index + 1}. {fullName}
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div>
                        <h2>Time & Date Defense Schedule</h2>

                        <div className="flex flex-col ">
                          <span className="text-sm opacity-50">
                            Date: {val.schedule.date}
                          </span>
                          <span className="text-sm opacity-50">
                            Time: {val.schedule.time}
                          </span>
                          <span className="text-sm opacity-50">
                            Venu : {val.venue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button className="cursor-pointer" type="submit">
                      Download Manuscript
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpenThesisModal(true)}
                    className="cursor-pointer "
                    size={"icon"}
                    variant={"outline"}
                  >
                    <FaTrash />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Delete Thesis</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this thesis?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      className="cursor-pointer"
                      variant={"destructive"}
                      type="submit"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* update thesis model */}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="cursor-pointer "
                    size={"icon"}
                    variant={"outline"}
                  >
                    <AiFillEdit />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Thesis Schedule</DialogTitle>
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
                          <SearchableDropdown
                            label="Student 1"
                            options={students}
                            value={selectedStudent1} // Pass the entire object
                            onValueChange={setSelectedStudent1} // Ensure it updates correctly
                          />

                          <SearchableDropdown
                            label="Student 2"
                            options={students}
                            value={selectedStudent2} // Pass the entire object
                            onValueChange={setSelectedStudent2} // Ensure it updates correctly
                          />
                          <SearchableDropdown
                            label="Student 3"
                            value={selectedStudent3} // Pass the entire object
                            onValueChange={setSelectedStudent3} // Ensure it updates correctly
                            options={students}
                          />

                          <SearchableDropdown
                            label="Adviser"
                            value={selectedFaculty} // Pass the entire object
                            onValueChange={setSelectedFaculty} // Ensure it updates correctly
                            options={faculty}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Panels Tab */}
                    <TabsContent value="panels">
                      <Card>
                        <CardHeader>
                          <CardTitle>Panel Members</CardTitle>
                          <CardDescription>
                            Enter details of panel members for thesis
                            evaluation.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <SearchableDropdown
                            label="Panel 1"
                            value={selectedFaculty1} // Pass the entire object
                            onValueChange={setSelectedFaculty1} // Ensure it updates correctly
                            options={faculty}
                          />

                          <SearchableDropdown
                            label="Panel 2"
                            value={selectedFaculty2} // Pass the entire object
                            onValueChange={setSelectedFaculty2} // Ensure it updates correctly
                            options={faculty}
                          />

                          <SearchableDropdown
                            label="Panel 3"
                            value={selectedFaculty3} // Pass the entire object
                            onValueChange={setSelectedFaculty3} // Ensure it updates correctly
                            options={faculty}
                          />

                          <SearchableDropdown
                            label="Oral Adviser"
                            value={selectedFaculty4} // Pass the entire object
                            onValueChange={setSelectedFaculty4} // Ensure it updates correctly
                            options={faculty}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Schedule Tab */}
                    <TabsContent value="schedule">
                      <Card>
                        <CardHeader>
                          <CardTitle>Thesis Defense Schedule</CardTitle>
                          <CardDescription>
                            Select venue and generate date for the thesis
                            defense.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label>Thesis Title</Label>
                            <Input
                              value={thesisTitle}
                              onChange={(e) => setThesisTitle(e.target.value)}
                              type="text"
                              placeholder="Enter thesis title"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label>Venue</Label>
                            <Select value={venue} onValueChange={setVenue}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Venue" />
                              </SelectTrigger>
                              <SelectContent>
                                {venueOptions.map((val) => (
                                  <SelectItem key={val.label} value={val.value}>
                                    {val.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label>Type</Label>
                            <Select
                              value={thesisType}
                              onValueChange={setThesisType}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Thesis Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={"proposal"}>
                                  Proposal
                                </SelectItem>

                                <SelectItem value={"final"}>Final</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label>Schedule Date</Label>

                            <DateTimeRangePicker
                              dateRange={dateRange}
                              setDateRange={setDateRange}
                              startTime={startTime}
                              setStartTime={setStartTime}
                              endTime={endTime}
                              setEndTime={setEndTime}
                            />

                            <Form method="POST">
                              <Input
                                value={formattedDateRange}
                                type="hidden"
                                name="dateRange"
                              />

                              <Input
                                value={startTime}
                                type="hidden"
                                name="startTime"
                              />

                              <Input
                                value={endTime}
                                type="hidden"
                                name="endTime"
                              />
                              <Input
                                value={selectedFaculty2?.id}
                                type="hidden"
                                name="panel2"
                              />
                              <Input
                                value={selectedFaculty1?.id}
                                type="hidden"
                                name="panel1"
                              />
                              <Input
                                value={selectedFaculty2?.id}
                                type="hidden"
                                name="panel2"
                              />
                              <Input
                                value={selectedFaculty3?.id}
                                type="hidden"
                                name="panel3"
                              />
                              <Input
                                value={"67d2918b990acc26a58cb4be"}
                                type="hidden"
                                name="chairperson"
                              />
                              <Input
                                value={"67d29ce1990acc26a58cb53a"}
                                type="hidden"
                                name="adminId"
                              />

                              <Input
                                value={selectedFaculty4?.id}
                                type="hidden"
                                name="panel4"
                              />
                              <Button
                                type="submit"
                                name="submit"
                                value={"generateSchedule"}
                                disabled={
                                  selectedFaculty1 == null ||
                                  selectedFaculty2 == null ||
                                  selectedFaculty3 == null ||
                                  selectedFaculty4 == null ||
                                  startTime == "" ||
                                  endTime == "" ||
                                  dateRange.from == undefined ||
                                  dateRange.to == undefined
                                }
                                className="w-full cursor-pointer"
                              >
                                Generate Date
                              </Button>
                            </Form>
                            <span className="text-sm text-red-500">
                              {selectedFaculty1 == null ||
                              selectedFaculty2 == null ||
                              selectedFaculty3 == null ||
                              selectedFaculty4 == null ||
                              startTime == "" ||
                              endTime == "" ||
                              dateRange.from == undefined ||
                              dateRange.to == undefined
                                ? "Fill all panels field to generate"
                                : ""}
                            </span>

                            <span
                              className={`text-sm ${
                                actionData?.message.startsWith("Available Date")
                                  ? "text-green-500"
                                  : "text-red-500"
                              } `}
                            >
                              {actionData?.message.startsWith(
                                "Available Date"
                              ) &&
                                `${actionData?.message} (${startTime} - ${endTime})`}
                              {!actionData?.message.startsWith(
                                "Available Date"
                              ) && actionData?.message}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Form method="POST">
                      <Input
                        value={selectedStudent1?.id}
                        type="hidden"
                        name="student1"
                      />
                      <Input
                        value={selectedStudent2?.id}
                        type="hidden"
                        name="student2"
                      />
                      <Input
                        value={selectedStudent3?.id}
                        type="hidden"
                        name="student3"
                      />
                      <Input
                        value={selectedFaculty?.id}
                        type="hidden"
                        name="adviser"
                      />
                      <Input
                        value={`${startTime} - ${endTime}`}
                        type="hidden"
                        name="time"
                      />

                      <Input value={thesisType} type="hidden" name="type" />

                      <Input
                        value={selectedFaculty1?.id}
                        type="hidden"
                        name="panel1"
                      />
                      <Input
                        value={selectedFaculty2?.id}
                        type="hidden"
                        name="panel2"
                      />
                      <Input
                        value={selectedFaculty3?.id}
                        type="hidden"
                        name="panel3"
                      />

                      <Input
                        value={selectedFaculty4?.id}
                        type="hidden"
                        name="panel4"
                      />
                      <Input
                        value={thesisTitle}
                        type="hidden"
                        name="thesisTitle"
                      />
                      <Input value={venue} type="hidden" name="venue" />
                      <Input value={schedule} type="hidden" name="date" />
                      <Button
                        name="submit"
                        value={"submitSchedule"}
                        disabled={
                          selectedStudent1 == null ||
                          selectedStudent2 == null ||
                          selectedStudent3 == null ||
                          selectedFaculty == null ||
                          selectedFaculty1 == null ||
                          selectedFaculty2 == null ||
                          selectedFaculty3 == null ||
                          selectedFaculty4 == null ||
                          thesisTitle == "" ||
                          venue == "" ||
                          startTime == "" ||
                          endTime == "" ||
                          dateRange.from == undefined ||
                          dateRange.to == undefined
                        }
                        onClick={handleDialogSubmit}
                      >
                        {navigation.state === "submitting" ? (
                          <>
                            {" "}
                            <Loader2 className="animate-spin" />
                            Please wait
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </Form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter>
              <p className="text-sm flex items-center gap-2">
                {val?.status === "pending" ? (
                  <FaCircleMinus />
                ) : val?.status === "approved" ? (
                  <FaCircleCheck />
                ) : (
                  <FaCircleXmark />
                )}
                {val?.status === "pending"
                  ? "Pending"
                  : val?.status === "approved"
                  ? "Approved"
                  : "For Reschedule"}
              </p>
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
                  <SearchableDropdown
                    label="Student 1"
                    options={students}
                    value={selectedStudent1} // Pass the entire object
                    onValueChange={setSelectedStudent1} // Ensure it updates correctly
                  />

                  <SearchableDropdown
                    label="Student 2"
                    options={students}
                    value={selectedStudent2} // Pass the entire object
                    onValueChange={setSelectedStudent2} // Ensure it updates correctly
                  />
                  <SearchableDropdown
                    label="Student 3"
                    value={selectedStudent3} // Pass the entire object
                    onValueChange={setSelectedStudent3} // Ensure it updates correctly
                    options={students}
                  />

                  <SearchableDropdown
                    label="Adviser"
                    value={selectedFaculty} // Pass the entire object
                    onValueChange={setSelectedFaculty} // Ensure it updates correctly
                    options={faculty}
                  />
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
                  <SearchableDropdown
                    label="Panel 1"
                    value={selectedFaculty1} // Pass the entire object
                    onValueChange={setSelectedFaculty1} // Ensure it updates correctly
                    options={faculty}
                  />

                  <SearchableDropdown
                    label="Panel 2"
                    value={selectedFaculty2} // Pass the entire object
                    onValueChange={setSelectedFaculty2} // Ensure it updates correctly
                    options={faculty}
                  />

                  <SearchableDropdown
                    label="Panel 3"
                    value={selectedFaculty3} // Pass the entire object
                    onValueChange={setSelectedFaculty3} // Ensure it updates correctly
                    options={faculty}
                  />

                  <SearchableDropdown
                    label="Oral Adviser"
                    value={selectedFaculty4} // Pass the entire object
                    onValueChange={setSelectedFaculty4} // Ensure it updates correctly
                    options={faculty}
                  />
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
                    <Input
                      value={thesisTitle}
                      onChange={(e) => setThesisTitle(e.target.value)}
                      type="text"
                      placeholder="Enter thesis title"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Venue</Label>
                    <Select value={venue} onValueChange={setVenue}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {venueOptions.map((val) => (
                          <SelectItem key={val.label} value={val.value}>
                            {val.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Type</Label>
                    <Select value={thesisType} onValueChange={setThesisType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Thesis Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"proposal"}>Proposal</SelectItem>

                        <SelectItem value={"final"}>Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Schedule Date</Label>

                    <DateTimeRangePicker
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                      startTime={startTime}
                      setStartTime={setStartTime}
                      endTime={endTime}
                      setEndTime={setEndTime}
                    />

                    <Form method="POST">
                      <Input
                        value={formattedDateRange}
                        type="hidden"
                        name="dateRange"
                      />

                      <Input value={startTime} type="hidden" name="startTime" />

                      <Input value={endTime} type="hidden" name="endTime" />
                      <Input
                        value={selectedFaculty2?.id}
                        type="hidden"
                        name="panel2"
                      />
                      <Input
                        value={selectedFaculty1?.id}
                        type="hidden"
                        name="panel1"
                      />
                      <Input
                        value={selectedFaculty2?.id}
                        type="hidden"
                        name="panel2"
                      />
                      <Input
                        value={selectedFaculty3?.id}
                        type="hidden"
                        name="panel3"
                      />
                      <Input
                        value={"67d2918b990acc26a58cb4be"}
                        type="hidden"
                        name="chairperson"
                      />
                      <Input
                        value={"67d29ce1990acc26a58cb53a"}
                        type="hidden"
                        name="adminId"
                      />

                      <Input
                        value={selectedFaculty4?.id}
                        type="hidden"
                        name="panel4"
                      />
                      <Button
                        type="submit"
                        name="submit"
                        value={"generateSchedule"}
                        disabled={
                          selectedFaculty1 == null ||
                          selectedFaculty2 == null ||
                          selectedFaculty3 == null ||
                          selectedFaculty4 == null ||
                          startTime == "" ||
                          endTime == "" ||
                          dateRange.from == undefined ||
                          dateRange.to == undefined
                        }
                        className="w-full cursor-pointer"
                      >
                        Generate Date
                      </Button>
                    </Form>
                    <span className="text-sm text-red-500">
                      {selectedFaculty1 == null ||
                      selectedFaculty2 == null ||
                      selectedFaculty3 == null ||
                      selectedFaculty4 == null ||
                      startTime == "" ||
                      endTime == "" ||
                      dateRange.from == undefined ||
                      dateRange.to == undefined
                        ? "Fill all panels field to generate"
                        : ""}
                    </span>

                    <span
                      className={`text-sm ${
                        actionData?.message.startsWith("Available Date")
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      {actionData?.message.startsWith("Available Date") &&
                        `${actionData?.message} (${startTime} - ${endTime})`}
                      {!actionData?.message.startsWith("Available Date") &&
                        actionData?.message}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="ghost" onClick={handleDialogClose}>
              Cancel
            </Button>

            <Form method="POST">
              <Input
                value={selectedStudent1?.id}
                type="hidden"
                name="student1"
              />
              <Input
                value={selectedStudent2?.id}
                type="hidden"
                name="student2"
              />
              <Input
                value={selectedStudent3?.id}
                type="hidden"
                name="student3"
              />
              <Input value={selectedFaculty?.id} type="hidden" name="adviser" />
              <Input
                value={`${startTime} - ${endTime}`}
                type="hidden"
                name="time"
              />

              <Input value={thesisType} type="hidden" name="type" />

              <Input value={selectedFaculty1?.id} type="hidden" name="panel1" />
              <Input value={selectedFaculty2?.id} type="hidden" name="panel2" />
              <Input value={selectedFaculty3?.id} type="hidden" name="panel3" />

              <Input value={selectedFaculty4?.id} type="hidden" name="panel4" />
              <Input value={thesisTitle} type="hidden" name="thesisTitle" />
              <Input value={venue} type="hidden" name="venue" />
              <Input value={schedule} type="hidden" name="date" />
              <Button
                name="submit"
                value={"submitSchedule"}
                disabled={
                  selectedStudent1 == null ||
                  selectedStudent2 == null ||
                  selectedStudent3 == null ||
                  selectedFaculty == null ||
                  selectedFaculty1 == null ||
                  selectedFaculty2 == null ||
                  selectedFaculty3 == null ||
                  selectedFaculty4 == null ||
                  thesisTitle == "" ||
                  venue == "" ||
                  startTime == "" ||
                  endTime == "" ||
                  dateRange.from == undefined ||
                  dateRange.to == undefined
                }
                onClick={handleDialogSubmit}
              >
                Add Schedule
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedules;

interface SearchableDropdownProps {
  label: string;
  options: {
    _id: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    suffix?: string;
  }[];

  value: { id: string; name: string } | null; // Expect an object, not a string
  onValueChange: (value: { id: string; name: string }) => void;
}

function SearchableDropdown({
  label,
  options,

  value,
  onValueChange,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {value ? value.name : `Select ${label}`}{" "}
            {/* Ensure the name is displayed */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}`} />
            <CommandList>
              <CommandGroup>
                {options.map((option) => {
                  const fullName = `${option.firstname} ${
                    option.middlename ? option.middlename[0] + "." : ""
                  } ${option.lastname} ${option.suffix ?? ""}`.trim();
                  return (
                    <CommandItem
                      key={option._id}
                      onSelect={() => {
                        const selectedValue = {
                          id: option._id,
                          name: fullName,
                        };
                        onValueChange(selectedValue); // Persist selection

                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {fullName}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
