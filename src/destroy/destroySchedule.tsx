import { redirect, ActionFunction } from "react-router-dom";
import { deleteUserSchedule } from "@/backend_api/schedules";
export const action: ActionFunction = async ({ params }) => {
  if (params && params.scheduleId) {
    console.log(params.scheduleId);
    const data = await deleteUserSchedule(params.scheduleId);

    return data;
  }
  return redirect("/");
};
