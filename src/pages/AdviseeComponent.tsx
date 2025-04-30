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
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const studentThesis = await getThesisByAdviser(userData.id);
  return { userData, studentThesis };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  const thesisDefended = await updateThesisDefended(data.id);
  return thesisDefended;
};

const AdviseeComponent = () => {
  const { studentThesis } = useLoaderData();

  console.log("thesis:", studentThesis);
  return (
    <div className="grid grid-cols-3 gap-4">
      {studentThesis.map((thesis: any) => (
        <Card className="dark:bg-[#303030]" key={thesis._id}>
          <CardHeader>
            <CardTitle>{thesis.thesisTitle}</CardTitle>
            <CardDescription>
              Authors:{" "}
              {thesis.students
                ?.map((student: any) => student.lastname)
                .join(", ")}
            </CardDescription>

            <CardDescription>
              Type: {thesis.type} | Defense Date:{" "}
              {thesis?.schedule?.date || "No schedule yet"}
            </CardDescription>
          </CardHeader>

          <CardFooter>
            {thesis.defended ? (
              <Button variant={"secondary"} disabled>
                Thesis Successfully Defended
              </Button>
            ) : thesis.schedule?.date ? (
              <Form method="PUT">
                <input type="hidden" name="id" value={thesis._id} />
                <Button className="flex items-center gap-2" type="submit">
                  Thesis Defended
                </Button>
              </Form>
            ) : (
              <Button variant={"secondary"} disabled>
                Thesis process ongoing
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AdviseeComponent;
