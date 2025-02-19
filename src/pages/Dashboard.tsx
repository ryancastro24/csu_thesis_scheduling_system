import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaCalendar } from "react-icons/fa";
import { PiUsersFill } from "react-icons/pi";
import { ModeToggle } from "@/components/mode-toggle";

import { IoIosSchool } from "react-icons/io";
import { AiFillSchedule } from "react-icons/ai";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
const Dashboard = () => {
  const location = useLocation();
  console.log(location.pathname);
  const navigate = useNavigate();
  return (
    <div className="w-full font-[Poppins] h-screen grid gap-3 p-3 grid-cols-[200px_1fr] dark:bg-[#121212]">
      <div className="w-full h-full bg-slate-50 rounded-lg dark:bg-[#1E1E1E] px-2 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-lg ">Hello, Ryan</h1>
            <h2 className="text-xs  ">181-02048</h2>
          </div>
        </div>
        <Separator />
        <div>
          <ul className="w-full px-2 flex flex-col gap-3">
            <li
              onClick={() => navigate("/dashboard/users")}
              className={`hover:bg-orange-500 ${
                location.pathname === "/dashboard/users"
                  ? "bg-orange-500 text-white"
                  : ""
              } hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 `}
            >
              <span className="text-lg">
                <PiUsersFill />{" "}
              </span>{" "}
              Active users
            </li>

            <li
              onClick={() => navigate("/dashboard/calendar")}
              className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                location.pathname === "/dashboard/calendar"
                  ? "bg-orange-500 text-white"
                  : ""
              } `}
            >
              <span className="text-md">
                {" "}
                <FaCalendar />{" "}
              </span>{" "}
              My calendar
            </li>

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
              My students
            </li>

            <li
              onClick={() => navigate("/dashboard/schedules")}
              className={`hover:bg-orange-500 hover:text-white flex items-center gap-2 rounded cursor-pointer text-sm px-3 py-2 ${
                location.pathname === "/dashboard/schedules"
                  ? "bg-orange-500 text-white"
                  : ""
              } `}
            >
              <span className="text-lg">
                <AiFillSchedule />
              </span>{" "}
              Schedules
            </li>
          </ul>
        </div>

        {/*end sidebar */}
      </div>

      <div className="w-full h-full">
        <div className="w-full rounded-lg  dark:bg-[#1E1E1E] bg-slate-50 h-full p-3">
          <div className="w-full h-[50px] flex  justify-between">
            <div>
              {location.pathname === "/dashboard/users" && (
                <h1 className="ml-3 mt-3">Active Users</h1>
              )}
              {location.pathname === "/dashboard/calendar" && (
                <h1 className="ml-3 mt-3">My Calendar</h1>
              )}
              {location.pathname === "/dashboard/students" && (
                <h1 className="ml-3 mt-3">My Students</h1>
              )}
              {location.pathname === "/dashboard/schedules" && (
                <h1 className="ml-3 mt-3">Schedules</h1>
              )}
            </div>
            <div className="">
              <ModeToggle />
            </div>
          </div>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
