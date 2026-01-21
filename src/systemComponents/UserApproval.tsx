import { redirect, ActionFunction } from "react-router-dom";
import { approvedUser } from "@/backend_api/users";

export const action: ActionFunction = async ({ params }) => {
  console.log("params in user approval action", params.userId);
  if (params?.userId) {
    const data = await approvedUser(params.userId);

    console.log("approved user action data", data);
    return data;
  }
  return redirect("/");
};
