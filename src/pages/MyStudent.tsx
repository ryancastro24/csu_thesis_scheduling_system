import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FcCancel } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  useLoaderData,
  Form,
  ActionFunction,
  useNavigation,
} from "react-router-dom";

import {
  getUserApprovedThesisDocuments,
  updateThesisDocument,
} from "@/backend_api/thesisDocument";

/* =======================
   LOADER
======================= */
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const approvedThesisDocuments = await getUserApprovedThesisDocuments(
    userData.id,
  );

  return { userData, approvedThesisDocuments };
};

/* =======================
   ACTION
======================= */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries(),
  );

  const { thesisId, panelId, status, remarks } = data;

  return await updateThesisDocument(thesisId, panelId, {
    status,
    remarks,
  });
};

const ITEMS_PER_PAGE = 6;

/* =======================
   COMPONENT
======================= */
const MyStudent: React.FC = () => {
  const { approvedThesisDocuments, userData }: any = useLoaderData();
  const navigation = useNavigation();

  const [remarks, setRemarks] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<
    "all" | "proposal" | "final"
  >("all");

  /* =======================
     FILTER + PAGINATION
  ======================= */
  const filteredData =
    selectedType === "all"
      ? approvedThesisDocuments
      : approvedThesisDocuments.filter(
          (item: any) => item.type === selectedType,
        );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full h-full p-4 space-y-6">
      {/* =======================
         FILTER BUTTONS
      ======================= */}
      <div className="flex gap-2">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          onClick={() => {
            setSelectedType("all");
            setCurrentPage(1);
          }}
        >
          All
        </Button>

        <Button
          variant={selectedType === "proposal" ? "default" : "outline"}
          onClick={() => {
            setSelectedType("proposal");
            setCurrentPage(1);
          }}
        >
          Proposal
        </Button>

        <Button
          variant={selectedType === "final" ? "default" : "outline"}
          onClick={() => {
            setSelectedType("final");
            setCurrentPage(1);
          }}
        >
          Final
        </Button>
      </div>

      {/* =======================
         THESIS CARDS
      ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map((val: any) => (
          <Card key={val._id} className="dark:bg-[#303030] bg-slate-100">
            <CardHeader>
              <CardTitle>{val.thesisTitle}</CardTitle>
              <CardDescription>
                Type: {val.type} | Status: {val.status}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Authors:{" "}
                <span className="font-bold">
                  {val?.students
                    ?.map((student: any) => student.lastname)
                    .join(", ")}
                </span>
              </p>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              {val.defended === "defended" ? (
                <Button disabled variant="secondary">
                  Thesis Defended
                </Button>
              ) : (
                <>
                  <p
                    className={`rounded py-2 px-3 text-sm ${
                      val.status === "approved"
                        ? "bg-green-400 dark:bg-green-700"
                        : val.status === "pending"
                          ? "bg-orange-400 dark:bg-orange-700"
                          : "bg-red-500 dark:bg-red-700"
                    }`}
                  >
                    {val.schedule?.date
                      ? val.status === "rejected"
                        ? "For Reschedule"
                        : `Schedule Date: ${val.schedule.date}`
                      : "No Schedule Available"}
                  </p>

                  {/* =======================
                     RESCHEDULE DIALOG
                  ======================= */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <FcCancel />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Reschedule Thesis</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rescheduling the thesis.
                        </DialogDescription>
                      </DialogHeader>

                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full h-24 p-2 border rounded"
                        placeholder="Enter your reason here..."
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Form method="post">
                          <input
                            type="hidden"
                            name="panelId"
                            value={userData.id}
                          />
                          <input
                            type="hidden"
                            name="thesisId"
                            value={val._id}
                          />
                          <input type="hidden" name="status" value="rejected" />
                          <input type="hidden" name="remarks" value={remarks} />

                          <Button
                            type="submit"
                            variant="destructive"
                            disabled={navigation.state === "submitting"}
                          >
                            {navigation.state === "submitting" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              "Reschedule"
                            )}
                          </Button>
                        </Form>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* =======================
         PAGINATION
      ======================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyStudent;
