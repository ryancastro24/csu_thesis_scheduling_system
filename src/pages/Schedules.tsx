import { useState, useEffect } from "react";
import { Form, ActionFunction, useNavigation } from "react-router-dom";
import { format } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Loader2 } from "lucide-react";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaCheck } from "react-icons/fa6";
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

import { FaEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FaCircleMinus, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";

type Venues = {
  label: string;
  value: string;
};
import axios from "axios";
const venueOptions: Venues[] = [
  { label: "Room 101", value: "Room 101" },
  { label: "Room 202", value: "Room 202" },
  { label: "Main Hall", value: "Main Hall" },
  { label: "Online (Zoom)", value: "Online (Zoom)" },
];
import { getStudents, getfaculty, getChairpersons } from "@/backend_api/users";
import { useLoaderData } from "react-router-dom";
import {
  createThesisSchedule,
  getThesisDocuments,
  rescheduleThesis,
  updateThesisScheduleApproval,
} from "@/backend_api/thesisDocument";
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries(),
  );

  console.log(data);

  if (data?.submit === "submitSchedule") {
    // Create a new FormData object to include the actual file
    const thesisScheduleData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      thesisScheduleData.append(key, value);
    }

    const thesisSchedule = await createThesisSchedule(thesisScheduleData);
    console.log(data);
    return thesisSchedule;
  }

  if (data?.submit === "reschedule") {
    const rescheduleThesisData = await rescheduleThesis(data.id, data);

    console.log("reschedule data for testing", rescheduleThesisData);
    return rescheduleThesisData;
  }

  if (data?.submit === "forScheduleStatusReject") {
    const updateThesisScheduleApprovalData = await updateThesisScheduleApproval(
      data.thesisId,
      data,
    );

    return updateThesisScheduleApprovalData;
  }

  if (data?.submit === "forScheduleStatusApprove") {
    const updateThesisScheduleApprovalData = await updateThesisScheduleApproval(
      data.thesisId,
      data,
    );

    return updateThesisScheduleApprovalData;
  }
};
export async function loader() {
  const students = await getStudents();
  const faculty = await getfaculty();
  const chairpersons = await getChairpersons();
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);
  console.log("user data", userData);
  const thesisSchedules = await getThesisDocuments(userData.departmentAcronym);

  return { students, faculty, chairpersons, thesisSchedules, userData };
}

type ScheduleTab = "for-approval" | "reschedule" | "archives";

const ITEMS_PER_PAGE = 6;
const Schedules = () => {
  const { thesisSchedules, userData } = useLoaderData();

  console.log("thesis schedules", thesisSchedules);

  const [activeTab, setActiveTab] = useState<ScheduleTab>("for-approval");
  const [generateDateRescheduleLoading, setGenerateDateRescheduleLoading] =
    useState(false);
  const [isGeneratedDateDialogOpen, setIsGeneratedDateDialogOpen] =
    useState(true);
  const navigation = useNavigation();

  const [generatedReschedule, setGeneratedRescheduleUpdate] = useState<
    Array<{ date: string; time: string }>
  >([]);

  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleStartTime, setRescheduleStartTime] = useState("");
  const [rescheduleEndTime, setRescheduleEndTime] = useState("");
  const [, setOpenThesisModal] = useState(false);

  const [selectedThesis, setSelectedThesis] = useState<any | null>(null);
  const [verifiedDateMessage, setVerifiedDateMessage] = useState("");

  // Function to handle downloading the approval file
  const handleDownloadApprovalFile = (thesis: any) => {
    if (thesis.approvalFile) {
      // Open the PDF in a new tab
      window.open(thesis.approvalFile, "_blank");
    } else {
      alert("No approval file available for viewing");
    }
  };

  const [selectedFaculty1] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty2] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty3] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty4] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const handleSubmitDReschedule = async () => {
    setGenerateDateRescheduleLoading(true);
    const data = {
      panel1: selectedThesis?.panels[0]?._id || null,
      panel2: selectedThesis?.panels[1]?._id || null,
      panel3: selectedThesis?.panels[2]?._id || null,
      panel4: selectedThesis?.panels[3]?._id || null,
      dateRange: formattedDateRange,
      chairperson: userData.id,
      adminId: "67ff1871d66d128fd30735db",
    };

    try {
      const response = await axios.post(
        `${baseAPI}/schedules/generateThesisSchedule/data`,
        data,
      );

      const scheduleData = response.data?.data || [];
      setGeneratedRescheduleUpdate(scheduleData);
      // Automatically set the first schedule
      if (scheduleData.length > 0) {
        const firstSchedule = scheduleData[0];
        handleSetRescheduleDateTime(firstSchedule.date, firstSchedule.time);
      }
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    } finally {
      setGenerateDateRescheduleLoading(false);
    }
  };

  const handleVerifyDateTime = async (date: string, time: string) => {
    const data = {
      date: date,
      time: time,
      panel1: selectedFaculty1?.id,
      panel2: selectedFaculty2?.id,
      panel3: selectedFaculty3?.id,
      panel4: selectedFaculty4?.id,
      chairperson: userData.id,
      adminId: "67d29ce1990acc26a58cb53a",
    };

    console.log(data);

    try {
      const response = await axios.post(
        `${baseAPI}/schedules/verifyGenerateDateTime/data`,
        data,
      );

      setVerifiedDateMessage(response.data?.message);

      return response.data; // Return the created department data
    } catch (error) {
      console.error("Error adding department:", error);
      throw error; // Rethrow the error for handling
    } finally {
    }
  };

  const handleSetRescheduleDateTime = (date: string, time: string) => {
    setRescheduleDate(date);
    const revisedTime = time.split(" - ");
    setRescheduleStartTime(revisedTime[0]);
    setRescheduleEndTime(revisedTime[1]);
    setIsGeneratedDateDialogOpen(false);
  };
  const [venue, setVenue] = useState("");

  const formattedDateRange =
    dateRange.from && dateRange.to
      ? `${format(dateRange.from, "yyyy-MM-dd")} - ${format(
          dateRange.to,
          "yyyy-M-d",
        )}`
      : "Select date range";
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Filter schedules based on search query
  const filteredSchedules = thesisSchedules.filter((val: any) =>
    val.thesisTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabFilteredSchedules = filteredSchedules.filter((val: any) => {
    // RESCHEDULE has highest priority

    if (activeTab === "for-approval") {
      return (
        val.forScheduleStatus === "idle" || val.forScheduleStatus === "pending"
      );
    }

    if (activeTab === "reschedule") {
      return val.reschedule === true;
    }

    if (activeTab === "archives") {
      return val.forScheduleStatus === "approve" && val.reschedule !== true;
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(tabFilteredSchedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedSchedules = tabFilteredSchedules.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    if (verifiedDateMessage) {
      const timer = setTimeout(() => setVerifiedDateMessage(""), 5000);
      return () => clearTimeout(timer); // Cleanup on component unmount or message change
    }
  }, [verifiedDateMessage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const forApprovalCount = filteredSchedules.filter(
    (val: any) => val.forScheduleStatus !== "approve",
  ).length;

  const rescheduleCount = filteredSchedules.filter(
    (val: any) =>
      val.reschedule === true ||
      (val.defended == "re-defense" && val.schedule === null),
  ).length;

  return (
    <div className="w-full h-full p-4">
      {/* Header with Search Input and Add Schedule Button */}
      <div className="flex gap-5 items-center  mb-4">
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

        <div className="flex items-center gap-3">
          {[
            { label: "For Approval", value: "for-approval" },
            { label: "Reschedule", value: "reschedule" },
            { label: "Archives", value: "archives" },
          ].map((tab) => {
            const badgeCount =
              tab.value === "for-approval"
                ? forApprovalCount
                : tab.value === "reschedule"
                  ? rescheduleCount
                  : 0;

            return (
              <Button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as ScheduleTab)}
                className={`relative rounded-lg px-6 ${
                  activeTab === tab.value
                    ? "bg-orange-500 text-white"
                    : "bg-black text-white hover:bg-neutral-800"
                }`}
              >
                {tab.label}

                {badgeCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                    {badgeCount}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-3 gap-3">
        {paginatedSchedules.map((val: any) => (
          <Card key={val?._id} className="dark:bg-[#303030] bg-slate-100">
            <CardHeader>
              <CardTitle>{val?.thesisTitle}</CardTitle>
              <CardDescription>
                Scheduled Date: {val?.schedule?.date || "Not set"}
              </CardDescription>
              <CardDescription>
                Time: {val?.schedule?.time || "Not set"} | Venue:{" "}
                {val?.venue || "TBA"}
              </CardDescription>
              <CardDescription>
                Type: {val?.type == "proposal" ? "Proposal" : "Final"}
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
                                const fullName = `${student?.firstname} ${
                                  student?.middlename
                                    ? student.middlename + " "
                                    : ""
                                }${student?.lastname}${
                                  student?.suffix ? " " + student?.suffix : ""
                                }`;

                                return (
                                  <li
                                    className="text-sm opacity-50 "
                                    key={student._id}
                                  >
                                    {index + 1}. {fullName}
                                  </li>
                                );
                              },
                            )}
                          </ol>
                        </div>

                        <div className="mt-2">
                          <h2>Adviser</h2>
                          <span className="text-sm opacity-50">
                            {val?.adviser?.firstname}
                            {val?.adviser.middlename
                              ? val?.adviser?.middlename + " "
                              : ""}
                            {val?.adviser?.lastname}
                            {val?.adviser?.suffix
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
                            const fullName = `${panel?.firstname} ${
                              panel?.middlename ? panel?.middlename + " " : ""
                            }${panel?.lastname}${
                              panel?.suffix ? " " + panel?.suffix : ""
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
                            Date: {val.schedule?.date}
                          </span>
                          <span className="text-sm opacity-50">
                            Time: {val.schedule?.time}
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
                    <Button className="cursor-pointer">
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
                  <Form
                    method="post"
                    action={`/dashboard/schedules/${val?._id}/destroy`}
                  >
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
                  </Form>
                </DialogContent>
              </Dialog>

              <Button
                className="cursor-pointer "
                size={"icon"}
                variant={"outline"}
                onClick={() => handleDownloadApprovalFile(val)}
              >
                <FaFileCircleCheck />
              </Button>
              {val.forScheduleStatus === "approve" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={
                        "schedule" in val &&
                        val.schedule !== null &&
                        val.reschedule !== true &&
                        (val.status === "approved" || val.status === "pending")
                      }
                      onClick={() => {
                        setOpenThesisModal(true);
                        setSelectedThesis(val);
                      }}
                      className={`cursor-pointer ${
                        val.reschedule ? "bg-red-500 hover:bg-red-700" : ""
                      }`}
                      size={"icon"}
                    >
                      <FaCalendarDays />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[500px]  overflow-auto  p-4 rounded-lg shadow-lg">
                    <DialogHeader>
                      <DialogTitle>Set Thesis Schedule</DialogTitle>
                      <DialogDescription>
                        Select venue and schedule date
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-1 w-full">
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
                      <Label>Schedule Date</Label>

                      <DateTimeRangePicker
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                      />

                      <Input
                        value={formattedDateRange}
                        type="hidden"
                        name="dateRange"
                      />
                      <Input value={startTime} type="hidden" name="startTime" />

                      <Input value={endTime} type="hidden" name="endTime" />

                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          handleSubmitDReschedule();
                        }}
                        className="w-full cursor-pointer"
                        variant="secondary"
                      >
                        {generateDateRescheduleLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Generate Date"
                        )}
                      </Button>

                      {rescheduleDate &&
                        rescheduleStartTime &&
                        rescheduleEndTime && (
                          <span className="text-sm text-green-500">
                            Selected Schedule: {rescheduleDate} (
                            {rescheduleStartTime} - {rescheduleEndTime})
                          </span>
                        )}

                      {Array.isArray(generatedReschedule) &&
                        generatedReschedule.length > 0 && (
                          <div className="space-y-4">
                            {/* First Available Schedule Card */}
                            <Card className="dark:bg-[#303030] bg-slate-100 mt-4">
                              <CardHeader>
                                <CardTitle>Recommended Schedule</CardTitle>
                                <CardDescription>
                                  This schedule has been automatically selected
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between items-center gap-4">
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      Date: {generatedReschedule[0].date}
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      Time: {generatedReschedule[0].time}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* View More Button */}
                            <Button
                              onClick={() => setIsGeneratedDateDialogOpen(true)}
                              className="w-full"
                              variant="outline"
                            >
                              View and Change Schedule
                            </Button>

                            {/* Full Schedule Dialog */}
                            <Dialog
                              open={isGeneratedDateDialogOpen}
                              onOpenChange={setIsGeneratedDateDialogOpen}
                            >
                              <DialogContent className="max-w-xl">
                                <div
                                  className={`alert ${
                                    verifiedDateMessage ===
                                    "Schedule conflict detected"
                                      ? "bg-red-500"
                                      : verifiedDateMessage ===
                                          "No conflicts detected"
                                        ? "bg-green-500"
                                        : ""
                                  } text-white p-4 rounded`}
                                  style={{
                                    display: verifiedDateMessage
                                      ? "block"
                                      : "none",
                                  }}
                                >
                                  {verifiedDateMessage ===
                                  "Schedule conflict detected"
                                    ? "There is a conflict with the selected date and time."
                                    : verifiedDateMessage ===
                                        "No conflicts detected"
                                      ? "The selected date and time are available."
                                      : ""}
                                </div>

                                <DialogTitle>
                                  All Available Schedules
                                </DialogTitle>
                                <DialogDescription>
                                  View and select from all available time slots
                                </DialogDescription>

                                <div className="overflow-auto max-h-60">
                                  <table className="w-full border-collapse">
                                    <thead className="bg-[#303030] sticky top-0">
                                      <tr>
                                        <th className="border px-4 py-2">
                                          Date
                                        </th>
                                        <th className="border px-4 py-2">
                                          Time
                                        </th>
                                        <th className="border px-4 py-2">
                                          Set
                                        </th>
                                        <th className="border px-4 py-2">
                                          Verification
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {generatedReschedule
                                        .slice(1)
                                        .map((scheduleItem, index) => (
                                          <tr key={index}>
                                            <td className="border px-4 py-2">
                                              {scheduleItem.date}
                                            </td>
                                            <td className="border px-4 py-2">
                                              {scheduleItem.time}
                                            </td>
                                            <td className="border px-4 py-2">
                                              <Button
                                                onClick={() =>
                                                  handleSetRescheduleDateTime(
                                                    scheduleItem.date,
                                                    scheduleItem.time,
                                                  )
                                                }
                                                variant="secondary"
                                              >
                                                Set
                                              </Button>
                                            </td>
                                            <td className="border px-4 py-2">
                                              <Button
                                                onClick={() =>
                                                  handleVerifyDateTime(
                                                    scheduleItem.date,
                                                    scheduleItem.time,
                                                  )
                                                }
                                              >
                                                Verify
                                              </Button>
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() =>
                                      setIsGeneratedDateDialogOpen(false)
                                    }
                                  >
                                    Close
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>

                      <Form method="PUT">
                        <Input type="hidden" value={val._id} name="id" />
                        <Input type="hidden" value={venue} name="venue" />
                        <Input
                          type="hidden"
                          value={rescheduleDate}
                          name="date"
                        />
                        <Input
                          type="hidden"
                          value={`${rescheduleStartTime} - ${rescheduleEndTime}`}
                          name="time"
                        />

                        <Button
                          name="submit"
                          value={"reschedule"}
                          className="cursor-pointer"
                          variant={val.reschedule ? "destructive" : "default"}
                          type="submit"
                        >
                          {val.reschedule ? (
                            navigation.state === "submitting" ? (
                              <h2 className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading
                              </h2>
                            ) : (
                              "Reschedule"
                            )
                          ) : navigation.state === "submitting" ? (
                            <h2 className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading
                            </h2>
                          ) : (
                            "Set Schedule"
                          )}
                        </Button>
                      </Form>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {val.forScheduleStatus === "pending" && (
                <div className="flex items-center gap-2">
                  <Form method="put">
                    <Input type="hidden" name="thesisId" value={val._id} />
                    <Input
                      type="hidden"
                      name="forScheduleStatus"
                      value={"approve"}
                    />
                    <Button
                      type="submit"
                      name="submit"
                      value="forScheduleStatusApprove"
                      className="bg-green-500 hover:bg-green-600"
                      size={"icon"}
                    >
                      <FaCheck />
                    </Button>
                  </Form>
                  <Form method="put">
                    <Input type="hidden" name="thesisId" value={val._id} />
                    <Input
                      type="hidden"
                      name="forScheduleStatus"
                      value={"reject"}
                    />
                    <Button
                      type="submit"
                      name="submit"
                      value="forScheduleStatusReject"
                      className="bg-red-500 hover:bg-red-600"
                      size={"icon"}
                    >
                      <FaXmark />
                    </Button>
                  </Form>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm flex items-center gap-2">
                {val?.status === "pending" ? (
                  <FaCircleMinus />
                ) : val?.status === "approved" &&
                  (val?.thesisFinalStatus === "defended" ||
                    val?.thesisFinalStatus === "minor revision" ||
                    val?.thesisFinalStatus === "major revision" ||
                    val?.thesisFinalStatus === "pending") ? (
                  <FaCircleCheck />
                ) : (
                  <FaCircleXmark />
                )}
                {val?.status === "pending"
                  ? "Pending"
                  : val?.status === "approved" &&
                      (val?.thesisFinalStatus === "defended" ||
                        val?.thesisFinalStatus === "minor revision" ||
                        val?.thesisFinalStatus === "major revision" ||
                        val?.thesisFinalStatus === "pending")
                    ? "Approved"
                    : "For Reschedule" +
                      (val?.thesisFinalStatus === "redefense"
                        ? " (Re-defense)"
                        : "")}
              </p>

              {val?.status === "approved" &&
                (val.thesisFinalStatus === "defended" ||
                  val.thesisFinalStatus === "minor revision" ||
                  val.thesisFinalStatus === "major revision") && (
                  <span className="text-sm text-green-500 flex items-center gap-2">
                    {" "}
                    {val?.thesisFinalStatus === "defended"
                      ? "Defended"
                      : val?.thesisFinalStatus === "minor revision"
                        ? "Minor Revision"
                        : "Major Revision"}
                  </span>
                )}

              {val?.status === "approved" &&
                val.thesisFinalStatus === "pending" && (
                  <span className="text-sm text-orange-500 flex items-center gap-2">
                    Waiting for Result
                  </span>
                )}
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
    </div>
  );
};

export default Schedules;
