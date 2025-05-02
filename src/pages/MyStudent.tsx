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
import { updateThesisDocument } from "@/backend_api/thesisDocument";

import { getUserApprovedThesisDocuments } from "@/backend_api/thesisDocument";
import {
  useLoaderData,
  Form,
  ActionFunction,
  useNavigation,
} from "react-router-dom";
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);
  const approvedThesisDocuments = await getUserApprovedThesisDocuments(
    userData.id
  );
  return { userData, approvedThesisDocuments };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  const { thesisId, panelId, status, remarks } = data;

  const updatedThesis = await updateThesisDocument(thesisId, panelId, {
    status,
    remarks,
  });

  console.log("updatedThesis:", updatedThesis);
  return updatedThesis;
};

const ITEMS_PER_PAGE = 6;

const MyStudent: React.FC = () => {
  const { approvedThesisDocuments, userData } = useLoaderData();
  const navigation = useNavigation();

  const [remarks, setRemarks] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(approvedThesisDocuments.length / ITEMS_PER_PAGE);
  const paginatedData = approvedThesisDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full h-full p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map((val: any) => (
          <div key={val._id} className="relative">
            <Card className="dark:bg-[#303030] bg-slate-100 group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2"></div>
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
                      .map((student: any) => student.lastname)
                      .join(", ")}
                  </span>
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                {val.defended ? (
                  <Button disabled variant={"secondary"}>
                    Thesis Defended
                  </Button>
                ) : (
                  <>
                    <p
                      className={`${
                        val.status === "approved"
                          ? "bg-green-400 dark:bg-green-700"
                          : val.status === "pending"
                          ? "bg-orange-400 dark:bg-orange-700"
                          : "bg-red-500 dark:bg-red-700"
                      } rounded py-2 px-3`}
                    >
                      {val.schedule?.date
                        ? val.status === "rejected"
                          ? "For Reschedule"
                          : `Schedule Date: ${val.schedule.date}`
                        : "No Schedule Available"}
                    </p>

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
                          onChange={(e) => setRemarks(e.target.value)}
                          value={remarks}
                          className="w-full h-24 p-2 border rounded"
                          placeholder="Enter your reason here..."
                        ></textarea>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              variant="outline"
                              onClick={() => {
                                /* Add your confirm logic here */
                              }}
                            >
                              Cancel
                            </Button>
                          </DialogClose>

                          <Form method="post">
                            <input
                              type="hidden"
                              name="panelId"
                              value={userData.id}
                            />

                            <input
                              type="hidden"
                              name="remarks"
                              value={remarks}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value={"reject"}
                            />
                            <input
                              type="hidden"
                              name="thesisId"
                              value={val._id}
                            />
                            <Button
                              disabled={navigation.state === "submitting"}
                              type="submit"
                              className="cursor-pointer"
                              variant="destructive"
                              onClick={() => {
                                /* Add your confirm logic here */
                              }}
                            >
                              {navigation.state === "submitting" ? (
                                <>
                                  <Loader2 className="animate-spin" />
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
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
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
    </div>
  );
};

export default MyStudent;
