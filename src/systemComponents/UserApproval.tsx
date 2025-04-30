import { redirect, ActionFunction } from "react-router-dom";
import { approvedUser } from "@/backend_api/users";
export const action: ActionFunction = async ({ params }) => {
  if (params && params.userId) {
    console.log("user id for approval: ", params.userId);
    const data = await approvedUser(params.userId);

    return data;
  }
  return redirect("/");
};
