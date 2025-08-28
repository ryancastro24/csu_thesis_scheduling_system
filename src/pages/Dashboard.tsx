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
import { Loader2 } from "lucide-react";
import { LuLogs } from "react-icons/lu";
import { IoIosDocument } from "react-icons/io";
import { FaCodePullRequest } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";

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
import { Form, ActionFunction } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { redirect } from "react-router-dom";
import { getUserThesisDocuments } from "@/backend_api/schedules";
import { updateThesisDocument } from "@/backend_api/thesisDocument";
import {
  getAllnotificationsReaded,
  updateNotifications,
} from "@/backend_api/notification";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPanelApprovals } from "@/backend_api/panelApproval";
import { getAdviserAcceptanceRequests } from "@/backend_api/adviserAcceptance";
import { getUserProfile, getRequestingUsers } from "@/backend_api/users";
import Loader from "@/systemComponents/Loader";
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );
  console.log("submitted data:", data);

  const { thesisId, panelId, status, remarks } = data;

  if (request.method === "PUT") {
    const updatedNotification = await updateNotifications(data.id);
    return { updatedNotification };
  }

  if (request.method === "POST") {
    const updatedThesis = await updateThesisDocument(thesisId, panelId, {
      status,
      remarks,
    });

    return { updatedThesis };
  }
};

export const loader = async () => {
  if (!isAuthenticated()) {
    return redirect("/"); // Redirect to login if not authenticated
  }

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null; // Ensure userData is not null
  const userThesisDocuments = await getUserThesisDocuments(userData?.id);
  const panelApprovals = await getPanelApprovals(userData.id);
  const adviserAcceptanaceData = await getAdviserAcceptanceRequests(
    userData.id
  );

  const requestingUsersData = await getRequestingUsers();

  const userProfile = await getUserProfile(userData.id);
  const notifications = await getAllnotificationsReaded();
  return {
    userData,
    userThesisDocuments,
    notifications,
    panelApprovals,
    adviserAcceptanaceData,
    userProfile,
    requestingUsersData,
  }; // Proceed if authenticated
};

interface DialogData {
  open: boolean;
  action: string;
  thesis: {
    _id: string;
    thesisTitle: string;
    schedule: { date: string; time: string };
    students: { firstname: string; lastname: string }[];
  } | null; // Define the structure of thesis
}

const Dashboard = () => {
  const navigation = useNavigation();
  const {
    userData,
    userThesisDocuments,
    notifications,
    panelApprovals,
    adviserAcceptanaceData,
    userProfile,
    requestingUsersData,
  } = useLoaderData();
  const [openNotification, setOpenNotification] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [dialogData, setDialogData] = useState<DialogData>({
    open: false,
    action: "",
    thesis: null,
  });
  const location = useLocation();
  const navigate = useNavigate();

  console.log("User Data:", userData);
  console.log("User Thesis Documents:", userThesisDocuments);
  console.log("Notifications:", notifications);
  console.log("requesting users", requestingUsersData);
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
            <AvatarImage src={userProfile.profilePicture} />
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

            {userData.userType === "student" && (
              <li
                onClick={() => navigate("/dashboard/thesisSection")}
                className={`hover:bg-orange-500 ${
                  location.pathname === "/dashboard/thesisSection"
                    ? "bg-orange-500 text-white"
                    : ""
                } hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
              >
                <span className="text-lg">
                  <IoIosDocument />
                </span>
                Thesis section
              </li>
            )}

            {userData.userType === "admin" && (
              <li
                onClick={() => navigate("/dashboard/users")}
                className={`hover:bg-orange-500 ${
                  location.pathname === "/dashboard/users"
                    ? "bg-orange-500 text-white"
                    : ""
                } hover:text-white relative flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
              >
                <span className="text-lg">
                  <PiUsersFill />
                </span>
                {requestingUsersData?.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2"
                  >
                    {requestingUsersData.length}
                  </Badge>
                )}
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

            {["chairperson", "faculty"].includes(userData.userType) && (
              <>
                <li
                  onClick={() => navigate("/dashboard/students")}
                  className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                    location.pathname === "/dashboard/students"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  <span className="text-lg">
                    <FaUserGraduate />
                  </span>
                  Thesis Reviews
                </li>

                <li
                  onClick={() => navigate("/dashboard/advisees")}
                  className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                    location.pathname === "/dashboard/advisees"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  <span className="text-lg">
                    <FaUserFriends />
                  </span>
                  My Advisees
                </li>

                <li
                  onClick={() => navigate("/dashboard/panelProposals")}
                  className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 relative ${
                    location.pathname === "/dashboard/panelProposals"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  <span className="text-lg">
                    <IoIosSchool />
                  </span>
                  <span className="flex items-center">Panel Proposals</span>
                  {panelApprovals?.filter(
                    (approval: any) => approval.status === "pending"
                  ).length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                    >
                      {
                        panelApprovals.filter(
                          (approval: any) => approval.status === "pending"
                        ).length
                      }
                    </Badge>
                  )}
                </li>

                <li
                  onClick={() => navigate("/dashboard/proposals")}
                  className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 relative ${
                    location.pathname === "/dashboard/proposals"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  <span className="text-lg">
                    <FaCodePullRequest />
                  </span>
                  Proposals
                  {adviserAcceptanaceData?.filter(
                    (acceptance: any) => acceptance.status === "pending"
                  ).length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                    >
                      {
                        adviserAcceptanaceData.filter(
                          (acceptance: any) => acceptance.status === "pending"
                        ).length
                      }
                    </Badge>
                  )}
                </li>
              </>
            )}

            {["chairperson"].includes(userData.userType) && (
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

            {["chairperson", "admin"].includes(userData.userType) && (
              <li
                onClick={() => navigate("/dashboard/logs")}
                className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                  location.pathname === "/dashboard/logs"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                <span className="text-lg">
                  <LuLogs />
                </span>
                Logs
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
                <h1 className="ml-3 mt-3">My Thesis Schedules</h1>
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

              {location.pathname === "/dashboard/advisees" && (
                <h1 className="ml-3 mt-3">My Advicees</h1>
              )}
              {location.pathname === "/dashboard/logs" && (
                <h1 className="ml-3 mt-3">Logs</h1>
              )}

              {location.pathname === "/dashboard/proposals" && (
                <h1 className="ml-3 mt-3">Thesis Proposals</h1>
              )}
              {location.pathname === "/dashboard/panelProposals" && (
                <h1 className="ml-3 mt-3">Panel Proposals</h1>
              )}
              {location.pathname === "/dashboard/thesisSection" && (
                <h1 className="ml-3 mt-3">Thesis Journey</h1>
              )}
              {location.pathname === "/dashboard/view" && (
                <div className="flex items-center justify-center gap-10">
                  <h1 className="ml-3 mt-3">PDF Viewer</h1>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />

              <div className="relative">
                {userThesisDocuments.length > 0 ||
                  (notifications.length > 0 &&
                    userData.userType === "chairperson" &&
                    (userThesisDocuments.length > 0 ||
                      notifications.length > 0) && (
                      <Badge
                        className="absolute -top-3 -right-2 rounded-full"
                        variant="destructive"
                      >
                        {userThesisDocuments.length + notifications.length}
                      </Badge>
                    ))}

                {userThesisDocuments.length > 0 &&
                  userData.userType === "faculty" &&
                  (userThesisDocuments.length > 0 ||
                    notifications.length > 0) && (
                    <Badge
                      className="absolute -top-3 -right-2 rounded-full"
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
            <DialogContent className="max-h-[80vh] overflow-y-auto w-[650px]">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                {(userData.userType === "chairperson" ||
                  userData.userType === "admin") &&
                  (notifications.length === 0 ? (
                    <p>No logs available.</p>
                  ) : (
                    notifications.map((val: any) => (
                      <Card
                        key={val._id}
                        className="dark:bg-[#303030] bg-slate-100"
                      >
                        <CardHeader>
                          <CardTitle>{val?.thesisId?.thesisTitle}</CardTitle>
                          <CardDescription>
                            Date: {val.thesisId?.schedule?.date} | Time:{" "}
                            {val.thesisId?.schedule?.time}
                          </CardDescription>
                          <CardDescription className="flex items-center justify-between">
                            <span>{val.userId?.name}</span>
                            <span
                              className={`px-3 py-2 text-md rounded font-bold italic  ${
                                val.status === "approve"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {val.status}
                            </span>

                            <Form method="PUT">
                              <input type="hidden" name="id" value={val._id} />
                              <Button
                                className="cursor-pointer"
                                variant={"secondary"}
                              >
                                Mark as read
                              </Button>
                            </Form>
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))
                  ))}

                {userData.userType === "faculty" ? (
                  // faculty view
                  userThesisDocuments.length === 0 ? (
                    <p>No panel Schedules available.</p>
                  ) : (
                    userThesisDocuments.map((val: any) => (
                      <Card
                        key={val._id}
                        className="dark:bg-[#303030] bg-slate-100"
                      >
                        <CardHeader>
                          <CardTitle>{val.thesisTitle}</CardTitle>
                          <CardDescription>
                            Date: {val.schedule?.date} | Time:{" "}
                            {val.schedule?.time}
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
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setOpenNotification(false);
                              setDialogData({
                                open: true,
                                action: "Reject",
                                thesis: val,
                              });
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              setOpenNotification(false);
                              setDialogData({
                                open: true,
                                action: "Approve",
                                thesis: val,
                              });
                            }}
                          >
                            Approve
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )
                ) : userData.userType === "chairperson" ? (
                  // chairperson view
                  userThesisDocuments.length === 0 ? (
                    <p>No panel Schedules available.</p>
                  ) : (
                    userThesisDocuments.map((val: any) => (
                      <Card
                        key={val._id}
                        className="dark:bg-[#303030] bg-slate-100"
                      >
                        <CardHeader>
                          <CardTitle>{val.thesisTitle}</CardTitle>
                          <CardDescription>
                            Date: {val.schedule?.date} | Time:{" "}
                            {val.schedule?.time}
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
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setOpenNotification(false);
                              setDialogData({
                                open: true,
                                action: "Reject",
                                thesis: val,
                              });
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              setOpenNotification(false);
                              setDialogData({
                                open: true,
                                action: "Approve",
                                thesis: val,
                              });
                            }}
                          >
                            Approve
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )
                ) : null}
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

          <Dialog
            open={dialogData.open}
            onOpenChange={() => setDialogData({ ...dialogData, open: false })}
          >
            <DialogContent className="w-[500px]">
              <DialogHeader>
                <DialogTitle>{dialogData.action}</DialogTitle>
              </DialogHeader>
              <textarea
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
                placeholder="Please provide a reason..."
                className="w-full h-24 p-2 border rounded"
              />
              <DialogFooter>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  onClick={() => setDialogData({ ...dialogData, open: false })}
                >
                  Cancel
                </Button>

                <Form method="post">
                  <input type="hidden" name="panelId" value={userData.id} />

                  <input type="hidden" name="remarks" value={remarks} />
                  <input
                    type="hidden"
                    name="status"
                    value={dialogData.action.toLowerCase()}
                  />
                  <input
                    type="hidden"
                    name="thesisId"
                    value={dialogData.thesis?._id}
                  />
                  <Button
                    onClick={() => {
                      setDialogData({ ...dialogData, open: false });
                    }}
                    className={`${
                      dialogData.action === "Reject"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    type="submit"
                    disabled={navigation.state === "submitting"}
                  >
                    {navigation.state === "submitting" ? (
                      <h2>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        `Submit ${dialogData.action}`
                      </h2>
                    ) : (
                      `Submit ${dialogData.action}`
                    )}
                  </Button>
                </Form>
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
