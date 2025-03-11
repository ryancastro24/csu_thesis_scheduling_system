import { redirect, ActionFunction } from "react-router-dom";
import { deleteUserData } from "@/backend_api/users";
export const action: ActionFunction = async ({ params }) => {
  if (params && params.userId) {
    console.log(params.userId);
    const data = await deleteUserData(params.userId);

    return data;
  }
  return redirect("/");
};
