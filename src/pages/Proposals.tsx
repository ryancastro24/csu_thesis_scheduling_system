import { getAdviserAcceptanceRequests } from "@/backend_api/adviserAcceptance";
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
import { useLoaderData, Form, ActionFunction } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { approvedProposal } from "@/backend_api/adviserAcceptance";
export async function loader() {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);
  const adviserAcceptanaceData = await getAdviserAcceptanceRequests(
    userData.id
  );

  console.log("adviser acceptance data:", adviserAcceptanaceData);
  return { userData, adviserAcceptanaceData };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );
  // Pass the original FormData directly

  console.log(data);

  if (data.transaction === "approve") {
    const approvalProposalData = await approvedProposal(data.id, data);
    return approvalProposalData;
  }

  if (data.transaction === "reject") {
    const approvalProposalData = await approvedProposal(data.id, data);
    console.log("returned proposal status:", approvalProposalData);
    return approvalProposalData;
  }
};
const Proposals = () => {
  const { userData, adviserAcceptanaceData } = useLoaderData();
  return (
    <div className="grid grid-cols-3 gap-5">
      {adviserAcceptanaceData.map((val: any) => (
        <Card
          key={val._id}
          className={`${val.status == "approve" ? "dark:bg-[#303030]" : ""}`}
        >
          <CardHeader>
            <CardTitle>{val.proposeTitle}</CardTitle>
            <CardDescription>
              Authors: {val.student1Id?.lastname}, {val.student2Id?.lastname},
              {val.student3Id?.lastname}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <p className="text-sm">Download the file to view the content.</p>

            <a
              href={val.thesisFile}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-[150px]"
            >
              <Button
                className="w-full flex items-center gap-2"
                variant="secondary"
              >
                <FaEye /> View Content
              </Button>
            </a>
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
                      <AlertDialogTitle>Sure jud ka?</AlertDialogTitle>
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

export default Proposals;
