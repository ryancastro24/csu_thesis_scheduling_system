import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MdEditDocument } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { BsPersonFillDash } from "react-icons/bs";
import { FileText } from "lucide-react";
import { forms } from "@/lib/formsData";
import { FaUserEdit } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
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
import { Loader2 } from "lucide-react";
import { getStudents, getfaculty, getChairpersons } from "@/backend_api/users";
import { useLoaderData } from "react-router-dom";
import { Form, ActionFunction, useNavigation } from "react-router-dom";
import {
  addAdviserAcceptanceRequest,
  getUserAdviserAcceptanceRequest,
  changeAdviserRequest,
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
  const adviserAcceptanaceData: any[] = Array.isArray(
    await getUserAdviserAcceptanceRequest(userData.id),
  )
    ? await getUserAdviserAcceptanceRequest(userData.id)
    : [];

  const userThesisModel = await getUserThesisModel(userData.id);
  const userFinalThesisModel = await getUserFinalThesisModel(userData.id);
  const userPanelApprovals = await getUserPanelApprovals(userData.id);

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
    formData.entries(),
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
    const changePanelData = await changePanel(data.id, data.oldPanelId, data);

    return changePanelData;
  }

  if (data.transaction === "addProposalRequest") {
    const thesisDocument = await createThesisSchedule(formData);

    return thesisDocument;
  }

  if (data.transaction === "newAdviserApproval") {
    console.log("newAdviserApproval", data);

    const adviserChangeRequest = await changeAdviserRequest(
      data.id,
      data.newAdviser,
    );

    return adviserChangeRequest;
  }

  if (data.transaction === "newCoAdviserApproval") {
    const adviserChangeRequest = await changeAdviserRequest(
      data.id,
      data.newAdviser,
    );

    return adviserChangeRequest;
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
    chairpersons,
    adviserAcceptanaceData,
    userPanelApprovals,
    userData,
    userThesisModel,
    userFinalThesisModel,
  } = useLoaderData();
  const navigation = useNavigation();

  console.log("userThesisModel", userThesisModel);
  const thesisPanels = [...faculty, ...chairpersons];
  const [proposalTitle, setProposalTitle] = useState<string>("");
  const [adviserThesisFile, setAdviserThesisFile] = useState<File | null>(null);
  const [panelProposalTitle, setPanelProposalTitle] = useState<string>("");
  const [panelThesisFile, setPanelThesisFile] = useState<File | null>(null);

  const adviserRequest = adviserAcceptanaceData.find(
    (a: any) => a.role === "adviser",
  );

  const coAdviserRequest = adviserAcceptanaceData.find(
    (a: any) => a.role === "coAdviser",
  );

  const [selectedNewAdviser, setSelectedNewAdviser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedNewCoAdviser, setSelectedNewCoAdviser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedFaculty, setSelectedFaculty] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedCoFaculty, setSelectedCofaculty] = useState<{
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

  const selectedPanelIds = [
    selectedFaculty1?.id,
    selectedFaculty2?.id,
    selectedFaculty3?.id,
    selectedFaculty4?.id,
  ].filter(Boolean) as string[];

  const [selectedNewPanel, setSelectedNewPanel] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDownload = async (form: any) => {
    const response = await fetch(form.link);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title}.docx`; // 👈 Force custom file name
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const allPanelsApproved = userPanelApprovals.every(
    (panel: any) => panel?.status === "approve",
  );

  const allPanelsApprovedPending = userPanelApprovals.every(
    (panel: any) => panel?.status === "pending" || panel?.status === "reject",
  );
  const adviserApproved = adviserRequest?.status === "approve";
  // co-adviser is OPTIONAL
  const coAdviserApprovedOrNotRequired =
    !coAdviserRequest || coAdviserRequest.status === "approve";

  const coAdviserApproved =
    !coAdviserRequest || coAdviserRequest.status === "approve";

  const isApproved = adviserApproved && coAdviserApproved;

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
          <div className="flex items-start gap-4">
            {/* Status Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-1 ${
                  isApproved ? "bg-green-500" : "bg-primary"
                } text-white`}
              >
                {isApproved ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="h-20 w-px bg-muted" />
            </div>

            {/* Adviser / Co-Adviser Approval Section */}
            <div className="flex flex-col gap-4">
              {/* Adviser Approval Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-[150px]"
                    disabled={adviserRequest || coAdviserRequest}
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

                      <CardContent>
                        {/* Hidden Inputs */}
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
                        <input
                          name="coAdviser"
                          type="hidden"
                          value={selectedCoFaculty?.id || ""}
                        />

                        {/* Student Dropdowns */}
                        <div className="grid grid-cols-2 gap-5">
                          <SearchableDropdown
                            label="Student 1"
                            options={students}
                            value={selectedStudent1}
                            onValueChange={setSelectedStudent1}
                          />
                          <SearchableDropdown
                            label="Student 2"
                            options={students}
                            value={selectedStudent2}
                            onValueChange={setSelectedStudent2}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-5 mt-4">
                          <SearchableDropdown
                            label="Student 3"
                            options={students}
                            value={selectedStudent3}
                            onValueChange={setSelectedStudent3}
                          />
                          <SearchableDropdown
                            label="Adviser"
                            options={thesisPanels}
                            value={selectedFaculty}
                            onValueChange={setSelectedFaculty}
                            disabledIds={
                              [selectedCoFaculty?.id].filter(
                                Boolean,
                              ) as string[]
                            }
                          />

                          <SearchableDropdown
                            label="Co-Adviser (Optional)"
                            options={thesisPanels}
                            value={selectedCoFaculty}
                            onValueChange={setSelectedCofaculty}
                            disabledIds={
                              [selectedFaculty?.id].filter(Boolean) as string[]
                            }
                          />
                        </div>

                        {/* Proposed Title & Thesis File */}
                        <div className="grid grid-cols-2 gap-5 mt-5">
                          <div className="flex flex-col gap-3">
                            <Label>Upload Proposed Title</Label>
                            <Input
                              type="text"
                              name="proposeTitle"
                              value={proposalTitle}
                              onChange={(e) => setProposalTitle(e.target.value)}
                              placeholder="Enter thesis proposed title"
                              className="dark:bg-[#1b1b1b] dark:text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-3">
                            <Label>Upload Thesis Initial Manuscript</Label>
                            <Input
                              type="file"
                              name="file"
                              accept=".pdf,.doc,.docx"
                              className="dark:bg-[#1b1b1b]"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
                                setAdviserThesisFile(
                                  e.target.files?.[0] || null,
                                )
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <DialogFooter>
                      <Button
                        type="submit"
                        name="transaction"
                        value="adviserApproval"
                        disabled={
                          navigation.state === "submitting" ||
                          !selectedStudent1 ||
                          !proposalTitle ||
                          !selectedFaculty ||
                          !adviserThesisFile
                        }
                      >
                        {navigation.state === "submitting" ? (
                          <>
                            <Loader2 className="animate-spin mr-2" />
                            Please wait
                          </>
                        ) : (
                          "Request for approval"
                        )}
                      </Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Adviser Status */}
              {adviserRequest && (
                <span className="text-sm italic flex items-center gap-1">
                  Adviser request
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span className="cursor-pointer text-xs text-orange-500">
                        <FaCircleInfo />
                      </span>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <Form method="POST">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Request details</AlertDialogTitle>

                          <AlertDialogDescription>
                            <div className="flex flex-col gap-2">
                              <span>
                                Adviser: {adviserRequest.adviserId.firstname}{" "}
                                {adviserRequest.adviserId.lastname}{" "}
                                {adviserRequest.adviserId.suffix}
                              </span>

                              <span>
                                Status:{" "}
                                {adviserRequest?.status === "approve"
                                  ? "Approved"
                                  : "Pending"}
                              </span>
                              {adviserRequest?.status === "reject" && (
                                <div className="flex flex-col gap-2">
                                  <span>
                                    Reason: <strong>Declined</strong>
                                  </span>

                                  <input
                                    name="id"
                                    type="hidden"
                                    value={adviserRequest?._id}
                                  />
                                  <input
                                    name="newAdviser"
                                    type="hidden"
                                    value={selectedNewAdviser?.id}
                                  />

                                  <SearchableDropdown
                                    label="Select New Adviser"
                                    options={thesisPanels}
                                    value={selectedNewAdviser}
                                    onValueChange={setSelectedNewAdviser}
                                  />
                                </div>
                              )}
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center gap-2">
                          {adviserRequest?.status === "reject" && (
                            <Button
                              type="submit"
                              name="transaction"
                              value="newAdviserApproval"
                              disabled={navigation.state === "submitting"}
                            >
                              {navigation.state === "submitting" ? (
                                <>
                                  <Loader2 className="animate-spin mr-2" />
                                  Please wait
                                </>
                              ) : (
                                "Request for approval"
                              )}
                            </Button>
                          )}

                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </Form>
                    </AlertDialogContent>
                  </AlertDialog>
                </span>
              )}

              {coAdviserRequest && (
                <span className="text-sm italic flex items-center gap-1">
                  CoAdviser request
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span className="cursor-pointer text-xs text-orange-500">
                        <FaCircleInfo />
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <Form method="POST">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Request details</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="flex flex-col gap-2">
                              <span>
                                Adviser: {coAdviserRequest.adviserId.firstname}{" "}
                                {coAdviserRequest.adviserId.lastname}{" "}
                                {coAdviserRequest.adviserId.suffix}
                              </span>

                              <span>
                                Status:{" "}
                                {coAdviserRequest?.status === "approve"
                                  ? "Approved"
                                  : "Pending"}
                              </span>
                              {coAdviserRequest?.status === "reject" && (
                                <div className="flex flex-col gap-2">
                                  <span>
                                    Reason: <strong>Declined</strong>
                                  </span>

                                  <input
                                    name="id"
                                    type="hidden"
                                    value={coAdviserRequest?._id}
                                  />
                                  <input
                                    name="newAdviser"
                                    type="hidden"
                                    value={selectedNewCoAdviser?.id}
                                  />

                                  <SearchableDropdown
                                    label="Select New Co Adviser"
                                    options={thesisPanels}
                                    value={selectedNewCoAdviser}
                                    onValueChange={setSelectedNewCoAdviser}
                                  />
                                </div>
                              )}
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          {coAdviserRequest?.status === "reject" && (
                            <Button
                              type="submit"
                              name="transaction"
                              value="newCoAdviserApproval"
                              disabled={navigation.state === "submitting"}
                            >
                              {navigation.state === "submitting" ? (
                                <>
                                  <Loader2 className="animate-spin mr-2" />
                                  Please wait
                                </>
                              ) : (
                                "Request for approval"
                              )}
                            </Button>
                          )}
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </Form>
                    </AlertDialogContent>
                  </AlertDialog>
                </span>
              )}
            </div>
          </div>

          {/* Step 2: Panel Approval */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-1 ${
                  adviserApproved &&
                  allPanelsApproved &&
                  userThesisModel.panelApprovals.length === 4 &&
                  coAdviserApprovedOrNotRequired
                    ? "bg-green-500 text-white"
                    : adviserApproved ||
                        (coAdviserRequest?.status === "approve" &&
                          allPanelsApprovedPending)
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {userPanelApprovals.length !== 0 &&
                userPanelApprovals.every(
                  (panel: any) => panel?.status === "approve",
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
                      adviserRequest?.status !== "approve" ||
                      (coAdviserRequest &&
                        coAdviserRequest.status !== "approve") ||
                      adviserRequest === null ||
                      coAdviserRequest === null ||
                      adviserAcceptanaceData?.status === "reject" ||
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
                            label="Panel Chairperson"
                            options={thesisPanels}
                            value={selectedFaculty1}
                            onValueChange={setSelectedFaculty1}
                            disabledIds={[
                              userThesisModel?.adviser,
                              userThesisModel?.coAdviser,
                              ...selectedPanelIds.filter(
                                (id) => id !== selectedFaculty1?.id,
                              ),
                            ]}
                          />

                          <SearchableDropdown
                            label="Panel Member"
                            value={selectedFaculty2} // Pass the entire object
                            onValueChange={setSelectedFaculty2} // Ensure it updates correctly
                            options={thesisPanels}
                            disabledIds={[
                              userThesisModel?.adviser,
                              userThesisModel?.coAdviser,
                              ...selectedPanelIds.filter(
                                (id) => id !== selectedFaculty2?.id,
                              ),
                            ]}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <SearchableDropdown
                            label="Panel Member"
                            value={selectedFaculty3} // Pass the entire object
                            onValueChange={setSelectedFaculty3} // Ensure it updates correctly
                            options={thesisPanels}
                            disabledIds={[
                              userThesisModel?.adviser,
                              userThesisModel?.coAdviser,
                              ...selectedPanelIds.filter(
                                (id) => id !== selectedFaculty3?.id,
                              ),
                            ]}
                          />

                          <SearchableDropdown
                            label="Secretary"
                            value={selectedFaculty4} // Pass the entire object
                            onValueChange={setSelectedFaculty4} // Ensure it updates correctly
                            options={thesisPanels}
                            disabledIds={[
                              userThesisModel?.adviser,
                              userThesisModel?.coAdviser,
                              ...selectedPanelIds.filter(
                                (id) => id !== selectedFaculty4?.id,
                              ),
                            ]}
                          />
                        </div>
                        <input
                          name="proposalId"
                          type="hidden"
                          value={adviserRequest?._id}
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
                              value={panelProposalTitle}
                              onChange={(e) =>
                                setPanelProposalTitle(e.target.value)
                              }
                              className="dark:bg-[#1b1b1b] dark:text-white"
                              type="text"
                              name="proposeTitle"
                              placeholder="Enter thesis proposed title"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <Label>Upload Initial Thesis</Label>
                            <Input
                              type="file"
                              name="file"
                              accept="application/pdf"
                              className="dark:bg-[#1b1b1b]"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
                                setPanelThesisFile(e.target.files?.[0] || null)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <DialogFooter>
                      <Button
                        disabled={
                          navigation.state === "submitting" ||
                          selectedFaculty1 === null ||
                          selectedFaculty2 === null ||
                          selectedFaculty3 === null ||
                          selectedFaculty4 === null ||
                          panelProposalTitle === "" ||
                          panelThesisFile === null
                        }
                        name="transaction"
                        value={"panelApproval"}
                        type="submit"
                        className="mt-4"
                      >
                        {navigation.state === "submitting" ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Please wait
                          </>
                        ) : (
                          "Request for approvals"
                        )}
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
                                val?.status == "reject" ? "bg-red-500" : ""
                              }`}
                            >
                              <CardHeader>
                                <CardTitle>
                                  {val.panelId.firstname} {val.panelId.lastname}
                                </CardTitle>
                                <CardDescription>
                                  {val?.remarks || "No idicated remarks"}
                                </CardDescription>

                                <CardDescription className="flex items-center gap-2">
                                  {val?.status == "pending" ? (
                                    <Button
                                      disabled
                                      className="bg-orange-500 h-[25px]"
                                    >
                                      Pending
                                    </Button>
                                  ) : val?.status === "reject" ? (
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
                                  {val?.status === "reject" && (
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
                        <AlertDialogCancel>Close</AlertDialogCancel>
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
                    (panel: any) => panel?.status === "approve",
                  )
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }
                    `}
              >
                {userPanelApprovals.length !== 0 &&
                userPanelApprovals.every(
                  (panel: any) => panel?.status === "approve",
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
                          panel?.status === "reject",
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
                  <div className="grid gap-3 py-4">
                    {forms.map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{form.title}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(form)}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
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
              panel?.status === "pending" || panel?.status === "reject",
          )
            ? "pointer-events-none opacity-50"
            : ""
        }`}
      >
        <CardHeader>
          <CardTitle>Capstone Proposal Defense</CardTitle>
          <CardDescription>
            Start your thesis journey by finding a new adviser and panels.
          </CardDescription>
        </CardHeader>

        <Form method="POST" encType="multipart/form-data">
          <CardContent>
            <Input type="hidden" name="userId" value={userData.id} />
            <div className="mt-5">
              <div className="flex flex-col gap-3">
                <Label> Upload Thesis Manuscript </Label>
                <Input
                  name="thesisFile"
                  type="file"
                  accept="application/pdf"
                  className="dark:bg-[#1b1b1b]"
                  disabled={
                    (userPanelApprovals.length === 0 &&
                      userPanelApprovals.some(
                        (panel: any) =>
                          panel?.status === "pending" ||
                          panel?.status === "reject",
                      )) ||
                    userThesisModel.forScheduleStatus === "pending" ||
                    userThesisModel.forScheduleStatus === "approve"
                  }
                />
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Label className="flex items-center gap-2">
                  {" "}
                  <span> Upload Thesis Forms</span>{" "}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span className="cursor-pointer text-xs text-orange-500">
                        <FaCircleInfo />
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>REMINDERS!</AlertDialogTitle>
                        <AlertDialogDescription>
                          <h2>Please upload the following forms</h2>
                          <p>Form 2A and Form 2B</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Label>
                <Input
                  name="approvalFile"
                  className="dark:bg-[#1b1b1b]"
                  accept="application/pdf"
                  type="file"
                  disabled={
                    (userPanelApprovals.length == 0 &&
                      userPanelApprovals.some(
                        (panel: any) =>
                          panel?.status === "pending" ||
                          panel?.status === "reject",
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
                <span
                  className={` rounded p-2 font-[Poppins] text-sm ${
                    userThesisModel.thesisFinalStatus === "defended"
                      ? "bg-green-500 text-white"
                      : userThesisModel.thesisFinalStatus === "minor revision"
                        ? "bg-yellow-500 text-black"
                        : userThesisModel.thesisFinalStatus === "major revision"
                          ? "bg-orange-500 text-white"
                          : ""
                  }}`}
                >
                  {userThesisModel.thesisFinalStatus === "defended"
                    ? "Thesis Successfully Defended"
                    : userThesisModel.thesisFinalStatus === "minor revision"
                      ? "Defended with Minor Revision"
                      : userThesisModel.thesisFinalStatus === "major revision"
                        ? "Defended with Major Revision"
                        : ""}
                </span>
              </div>
            ) : userThesisModel.forScheduleStatus === "pending" ? (
              <span className="rounded p-2   font-[Poppins] text-sm">
                Request is pending
              </span>
            ) : userThesisModel.forScheduleStatus === "approve" ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm opacity-40">
                  Request is approved, schedule for defense will be posted here
                </p>

                {userThesisModel.panelApprovals[0]?.status === "approve" &&
                  userThesisModel.panelApprovals[1]?.status === "approve" &&
                  userThesisModel.panelApprovals[2]?.status === "approve" &&
                  userThesisModel.panelApprovals[3]?.status === "approve" && (
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
                      panel?.status === "pending" || panel?.status === "reject",
                  )
                }
              >
                {navigation.state == "submitting"
                  ? "Loading..."
                  : "Send Request"}
              </Button>
            )}

            {!userThesisModel.defended && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size={"icon"} variant={"outline"}>
                    <MdEditDocument />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Panel Proposals Update</AlertDialogTitle>
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
                            val?.status == "reject" ? "bg-red-500" : ""
                          }`}
                        >
                          <CardHeader>
                            <CardTitle>
                              {val.panelId.firstname} {val.panelId.lastname}
                            </CardTitle>

                            <CardDescription className="flex items-center gap-2">
                              {val?.status == "pending" ? (
                                <Button
                                  disabled
                                  className="bg-orange-500 h-[25px]"
                                >
                                  Pending
                                </Button>
                              ) : val?.status === "reject" ? (
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
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size={"icon"} variant="secondary">
                                    <FaUserEdit />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px]">
                                  <DialogHeader>
                                    <DialogTitle>Change Panel</DialogTitle>
                                    <DialogDescription>
                                      Browse the list of available panel members
                                      and select 4 to evaluate your thesis.
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
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Form>
      </Card>

      {/*  */}
      {/*  */}

      {/* final defense section */}

      <Card
        className={`dark:bg-[#303030] ${
          !userThesisModel.defended ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <CardHeader>
          <CardTitle>Thesis Final Defense</CardTitle>
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
                <Label>Upload Thesis Manuscript</Label>
                <Input
                  name="thesisFile"
                  accept="application/pdf"
                  className="dark:bg-[#1b1b1b]"
                  type="file"
                  disabled={
                    !userThesisModel.defended ||
                    userFinalThesisModel.forScheduleStatus === "pending" ||
                    userFinalThesisModel.forScheduleStatus === "approve"
                  }
                />
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Label className="flex items-center gap-2">
                  {" "}
                  <span> Upload Thesis Forms</span>{" "}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span className="cursor-pointer text-xs text-orange-500">
                        <FaCircleInfo />
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>REMINDERS!</AlertDialogTitle>
                        <AlertDialogDescription>
                          <h2>Please upload the following forms</h2>
                          <p>
                            Form 2A, Form 2B, Form 2C, Form 2D,Form 2E ,Form 2F,
                            Form 2G, Form 2H and Form 2I
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Label>
                <Input
                  name="approvalFile"
                  accept="application/pdf"
                  className="dark:bg-[#1b1b1b]"
                  type="file"
                  disabled={
                    !userThesisModel.defended ||
                    userFinalThesisModel.forScheduleStatus === "pending" ||
                    userFinalThesisModel.forScheduleStatus === "approve"
                  }
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
                <span
                  className={` rounded p-2 font-[Poppins] text-sm ${
                    userFinalThesisModel.thesisFinalStatus === "defended"
                      ? "bg-green-500 text-white"
                      : userFinalThesisModel.thesisFinalStatus ===
                          "minor revision"
                        ? "bg-yellow-500 text-black"
                        : userFinalThesisModel.thesisFinalStatus ===
                            "major revision"
                          ? "bg-orange-500 text-white"
                          : ""
                  }}`}
                >
                  {userFinalThesisModel.thesisFinalStatus === "defended"
                    ? "Thesis Successfully Defended"
                    : userFinalThesisModel.thesisFinalStatus ===
                        "minor revision"
                      ? "Defended with Minor Revision"
                      : userFinalThesisModel.thesisFinalStatus ===
                          "major revision"
                        ? "Defended with Major Revision"
                        : ""}
                </span>
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

                {userFinalThesisModel.panelApprovals[0]?.status === "approve" &&
                  userFinalThesisModel.panelApprovals[1]?.status ===
                    "approve" &&
                  userFinalThesisModel.panelApprovals[2]?.status ===
                    "approve" &&
                  userFinalThesisModel.panelApprovals[3]?.status ===
                    "approve" && (
                    <div className="grid grid-cols-2 gap-3">
                      <p className="text-sm">
                        Date: {userFinalThesisModel.schedule.date}
                      </p>
                      <p className="text-sm">
                        Time: {userFinalThesisModel.schedule.time}
                      </p>
                      <p className="text-sm">
                        Venue: {userFinalThesisModel.venue || "Not set"}
                      </p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  type="submit"
                  name="transaction"
                  value={"addFinalRequest"}
                >
                  {navigation.state == "submitting"
                    ? "Loading..."
                    : "Send Request"}
                </Button>

                {!userFinalThesisModel.defended && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size={"icon"} variant={"outline"}>
                        <MdEditDocument />
                      </Button>
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
                                val?.status == "reject" ? "bg-red-500" : ""
                              }`}
                            >
                              <CardHeader>
                                <CardTitle>
                                  {val.panelId.firstname}
                                  {val.panelId.lastname}
                                </CardTitle>

                                <CardDescription className="flex items-center gap-2">
                                  {val?.status == "pending" ? (
                                    <Button
                                      disabled
                                      className="bg-orange-500 h-[25px]"
                                    >
                                      Pending
                                    </Button>
                                  ) : val?.status === "reject" ? (
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
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size={"icon"} variant="secondary">
                                        <FaUserEdit />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[400px]">
                                      <DialogHeader>
                                        <DialogTitle>Change Panel</DialogTitle>
                                        <DialogDescription>
                                          Browse the list of available panel
                                          members and select 4 to evaluate your
                                          thesis.
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
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          ))}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
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

  value: { id: string; name: string } | null;
  onValueChange: (value: { id: string; name: string } | null) => void;

  disabledIds?: string[]; // 👈 NEW
}

function SearchableDropdown({
  label,
  options,
  value,
  onValueChange,
  disabledIds = [],
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Label>{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {value ? value.name : `Select ${label}`}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}`} />
            <CommandList>
              <CommandGroup>
                {/* NONE OPTION */}
                <CommandItem
                  onSelect={() => {
                    onValueChange(null);
                    setOpen(false);
                  }}
                  className="cursor-pointer text-muted-foreground"
                >
                  None
                </CommandItem>

                {options.map((option) => {
                  const fullName = `${option.firstname} ${
                    option.middlename ? option.middlename[0] + "." : ""
                  } ${option.lastname} ${option.suffix ?? ""}`.trim();

                  const isDisabled = disabledIds.includes(option._id);

                  return (
                    <CommandItem
                      key={option._id}
                      disabled={isDisabled}
                      onSelect={() => {
                        if (isDisabled) return;
                        onValueChange({
                          id: option._id,
                          name: fullName,
                        });
                        setOpen(false);
                      }}
                      className={`cursor-pointer ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {fullName}
                      {isDisabled && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          Selected
                        </span>
                      )}
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
