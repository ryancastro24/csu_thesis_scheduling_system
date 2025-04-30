import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BsPersonFillDash } from "react-icons/bs";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react"; // Optional icons
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getStudents, getfaculty, getChairpersons } from "@/backend_api/users";
import { useLoaderData } from "react-router-dom";
import { Form, ActionFunction, useNavigation } from "react-router-dom";
import {
  addAdviserAcceptanceRequest,
  getUserAdviserAcceptanceRequest,
} from "@/backend_api/adviserAcceptance";
import {
  createThesisSchedule,
  getUserThesisModel,
  getUserFinalThesisModel,
  createFinalThesisSchedule,
} from "@/backend_api/thesisDocument";

import {
  panelApprovalRequest,
  changePanel,
  getUserPanelApprovals,
} from "@/backend_api/panelApproval";

export async function loader() {
  const students = await getStudents();
  const faculty = await getfaculty();
  const chairpersons = await getChairpersons();

  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);
  const adviserAcceptanaceData = await getUserAdviserAcceptanceRequest(
    userData.id
  );

  const userThesisModel = await getUserThesisModel(userData.id);
  const userFinalThesisModel = await getUserFinalThesisModel(userData.id);
  const userPanelApprovals = await getUserPanelApprovals(userData.id);

  console.log("userThesisModel:", userThesisModel);
  console.log("userFinalThesisModel:", userFinalThesisModel);

  console.log("adviser acceptance data:", adviserAcceptanaceData);
  return {
    students,
    faculty,
    chairpersons,
    userData,
    adviserAcceptanaceData,
    userPanelApprovals,
    userThesisModel,
    userFinalThesisModel,
  };
}
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  // Pass the original FormData directly

  if (data.transaction === "adviserApproval") {
    const adviserAcceptanceData = await addAdviserAcceptanceRequest(formData);
    return adviserAcceptanceData;
  }

  if (data.transaction === "panelApproval") {
    const panelApprovalRequestData = await panelApprovalRequest(formData);
    return panelApprovalRequestData;
  }
  if (data.transaction === "changePanel") {
    console.log("changing panel formdata:", data);
    const changePanelData = await changePanel(data.id, data.oldPanelId, data);

    return changePanelData;
  }

  if (data.transaction === "addProposalRequest") {
    console.log("proposal files data:", data);

    const thesisDocument = await createThesisSchedule(formData);

    return thesisDocument;
  }

  if (data.transaction === "addFinalRequest") {
    const thesisDocument = await createFinalThesisSchedule(formData);

    return thesisDocument;
  }
};

const ThesisSection = () => {
  const {
    students,
    faculty,
    adviserAcceptanaceData,
    userPanelApprovals,
    userData,
    userThesisModel,
    userFinalThesisModel,
  } = useLoaderData();
  const navigation = useNavigation();

  const [selectedFaculty, setSelectedFaculty] = useState<{
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

  const [selectedNewPanel, setSelectedNewPanel] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="grid grid-cols-3 gap-5">
      <Card className="dark:bg-[#303030]">
        <CardHeader>
          <CardTitle>Initial Proposal</CardTitle>
          <CardDescription>
            Start your thesis journey by finding an adviser and getting panel
            approvals.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Step 1: Adviser Approval */}

          {/* Step 1: Adviser Approval */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="rounded-full p-1 bg-primary text-white">
                {adviserAcceptanaceData.status === "approve" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="h-20 w-px bg-muted" />
            </div>

            <div className="flex flex-col gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-[150px]"
                    disabled={
                      adviserAcceptanaceData.status == "approve" ||
                      adviserAcceptanaceData.status == "pending"
                    }
                    variant="outline"
                  >
                    Adviser Approval
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Find Adviser</DialogTitle>
                    <DialogDescription>
                      Browse available advisers and select one to guide your
                      thesis.
                    </DialogDescription>
                  </DialogHeader>
                  <Form method="POST" encType="multipart/form-data">
                    <Card>
                      <CardHeader>
                        <CardTitle>Student Details</CardTitle>
                        <CardDescription>
                          Select student members of the thesis.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="">
                        <input
                          name="student1"
                          type="hidden"
                          value={selectedStudent1?.id}
                        />
                        <input
                          name="student2"
                          type="hidden"
                          value={selectedStudent2?.id}
                        />
                        <input
                          name="student3"
                          type="hidden"
                          value={selectedStudent3?.id}
                        />
                        <input
                          name="adviser"
                          type="hidden"
                          value={selectedFaculty?.id}
                        />

                        <div className="grid grid-cols-2 gap-5">
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
                        </div>

                        <div className="grid grid-cols-2 gap-5">
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
                        </div>

                        <div className="grid grid-cols-2 gap-5 mt-5">
                          <div className="flex flex-col gap-3">
                            <Label>Upload Proposed Title</Label>
                            <Input
                              className="bg-[#1b1b1b]"
                              type="text"
                              name="proposeTitle"
                              placeholder="Enter thesis proposed title"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <Label>Upload Initial Thesis</Label>
                            <Input
                              className="bg-[#1b1b1b]"
                              type="file"
                              name="file"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <DialogFooter>
                      <Button
                        name="transaction"
                        value={"adviserApproval"}
                        type="submit"
                      >
                        {navigation.state === "submitting"
                          ? "Loading..."
                          : " Request for approval"}
                      </Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>

              {adviserAcceptanaceData !== "" && (
                <span className="text-sm italic">
                  Adviser acceptanace request is {adviserAcceptanaceData.status}{" "}
                  {adviserAcceptanaceData.status === "reject" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="text-orange-500 cursor-pointer">
                          (Show Reason)
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Proposal Rejected</AlertDialogTitle>
                          <AlertDialogDescription>
                            {adviserAcceptanaceData.remarks}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    ""
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Step 2: Panel Approval */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-1 ${
                  adviserAcceptanaceData !== ""
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {userPanelApprovals.length !== 0 &&
                userPanelApprovals.every(
                  (panel: any) => panel?.status === "approve"
                ) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="h-20 w-px bg-muted" />
            </div>

            <div className="flex flex-col gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-[150px]"
                    variant="outline"
                    disabled={
                      adviserAcceptanaceData === "" ||
                      adviserAcceptanaceData.status === "pending" ||
                      adviserAcceptanaceData.status === "reject" ||
                      userPanelApprovals[0]?.status === "pending" ||
                      userPanelApprovals[1]?.status === "pending" ||
                      userPanelApprovals[2]?.status === "pending" ||
                      userPanelApprovals[3]?.status === "pending" ||
                      userPanelApprovals[0]?.status === "approve" ||
                      userPanelApprovals[1]?.status === "approve" ||
                      userPanelApprovals[2]?.status === "approve" ||
                      userPanelApprovals[3]?.status === "approve"
                    }
                  >
                    Panel Approvals
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Find Panels</DialogTitle>
                    <DialogDescription>
                      Browse the list of available panel members and select 4 to
                      evaluate your thesis.
                    </DialogDescription>
                  </DialogHeader>

                  <Form method="POST" encType="multipart/form-data">
                    <Card>
                      <CardHeader>
                        <CardTitle>Panel Members</CardTitle>
                        <CardDescription>
                          Enter details of panel members for thesis evaluation.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-5">
                          <SearchableDropdown
                            label="Chairperson"
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
                        </div>

                        <div className="grid grid-cols-2 gap-5">
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
                        </div>
                        <input
                          name="proposalId"
                          type="hidden"
                          value={adviserAcceptanaceData?._id}
                        />
                        <input
                          name="faculty1"
                          type="hidden"
                          value={selectedFaculty1?.id}
                        />
                        <input
                          name="faculty2"
                          type="hidden"
                          value={selectedFaculty2?.id}
                        />
                        <input
                          name="faculty3"
                          type="hidden"
                          value={selectedFaculty3?.id}
                        />
                        <input
                          name="faculty4"
                          type="hidden"
                          value={selectedFaculty4?.id}
                        />

                        <div className="grid grid-cols-2 gap-5 mt-5">
                          <div className="flex flex-col gap-3">
                            <Label>Upload Proposed Title</Label>
                            <Input
                              className="bg-[#1b1b1b]"
                              type="text"
                              name="proposeTitle"
                              placeholder="Enter thesis proposed title"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <Label>Upload Initial Thesis</Label>
                            <Input
                              className="bg-[#1b1b1b]"
                              type="file"
                              name="file"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <DialogFooter>
                      <Button
                        name="transaction"
                        value={"panelApproval"}
                        type="submit"
                      >
                        Send Requests
                      </Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>

              {userPanelApprovals.length !== 0 && (
                <span className="text-sm italic">
                  Click view to see the status of panel approvals{" "}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span className="text-orange-500 cursor-pointer">
                        (View Status)
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Panel Proposals Update
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Check each panel's approval status.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="grid grid-cols-2 gap-4">
                        {Array.isArray(userPanelApprovals) &&
                          userPanelApprovals.map((val: any) => (
                            <Card
                              key={val._id}
                              className={`${
                                val.status == "reject" ? "bg-red-500" : ""
                              }`}
                            >
                              <CardHeader>
                                <CardTitle>{val.panelId.lastname}</CardTitle>
                                <CardDescription>
                                  {val.remarks || "No idicated remarks"}
                                </CardDescription>

                                <CardDescription className="flex items-center gap-2">
                                  {val.status == "pending" ? (
                                    <Button
                                      disabled
                                      className="bg-orange-500 h-[25px]"
                                    >
                                      Pending
                                    </Button>
                                  ) : val.status === "reject" ? (
                                    <Button disabled variant={"secondary"}>
                                      Rejected
                                    </Button>
                                  ) : (
                                    <Button
                                      className="h-[25px]"
                                      disabled
                                      variant={"secondary"}
                                    >
                                      Approved
                                    </Button>
                                  )}
                                  {val.status === "reject" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size={"icon"} variant="outline">
                                          <BsPersonFillDash />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[400px]">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Change Panel
                                          </DialogTitle>
                                          <DialogDescription>
                                            Browse the list of available panel
                                            members and select 4 to evaluate
                                            your thesis.
                                          </DialogDescription>
                                        </DialogHeader>

                                        <Form method="POST">
                                          <SearchableDropdown
                                            label="New Panel"
                                            value={selectedNewPanel} // Pass the entire object
                                            onValueChange={setSelectedNewPanel} // Ensure it updates correctly
                                            options={faculty}
                                          />

                                          <input
                                            name="newPanelId"
                                            type="hidden"
                                            value={selectedNewPanel?.id}
                                          />
                                          <input
                                            name="oldPanelId"
                                            type="hidden"
                                            value={val.panelId._id}
                                          />

                                          <input
                                            name="id"
                                            type="hidden"
                                            value={val._id}
                                          />

                                          <DialogFooter>
                                            <Button
                                              className="mt-4"
                                              name="transaction"
                                              value={"changePanel"}
                                              type="submit"
                                            >
                                              Change Panel
                                            </Button>
                                          </DialogFooter>
                                        </Form>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          ))}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </span>
              )}
            </div>
          </div>

          {/* Step 3: Generated Forms */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-1 ${
                  userPanelApprovals.length !== 0 &&
                  userPanelApprovals.every(
                    (panel: any) => panel?.status === "approve"
                  )
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }
                  `}
              >
                {userPanelApprovals.length !== 0 &&
                userPanelApprovals.every(
                  (panel: any) => panel?.status === "approve"
                ) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={
                      userPanelApprovals.length == 0 ||
                      userPanelApprovals.some(
                        (panel: any) =>
                          panel?.status === "pending" ||
                          panel?.status === "reject"
                      )
                    }
                  >
                    Download Forms
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Available Forms</DialogTitle>
                    <DialogDescription>
                      View and download system-generated thesis forms required
                      for submission.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Form list/download buttons go here */}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Download All</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-[#303030] ${
          userPanelApprovals.length == 0 ||
          userPanelApprovals.some(
            (panel: any) =>
              panel?.status === "pending" || panel?.status === "reject"
          )
            ? "pointer-events-none opacity-50"
            : ""
        }`}
      >
        <CardHeader>
          <CardTitle>Proposal Section</CardTitle>
          <CardDescription>
            Start your thesis journey by finding a new adviser and panels.
          </CardDescription>
        </CardHeader>

        <Form method="POST" encType="multipart/form-data">
          <CardContent>
            <Input type="hidden" name="userId" value={userData.id} />
            <div className="mt-5">
              <div className="flex flex-col gap-3">
                <Label>Upload Thesis File</Label>
                <Input
                  name="thesisFile"
                  className="bg-[#1b1b1b]"
                  type="file"
                  disabled={
                    (userPanelApprovals.length == 0 &&
                      userPanelApprovals.some(
                        (panel: any) =>
                          panel?.status === "pending" ||
                          panel?.status === "reject"
                      )) ||
                    userThesisModel.forScheduleStatus === "pending" ||
                    userThesisModel.forScheduleStatus === "approve"
                  }
                />
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Label>Upload Approval Files</Label>
                <Input
                  name="approvalFile"
                  className="bg-[#1b1b1b]"
                  type="file"
                  disabled={
                    (userPanelApprovals.length == 0 &&
                      userPanelApprovals.some(
                        (panel: any) =>
                          panel?.status === "pending" ||
                          panel?.status === "reject"
                      )) ||
                    userThesisModel.forScheduleStatus === "pending" ||
                    userThesisModel.forScheduleStatus === "approve"
                  }
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            {/* <Button disabled variant="secondary">
              Defended
            </Button> */}

            {userThesisModel.defended ? (
              <div className="flex flex-col gap-4">
                <Button variant={"secondary"} disabled>
                  Thesis Succesfully Defended
                </Button>
              </div>
            ) : userThesisModel.forScheduleStatus === "pending" ? (
              <Button variant={"secondary"} disabled>
                Request is pending
              </Button>
            ) : userThesisModel.forScheduleStatus === "approve" ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm opacity-40">
                  Request is approved, schedule for defense will be posted here
                </p>

                {(userThesisModel.panelApprovals[0].status === "approve" ||
                  userThesisModel.panelApprovals[1].status === "approve" ||
                  userThesisModel.panelApprovals[2].status === "approve" ||
                  userThesisModel.panelApprovals[3].status === "approve") && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm">
                      Date: {userThesisModel.schedule.date}
                    </p>
                    <p className="text-sm">
                      Time: {userThesisModel.schedule.time}
                    </p>
                    <p className="text-sm">
                      Venue: {userThesisModel.venue || "Not set"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Button
                type="submit"
                name="transaction"
                value={"addProposalRequest"}
                disabled={
                  userPanelApprovals.length == 0 &&
                  userPanelApprovals.some(
                    (panel: any) =>
                      panel?.status === "pending" || panel?.status === "reject"
                  )
                }
              >
                {navigation.state == "submitting"
                  ? "Loading..."
                  : "Send Request"}
              </Button>
            )}
          </CardFooter>
        </Form>
      </Card>

      <Card
        className={`dark:bg-[#303030] ${
          !userThesisModel.defended ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <CardHeader>
          <CardTitle>Final Section</CardTitle>
          <CardDescription>
            Start your thesis journey by finding new adviser and panels
          </CardDescription>
        </CardHeader>

        <Form method="POST" encType="multipart/form-data">
          <CardContent>
            <Input
              type="hidden"
              name="thesisId"
              value={userFinalThesisModel._id}
            />
            <div className="mt-5">
              <div className="flex flex-col gap-3">
                <Label>Upload Thesis File</Label>
                <Input
                  name="thesisFile"
                  className="bg-[#1b1b1b]"
                  type="file"
                  disabled={!userThesisModel.defended}
                />
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Label>Upload Approval Files</Label>
                <Input
                  name="approvalFile"
                  className="bg-[#1b1b1b]"
                  type="file"
                  disabled={!userThesisModel.defended}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            {/* <Button disabled variant="secondary">
              Defended
            </Button> */}

            {userFinalThesisModel.defended ? (
              <div className="flex flex-col gap-4">
                <Button variant={"secondary"} disabled>
                  Thesis Succesfully Defended
                </Button>
              </div>
            ) : userFinalThesisModel.forScheduleStatus === "pending" ? (
              <Button variant={"secondary"} disabled>
                Request is pending
              </Button>
            ) : userFinalThesisModel.forScheduleStatus === "approve" ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm opacity-40">
                  Request is approved, schedule for defense will be posted here
                </p>

                {(userFinalThesisModel.panelApprovals[0].status === "approve" ||
                  userFinalThesisModel.panelApprovals[1].status === "approve" ||
                  userFinalThesisModel.panelApprovals[2].status === "approve" ||
                  userFinalThesisModel.panelApprovals[3].status ===
                    "approve") && (
                  <div className="grid grid-cols-2 gap-3">
                    <p className="text-sm">
                      Date: {userFinalThesisModel.schedule.date}
                    </p>
                    <p className="text-sm">
                      Time: {userFinalThesisModel.schedule.date}
                    </p>
                    <p className="text-sm">
                      Venue: {userFinalThesisModel.venue || "Not set"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Button
                type="submit"
                name="transaction"
                value={"addFinalRequest"}
              >
                {navigation.state == "submitting"
                  ? "Loading..."
                  : "Send Request"}
              </Button>
            )}
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default ThesisSection;

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
