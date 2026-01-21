import { getPanelApprovals } from "@/backend_api/panelApproval";
import { useLoaderData } from "react-router-dom";
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
import { Form, ActionFunction, useNavigate } from "react-router-dom";
import { panelApproval } from "@/backend_api/panelApproval";
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const panelApprovals = await getPanelApprovals(userData.id);
  return { userData, panelApprovals };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );
  console.log("submitted data:", data);
  const panelApprovalData = await panelApproval(data.id, data);

  console.log(panelApprovalData);
  return panelApprovalData;
};

const PanelApprovals = () => {
  const { panelApprovals } = useLoaderData();

  console.log("panel approvals data:", panelApprovals);
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-3 gap-10">
      {panelApprovals.map((val: any) => (
        <Card
          key={val._id}
          className={`${val.status == "approve" ? "dark:bg-[#303030]" : ""}`}
        >
          <CardHeader>
            <CardTitle>{val.proposalId?.proposeTitle}</CardTitle>
            <CardDescription>
              Authors: {val.proposalId?.student1Id?.lastname},{" "}
              {val.proposalId?.student2Id?.lastname},
              {val.proposalId?.student3Id?.lastname}
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
            {val.status == "approve" ? (
              <Button disabled variant={"secondary"}>
                Proposal Approved
              </Button>
            ) : (
              <div className="flex items-center  gap-5">
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
                    Approved
                  </Button>
                </Form>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PanelApprovals;
