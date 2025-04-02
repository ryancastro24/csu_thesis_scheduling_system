import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaCalendar } from "react-icons/fa";
import { PiUsersFill } from "react-icons/pi";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { IoIosSchool } from "react-icons/io";
import { AiFillSchedule } from "react-icons/ai";
import { LuBellRing } from "react-icons/lu";
import { BiSolidDashboard } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  useLocation,
  useNavigate,
  Outlet,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { redirect } from "react-router-dom";
import { getUserThesisDocuments } from "@/backend_api/schedules";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/systemComponents/Loader";
export const loader = async () => {
  if (!isAuthenticated()) {
    return redirect("/"); // Redirect to login if not authenticated
  }

  const user = localStorage.getItem("user");

  const userData: any = JSON.parse(user as any);

  const userThesisDocuments = await getUserThesisDocuments(userData.id);

  return { userData, userThesisDocuments }; // Proceed if authenticated
};
const Dashboard = () => {
  const navigation = useNavigation();
  const { userData, userThesisDocuments } = useLoaderData();
  const [openNotification, setOpenNotification] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const handleDialogClose = () => {
    setOpenNotification(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    navigate("/"); // Redirect to login page
  };
  return (
    <div className="w-full font-[Poppins] h-screen grid gap-3 p-3 grid-cols-[200px_1fr] dark:bg-[#121212]">
      <div className="w-full h-full bg-slate-50 rounded-lg dark:bg-[#1E1E1E] px-2 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-lg ">{userData.firstname}</h1>
            <h2 className="text-xs  ">{userData.id_number}</h2>
          </div>
        </div>
        <Separator />
        <div>
          <ul className="w-full px-2 flex flex-col gap-3">
            <h2 className="text-sm mt-4 py-2 px-3 rounded dark:bg-[#303030] bg-slate-200">
              Navigation
            </h2>

            <li
              onClick={() => navigate("/")}
              className={`hover:bg-orange-500 ${
                location.pathname === "/dashboard"
                  ? "bg-orange-500 text-white"
                  : ""
              } hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
            >
              <span className="text-lg">
                <BiSolidDashboard />
              </span>
              Dashboard
            </li>

            {userData.userType === "admin" && (
              <li
                onClick={() => navigate("/dashboard/users")}
                className={`hover:bg-orange-500 ${
                  location.pathname === "/dashboard/users"
                    ? "bg-orange-500 text-white"
                    : ""
                } hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
              >
                <span className="text-lg">
                  <PiUsersFill />
                </span>
                Active users
              </li>
            )}

            {["admin", "chairperson", "faculty"].includes(
              userData.userType
            ) && (
              <li
                onClick={() => navigate("/dashboard/calendar")}
                className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                  location.pathname === "/dashboard/calendar"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                <span className="text-md">
                  <FaCalendar />
                </span>
                My calendar
              </li>
            )}

            {userData.userType === "faculty" && (
              <li
                onClick={() => navigate("/dashboard/students")}
                className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                  location.pathname === "/dashboard/students"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                <span className="text-lg">
                  <IoIosSchool />
                </span>
                My Advisees
              </li>
            )}

            {["chairperson", "admin"].includes(userData.userType) && (
              <li
                onClick={() => navigate("/dashboard/schedules")}
                className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                  location.pathname === "/dashboard/schedules"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                <span className="text-lg">
                  <AiFillSchedule />
                </span>
                Schedules
              </li>
            )}

            <h2 className="text-sm mt-4 py-2 px-3 rounded dark:bg-[#303030] bg-slate-200">
              User Profile
            </h2>

            <li
              onClick={() => navigate("/dashboard/manageprofile")}
              className={`hover:bg-orange-500 ${
                location.pathname === "/dashboard/manageprofile"
                  ? "bg-orange-500 text-white"
                  : ""
              } hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
            >
              <span className="text-lg">
                <FaUserEdit />{" "}
              </span>{" "}
              Manage Profile
            </li>

            <li
              onClick={() => navigate("/dashboard/favorites")}
              className={`hover:bg-orange-500 ${
                location.pathname === "/dashboard/favorites"
                  ? "bg-orange-500 text-white"
                  : ""
              } hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
            >
              <span className="text-lg">
                <FaStar />
              </span>
              My Favorites
            </li>
          </ul>
        </div>

        {/*end sidebar */}
      </div>

      <div className="w-full h-full">
        <div className="w-full rounded-lg  dark:bg-[#1E1E1E] bg-slate-50 h-full p-3">
          <div className="w-full h-[50px] flex  justify-between">
            <div>
              {location.pathname === "/dashboard" && (
                <h1 className="ml-3 mt-3">Top 3 Thesis of the semester</h1>
              )}
              {location.pathname === "/dashboard/users" && (
                <h1 className="ml-3 mt-3">Active Users</h1>
              )}
              {location.pathname === "/dashboard/calendar" && (
                <h1 className="ml-3 mt-3">My Calendar</h1>
              )}
              {location.pathname === "/dashboard/students" && (
                <h1 className="ml-3 mt-3">My Advisees</h1>
              )}
              {location.pathname === "/dashboard/schedules" && (
                <h1 className="ml-3 mt-3">Schedules</h1>
              )}

              {location.pathname === "/dashboard/manageprofile" && (
                <h1 className="ml-3 mt-3">Manage Profile</h1>
              )}

              {location.pathname === "/dashboard/favorites" && (
                <h1 className="ml-3 mt-3">My Favorites</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />

              <div className="relative">
                {userThesisDocuments.lenght < 1 && (
                  <Badge
                    className="absolute -top-3 -right-2 rounded-full "
                    variant="destructive"
                  >
                    {userThesisDocuments.length}
                  </Badge>
                )}

                <Button
                  onClick={() => setOpenNotification(true)}
                  className="cursor-pointer "
                  variant="outline"
                  size="icon"
                >
                  <LuBellRing />
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="icon"
                  >
                    <LuLogOut />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to log out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your account and redirect you to
                      the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={handleLogout}
                    >
                      Confirm Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Add Schedule Dialog */}
          <Dialog open={openNotification} onOpenChange={setOpenNotification}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                {userThesisDocuments.map((val: any) => (
                  <Card
                    key={val._id}
                    className="dark:bg-[#303030] bg-slate-100"
                  >
                    <CardHeader>
                      <CardTitle>{val.thesisTitle}</CardTitle>
                      <CardDescription>
                        Date: {val.schedule?.date} | Time: {val.schedule?.time}
                      </CardDescription>
                      <CardDescription>
                        Authors:{" "}
                        {val.students
                          ?.map(
                            (student: any) =>
                              `${student.firstname} ${student.lastname}`
                          )
                          .join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="destructive">Reject</Button>
                      <Button variant="default">Approve</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <DialogFooter>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div>{navigation.state === "loading" ? <Loader /> : <Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
