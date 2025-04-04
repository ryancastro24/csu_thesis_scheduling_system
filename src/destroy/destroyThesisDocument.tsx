import { redirect, ActionFunction } from "react-router-dom";
import { deleteThesisDocument } from "@/backend_api/thesisDocument";
export const action: ActionFunction = async ({ params }) => {
  if (params && params.caseId) {
    console.log("cased id:", params.caseId);
    const data = await deleteThesisDocument(params.caseId);

    return data;
  }
  return redirect("/");
};
