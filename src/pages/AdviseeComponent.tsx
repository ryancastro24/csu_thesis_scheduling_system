import { useState } from "react";
import { getThesisByAdviser } from "@/backend_api/thesisDocument";
import { useLoaderData, Form, ActionFunction } from "react-router-dom";
import { updateThesisDefended } from "@/backend_api/thesisDocument";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* =======================
   LOADER
======================= */
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const studentThesis = await getThesisByAdviser(userData.id);
  return { userData, studentThesis };
};

/* =======================
   ACTION
======================= */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  console.log("submitted data:", data);

  // { id, status }
  return await updateThesisDefended(data.id, data.status);
};

/* =======================
   COMPONENT
======================= */
const AdviseeComponent = () => {
  const { studentThesis }: any = useLoaderData();

  const [selectedType, setSelectedType] = useState<
    "all" | "proposal" | "final"
  >("all");

  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Holds select value per thesis
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>(
    {}
  );

  /* =======================
     FILTER + SEARCH
  ======================= */
  const filteredThesis = studentThesis.filter((thesis: any) => {
    const matchesType = selectedType === "all" || thesis.type === selectedType;

    const searchableText = `
      ${thesis.thesisTitle}
      ${thesis.students?.map((s: any) => s.lastname).join(" ")}
    `.toLowerCase();

    return matchesType && searchableText.includes(searchTerm.toLowerCase());
  });

  /* =======================
     STATUS LABEL STYLES
  ======================= */
  const statusColor = (status: string) => {
    switch (status) {
      case "defended":
        return "bg-green-500 dark:bg-green-700";
      case "minor revision":
        return "bg-yellow-400 dark:bg-yellow-600";
      case "major revision":
        return "bg-orange-500 dark:bg-orange-700";
      case "re-defense":
        return "bg-red-500 dark:bg-red-700";
      default:
        return "bg-gray-400 dark:bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* =======================
         SEARCH + FILTER
      ======================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <Input
          placeholder="Search by thesis title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-[300px]"
        />

        <div className="flex gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
          >
            All
          </Button>
          <Button
            variant={selectedType === "proposal" ? "default" : "outline"}
            onClick={() => setSelectedType("proposal")}
          >
            Proposal
          </Button>
          <Button
            variant={selectedType === "final" ? "default" : "outline"}
            onClick={() => setSelectedType("final")}
          >
            Final
          </Button>
        </div>
      </div>

      {/* =======================
         CARDS
      ======================= */}
      {filteredThesis.length === 0 ? (
        <p className="text-center text-muted-foreground">No thesis found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredThesis.map((thesis: any) => (
            <Card key={thesis._id} className="dark:bg-[#303030]">
              <CardHeader>
                <CardTitle>{thesis.thesisTitle}</CardTitle>

                <CardDescription>
                  Authors:{" "}
                  {thesis.students?.map((s: any) => s.lastname).join(", ")}
                </CardDescription>

                <CardDescription>
                  Type: {thesis.type} | Defense Date:{" "}
                  {thesis?.schedule?.date || "No schedule yet"}
                </CardDescription>

                {thesis.defended && (
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm rounded text-white ${statusColor(
                      thesis.defended
                    )}`}
                  >
                    {thesis.defended.toUpperCase()}
                  </span>
                )}
              </CardHeader>

              <CardFooter className="flex flex-col gap-3">
                {thesis.schedule?.date ? (
                  <Form method="put" className="w-full space-y-2">
                    <input type="hidden" name="id" value={thesis._id} />

                    {/* 🔥 IMPORTANT: this makes the value submit correctly */}
                    <input
                      type="hidden"
                      name="status"
                      value={
                        selectedStatus[thesis._id] || thesis.defended || ""
                      }
                    />

                    <Select
                      value={
                        selectedStatus[thesis._id] || thesis.defended || ""
                      }
                      onValueChange={(value) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [thesis._id]: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defended">Defended</SelectItem>
                        <SelectItem value="re-defense">Re-defense</SelectItem>
                        <SelectItem value="minor revision">
                          Minor Revision
                        </SelectItem>
                        <SelectItem value="major revision">
                          Major Revision
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!selectedStatus[thesis._id]}
                    >
                      Submit Result
                    </Button>
                  </Form>
                ) : (
                  <Button variant="secondary" disabled className="w-full">
                    Thesis process ongoing
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdviseeComponent;
