import { getAllnotifications } from "@/backend_api/notification";
import { useLoaderData } from "react-router-dom";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);
  const allNotifications = await getAllnotifications();

  return { userData, allNotifications };
};

const LogsPage = () => {
  const { allNotifications } = useLoaderData();

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-screen scrollbar-hidden">
      {allNotifications.map((notification: any) => (
        <Card
          className={`${
            notification.read ? "dark:bg-[#303030]" : "dark:bg-[#5f5f5f]"
          }`}
          key={notification._id}
        >
          <CardHeader>
            <CardTitle>{notification?.thesisId?.thesisTitle}</CardTitle>
            <CardDescription>
              Date: {notification.thesisId.schedule?.date} | Time:{" "}
              {notification.thesisId.schedule?.time}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-between gap-10">
            <div className="flex flex-col">
              <span className="text-sm">
                <strong className="italic">Name:</strong>{" "}
                {notification.userId?.name}
              </span>
              <span className="text-sm">
                <strong className="italic">Remarks:</strong>{" "}
                {notification.remarks}
              </span>
            </div>
            <span
              className={`px-3 py-2 text-md rounded font-bold italic  ${
                notification.status === "approve"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {notification.status}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LogsPage;
