import { useState } from "react";
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
import {
  useLoaderData,
  Form,
  ActionFunction,
  useNavigate,
} from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { approvedProposal } from "@/backend_api/adviserAcceptance";

/* ---------------- LOADER ---------------- */
export async function loader() {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const adviserAcceptanaceData = await getAdviserAcceptanceRequests(
    userData.id,
  );

  return { adviserAcceptanaceData };
}

/* ---------------- ACTION ---------------- */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries(),
  );

  if (data.transaction === "approve" || data.transaction === "reject") {
    return await approvedProposal(data.id, data);
  }
};

/* ---------------- COMPONENT ---------------- */
const Proposals = () => {
  const { adviserAcceptanaceData } = useLoaderData() as any;
  const navigate = useNavigate();

  const [roleFilter, setRoleFilter] = useState<"all" | "adviser" | "coAdviser">(
    "all",
  );

  /* -------- FILTER + SORT -------- */
  const filteredAndSortedData = adviserAcceptanaceData
    .filter((item: any) => {
      if (roleFilter === "all") return true;
      return item.role === roleFilter; // adviser | coAdviser
    })
    .sort((a: any, b: any) => {
      // pending always first
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return 0;
    });

  /* -------- STATUS BADGE STYLE -------- */
  const statusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-black";
      case "approve":
        return "bg-green-500 text-white";
      case "reject":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <>
      {/* -------- FILTER BUTTONS -------- */}
      <div className="flex gap-3 mb-5">
        <Button
          variant={roleFilter === "all" ? "default" : "secondary"}
          onClick={() => setRoleFilter("all")}
        >
          All
        </Button>

        <Button
          variant={roleFilter === "adviser" ? "default" : "secondary"}
          onClick={() => setRoleFilter("adviser")}
        >
          Adviser
        </Button>

        <Button
          variant={roleFilter === "coAdviser" ? "default" : "secondary"}
          onClick={() => setRoleFilter("coAdviser")}
        >
          Co-Adviser
        </Button>
      </div>

      {/* -------- CARDS -------- */}
      <div className="grid grid-cols-3 gap-5">
        {filteredAndSortedData.map((val: any) => (
          <Card
            key={val._id}
            className={val.status === "approve" ? "dark:bg-[#303030]" : ""}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{val.proposeTitle}</CardTitle>

                {/* STATUS BADGE */}
                <span
                  className={`text-xs px-2 py-1 rounded ${statusStyle(
                    val.status,
                  )}`}
                >
                  {val.status.toUpperCase()}
                </span>
              </div>

              <CardDescription>
                Authors: {val.student1Id?.lastname}, {val.student2Id?.lastname},{" "}
                {val.student3Id?.lastname}
              </CardDescription>

              <CardDescription>
                Role:{" "}
                <span className="font-semibold capitalize">{val.role}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <p className="text-sm">Download the file to view the content.</p>

              <Button
                onClick={() =>
                  navigate(`/dashboard/view`, {
                    state: {
                      thesisFile: val.thesisFile,
                      title: val.proposeTitle,
                      student1: val.student1Id,
                      student2: val.student2Id,
                      student3: val.student3Id,
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
                <Button disabled variant="secondary">
                  Proposal Approved
                </Button>
              ) : (
                <div className="flex gap-5">
                  {/* -------- REJECT -------- */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Reject</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Thesis rejected</AlertDialogTitle>
                        <AlertDialogDescription>
                          Please provide the reason for rejection.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <Form method="PUT">
                        <Textarea
                          name="remarks"
                          placeholder="Type your message here."
                        />

                        <Input type="hidden" name="status" value="reject" />
                        <Input
                          type="hidden"
                          name="transaction"
                          value="reject"
                        />
                        <Input type="hidden" name="id" value={val._id} />

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction type="submit">
                            Reject Proposal
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </Form>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* -------- APPROVE -------- */}
                  <Form method="PUT">
                    <Input type="hidden" name="status" value="approve" />
                    <Input type="hidden" name="id" value={val._id} />

                    <Button
                      name="transaction"
                      value="approve"
                      className="bg-green-500 hover:bg-green-600"
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
    </>
  );
};

export default Proposals;
