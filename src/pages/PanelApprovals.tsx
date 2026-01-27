import { getPanelApprovals, panelApproval } from "@/backend_api/panelApproval";
import {
  useLoaderData,
  Form,
  ActionFunction,
  useNavigate,
} from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Loader to fetch panel approvals
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const panelApprovals = await getPanelApprovals(userData.id);
  return { userData, panelApprovals };
};

// Action to handle approval/rejection submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries(),
  );
  console.log("submitted data:", data);
  const panelApprovalData = await panelApproval(data.id, data);

  console.log(panelApprovalData);
  return panelApprovalData;
};

const PanelApprovals = () => {
  const { panelApprovals } = useLoaderData();
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("all");

  // Sort approvals: "pending" first
  const sortedApprovals = [...panelApprovals].sort((a: any, b: any) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return 0;
  });

  // Filter based on role
  const filteredApprovals = sortedApprovals.filter((val: any) => {
    if (roleFilter === "all") return true;
    if (roleFilter === "panelChairperson")
      return val.role === "panelChairperson";
    if (roleFilter === "oralSecretary") return val.role === "oralSecretary";
    if (roleFilter === "panel") return val.role === "panel";
    return true;
  });

  return (
    <div>
      {/* Role Filter Buttons */}
      <div className="flex gap-4 mb-5">
        <Button
          variant={roleFilter === "all" ? "default" : "outline"}
          onClick={() => setRoleFilter("all")}
        >
          All
        </Button>
        <Button
          variant={roleFilter === "panelChairperson" ? "default" : "outline"}
          onClick={() => setRoleFilter("panelChairperson")}
        >
          Chairperson
        </Button>
        <Button
          variant={roleFilter === "oralSecretary" ? "default" : "outline"}
          onClick={() => setRoleFilter("oralSecretary")}
        >
          Oral Secretary
        </Button>
        <Button
          variant={roleFilter === "panel" ? "default" : "outline"}
          onClick={() => setRoleFilter("panel")}
        >
          Panel Member
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-10">
        {filteredApprovals.map((val: any) => (
          <Card
            key={val._id}
            className={`${val.status === "approve" ? "dark:bg-[#303030]" : ""}`}
          >
            <CardHeader>
              <CardTitle>{val.proposalId?.proposeTitle}</CardTitle>
              <CardDescription>
                Authors: {val.proposalId?.student1Id?.lastname},{" "}
                {val.proposalId?.student2Id?.lastname},{" "}
                {val.proposalId?.student3Id?.lastname}
              </CardDescription>
              <CardDescription>
                Role:{" "}
                {val?.role === "panelChairperson"
                  ? "Panel Chairperson"
                  : val?.role === "oralSecretary"
                    ? "Oral Secretary"
                    : val?.role === "panel"
                      ? "Panel Member"
                      : "None"}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <p className="text-sm">Download the file to view the content.</p>

              <Button
                onClick={() =>
                  navigate(`/dashboard/view`, {
                    state: {
                      thesisFile: val.thesisFile,
                      title: val.proposalId.proposeTitle,
                      student1: val.proposalId.student1Id,
                      student2: val.proposalId.student2Id,
                      student3: val.proposalId.student3Id,
                    },
                  })
                }
                className="w-full flex items-center gap-2"
                variant="secondary"
              >
                <FaEye /> View Content
              </Button>
            </CardContent>

            <CardFooter>
              {val.status === "approve" ? (
                <Button disabled variant={"secondary"}>
                  Proposal Approved
                </Button>
              ) : (
                <div className="flex items-center gap-5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Reject</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject request</AlertDialogTitle>
                        <AlertDialogDescription>
                          Please type in the reason why you reject this proposal
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <Form method="PUT">
                        <Textarea
                          name="remarks"
                          placeholder="Type your message here."
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <Input type="hidden" value={"reject"} name="status" />
                          <Input
                            type="hidden"
                            value={"reject"}
                            name="transaction"
                          />
                          <Input type="hidden" value={val._id} name="id" />
                          <AlertDialogAction
                            name="transaction"
                            type="submit"
                            value={"reject"}
                          >
                            Reject Proposal
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </Form>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Form method="PUT">
                    <Input type="hidden" value={"approve"} name="status" />
                    <Input type="hidden" value={val._id} name="id" />
                    <Button
                      name="transaction"
                      value={"approve"}
                      className="bg-green-500 cursor-pointer hover:bg-green-600"
                    >
                      Approve
                    </Button>
                  </Form>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PanelApprovals;
